import { Router } from 'express';
import mongoose from 'mongoose';
import { difference } from 'lodash';

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
					path: 'orderedReceiptsPositions.position',
					populate: [
						{
							path: 'childPosition',
							select: 'name characteristics',
							populate: {
								path: 'characteristics',
							},
						},
						{
							path: 'parentPosition',
							select: 'name characteristics',
							populate: {
								path: 'characteristics',
							},
						},
						{
							path: 'characteristics',
						},
					],
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
	'/getProcurementExpected',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			params: { procurementId },
		} = req.body;

		Procurement.findById(procurementId)
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
					path: 'orderedReceiptsPositions.position',
					populate: [
						{
							path: 'childPosition',
							select: 'name characteristics',
							populate: {
								path: 'characteristics',
							},
						},
						{
							path: 'parentPosition',
							select: 'name characteristics',
							populate: {
								path: 'characteristics',
							},
						},
						{
							path: 'characteristics',
						},
					],
				},
				{
					path: 'shop',
				},
			])
			.then(procurement => res.json(procurement))
			.catch(err => next({ code: 2, err }));
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

		const positions = await Position.find({ _id: { $in: newProcurementValues.positions } })
			.lean()
			.catch(err => next({ code: 2, err }));

		const newProcurement = new Procurement({
			...newProcurementValues,
			studio: studioId,
			orderedByMember: memberId,
			status: 'expected',
		});

		const positionsDeleteStoreNotification = newProcurementValues.orderedReceiptsPositions.map(({ position: positionId }) => {
			const position = positions.find(position => String(position._id) === positionId);

			return 'childPosition' in position ? position.childPosition : position._id;
		});

		const newProcurementErr = newProcurement.validateSync();

		if (newProcurementErr) return next({ code: newProcurementErr.errors ? 5 : 2, err: newProcurementErr });

		const positionsUpdate = Position.updateMany(
			{ _id: { $in: newProcurement.positions } },
			{ $push: { deliveryIsExpected: newProcurement._id } }
		).catch(err => next({ code: 2, err }));

		await Promise.all([newProcurement.save(), positionsUpdate]);

		Emitter.emit('newStoreNotification', {
			studio: studioId,
			type: 'delivery-is-expected',
			procurement: newProcurement._id,
		});

		positionsDeleteStoreNotification.forEach(positionId => {
			Emitter.emit('deleteStoreNotification', {
				studio: studioId,
				type: 'position-ends',
				position: positionId,
			});
		});

		Procurement.findById(newProcurement._id)
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
					path: 'orderedReceiptsPositions.position',
					populate: [
						{
							path: 'childPosition',
							select: 'name characteristics',
							populate: {
								path: 'characteristics',
							},
						},
						{
							path: 'parentPosition',
							select: 'name characteristics',
							populate: {
								path: 'characteristics',
							},
						},
						{
							path: 'characteristics',
						},
					],
				},
				{
					path: 'shop',
				},
			])
			.then(procurement => res.json(procurement))
			.catch(err => next({ code: 2, err }));
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

		const oldPositions = procurement.positions.slice().map(positionId => String(positionId));

		Object.keys(procurementEdited).forEach(procurementParamEdited => {
			procurement[procurementParamEdited] = procurementEdited[procurementParamEdited];
		});

		const positionsRemoved = difference(oldPositions, procurement.positions);
		const positionsAdded = difference(procurement.positions, oldPositions);

		const procurementErr = procurement.validateSync();

		if (procurementErr) return next({ code: procurementErr.errors ? 5 : 2, err: procurementErr });

		if (positionsRemoved) {
			await Position.updateMany({ _id: { $in: positionsRemoved } }, { $pull: { deliveryIsExpected: procurement._id } }).catch(err =>
				next({ code: 2, err })
			);
		}
		if (positionsAdded) {
			await Position.updateMany({ _id: { $in: positionsAdded } }, { $push: { deliveryIsExpected: procurement._id } }).catch(err =>
				next({ code: 2, err })
			);
		}

		await procurement.save();

		Emitter.emit('editStoreNotification', {
			studio: studioId,
			type: 'delivery-is-expected',
			procurement: procurement._id,
		});

		Procurement.findById(procurement._id)
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
					path: 'orderedReceiptsPositions.position',
					populate: [
						{
							path: 'childPosition',
							select: 'name characteristics',
							populate: {
								path: 'characteristics',
							},
						},
						{
							path: 'parentPosition',
							select: 'name characteristics',
							populate: {
								path: 'characteristics',
							},
						},
						{
							path: 'characteristics',
						},
					],
				},
				{
					path: 'shop',
				},
			])
			.then(procurement => res.json(procurement))
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
