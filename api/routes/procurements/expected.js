import { Router } from 'express';

import { isAuthedResolver, hasPermissions } from 'api/utils/permissions';

import Emitter from 'api/utils/emitter';

import mongoose from 'mongoose';
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
					path: 'receivedByMember',
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

		Emitter.emit('createStoreNotification', {
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
					path: 'receivedByMember',
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

		procurement.shop = procurementEdited.shop;
		procurement.deliveryDate = procurementEdited.deliveryDate;
		procurement.deliveryTimeFrom = procurementEdited.deliveryTimeFrom;
		procurement.deliveryTimeTo = procurementEdited.deliveryTimeTo;
		procurement.pricePositions = procurementEdited.pricePositions;
		procurement.costDelivery = procurementEdited.costDelivery;
		procurement.totalPrice = procurementEdited.totalPrice;
		procurement.positions = procurementEdited.positions;

		const procurementErr = procurement.validateSync();

		if (procurementErr) return next({ code: procurementErr.errors ? 5 : 2, err: procurementErr });

		await Promise.all([procurement.save()]);

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
					path: 'receivedByMember',
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
