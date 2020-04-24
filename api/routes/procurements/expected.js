import { Router } from 'express';

import { isAuthedResolver, hasPermissions } from 'api/utils/permissions';

import Position from 'api/models/position';
import Procurement from 'api/models/procurement';

const procurementsRouter = Router();

// const debug = require('debug')('api:products');

procurementsRouter.post(
	'/getProcurementsExpected',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const { studioId } = req.body;

		const conditions = {
			studio: studioId,
			status: 'expected',
		};

		const procurementsPromise = Procurement.find(conditions)
			.sort({ createdAt: -1 })
			.lean()
			.populate([
				{
					path: 'member',
					select: 'user',
					populate: {
						path: 'user',
						select: 'avatar name email',
					},
				},
				{
					path: 'receipts',
					populate: {
						path: 'position',
						populate: {
							path: 'characteristics',
						},
					},
				},
			]);
		const procurementsCountPromise = Procurement.countDocuments(conditions);

		const procurements = await procurementsPromise;
		const procurementsCount = await procurementsCountPromise;

		res.json({
			data: procurements,
			paging: {
				totalCount: procurementsCount,
			},
		});
	}
);

procurementsRouter.post(
	'/createProcurementExpected',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			studioId,
			memberId,
			data: { procurement: newProcurementValues },
		} = req.body;

		const newProcurement = new Procurement({
			...newProcurementValues,
			studio: studioId,
			member: memberId,
			status: 'expected',
		});

		const positionUpdated = Position.updateMany({ _id: { $in: newProcurement.positions } }, { deliveryIsExpected: true }).catch(err =>
			next({ code: 2, err })
		);

		const newProcurementErr = newProcurement.validateSync();

		if (newProcurementErr) return next({ code: newProcurementErr.errors ? 5 : 2, err: newProcurementErr });

		await Promise.all([newProcurement.save(), positionUpdated]);

		const procurement = await Procurement.findById(newProcurement._id)
			.populate([
				{
					path: 'member',
					populate: {
						path: 'user',
						select: 'avatar name email',
					},
				},
				{
					path: 'positions',
					populate: {
						path: 'characteristics',
					},
				},
			])
			.catch(err => next({ code: 2, err }));

		res.json(procurement);
	}
);

export default procurementsRouter;
