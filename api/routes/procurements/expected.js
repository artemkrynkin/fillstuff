import { Router } from 'express';
import mongoose from 'mongoose';

import { isAuthedResolver, hasPermissions } from 'api/utils/permissions';

import Emitter from 'api/utils/emitter';

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
			studio: mongoose.Types.ObjectId(studioId),
			status: 'expected',
		};

		const procurementsPromise = Procurement.find(conditions)
			.sort({ createdAt: -1 })
			.lean()
			.populate([
				{
					path: 'orderedByMember',
					select: 'user',
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
				{
					path: 'shop',
				},
			])
			.catch(err => next({ code: 2, err }));

		// {
		//   $lookup: {
		//     from: 'members',
		//     localField: 'orderedByMember',
		//     foreignField: '_id',
		//     as: 'orderedByMember'
		//   }
		// },

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
			orderedByMember: memberId,
			status: 'expected',
		});

		const positionUpdated = Position.updateMany(
			{ _id: { $in: newProcurement.positions } },
			{ $push: { deliveryIsExpected: newProcurement._id } }
		).catch(err => next({ code: 2, err }));

		const newProcurementErr = newProcurement.validateSync();

		if (newProcurementErr) return next({ code: newProcurementErr.errors ? 5 : 2, err: newProcurementErr });

		await Promise.all([newProcurement.save(), positionUpdated]);

		Emitter.emit('newStoreNotification', {
			studio: studioId,
			type: 'delivery-is-expected',
			procurement: newProcurement._id,
		});

		const procurement = await Procurement.findById(newProcurement._id)
			.populate([
				{
					path: 'orderedByMember',
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
				{
					path: 'shop',
				},
			])
			.catch(err => next({ code: 2, err }));

		procurement.positions.forEach(position => {
			Emitter.emit('deleteStoreNotification', {
				studio: studioId,
				type: 'position-ends',
				position: position._id,
			});
		});

		res.json(procurement);
	}
);

procurementsRouter.post(
	'/editProcurementExpected',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			studioId,
			params: { procurementId },
			data: { procurement: procurementEdited },
		} = req.body;

		const procurement = await Procurement.findById(procurementId).catch(err => next({ code: 2, err }));

		const oldPositions = procurement.positions.slice();
		const newPositions = procurementEdited.positions.slice();

		procurement.shop = procurementEdited.shop;
		procurement.isConfirmed = procurementEdited.isConfirmed;
		procurement.isUnknownDeliveryDate = procurementEdited.isUnknownDeliveryDate;
		procurement.deliveryDate = procurementEdited.deliveryDate;
		procurement.deliveryTimeFrom = procurementEdited.deliveryTimeFrom;
		procurement.deliveryTimeTo = procurementEdited.deliveryTimeTo;
		procurement.pricePositions = procurementEdited.pricePositions;
		procurement.costDelivery = procurementEdited.costDelivery;
		procurement.totalPrice = procurementEdited.totalPrice;
		procurement.positions = procurementEdited.positions;
		procurement.comment = procurementEdited.comment;

		const procurementErr = procurement.validateSync();

		if (procurementErr) return next({ code: procurementErr.errors ? 5 : 2, err: procurementErr });

		await Promise.all([procurement.save()]);

		await Position.updateMany({ _id: { $in: oldPositions } }, { $pull: { deliveryIsExpected: procurement._id } }).catch(err =>
			next({ code: 2, err })
		);
		await Position.updateMany({ _id: { $in: newPositions } }, { $push: { deliveryIsExpected: procurement._id } }).catch(err =>
			next({ code: 2, err })
		);

		Procurement.findById(procurement._id)
			.populate([
				{
					path: 'orderedByMember',
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
				{
					path: 'shop',
				},
			])
			.then(procurement => {
				Emitter.emit('editStoreNotification', {
					studio: studioId,
					type: 'delivery-is-expected',
					procurement: procurement._id,
				});

				return res.json(procurement);
			})
			.catch(err => next({ code: 2, err }));
	}
);

procurementsRouter.post(
	'/cancelProcurementExpected',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			studioId,
			params: { procurementId },
		} = req.body;

		Position.updateMany({ deliveryIsExpected: { $in: procurementId } }, { $pull: { deliveryIsExpected: procurementId } }).catch(err =>
			next({ code: 2, err })
		);

		const procurement = await Procurement.findByIdAndRemove(procurementId).catch(err => next({ code: 2, err }));

		Emitter.emit('deleteStoreNotification', {
			studio: studioId,
			type: 'delivery-is-expected',
			procurement: procurement._id,
		});

		res.json('success');
	}
);

export default procurementsRouter;
