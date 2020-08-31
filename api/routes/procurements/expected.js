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
					path: 'orderedReceiptsPositions.position',
					populate: {
						path: 'characteristics',
					},
				},
				{
					path: 'orderedReceiptsPositions.characteristics shop',
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
					populate: {
						path: 'characteristics',
					},
				},
				{
					path: 'orderedReceiptsPositions.characteristics shop',
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

		const newProcurement = new Procurement({
			...newProcurementValues,
			studio: studioId,
			orderedByMember: memberId,
			status: 'expected',
			positions: [],
		});

		const positionsInsert = [];
		const positionsErr = [];
		const positionsDeleteStoreNotification = [];
		let replacementPositionsUpdate = [];

		newProcurement.orderedReceiptsPositions = newProcurementValues.orderedReceiptsPositions.map(orderedReceiptsPositions => {
			const { position: positionTemp, ...remainingParams } = orderedReceiptsPositions;

			const position = positionTemp.notCreated ? new Position(positionTemp) : positionTemp;
			const positionId = positionTemp.notCreated ? position._id : position;

			if (positionTemp.notCreated) {
				const newPositionErr = position.validateSync();

				if (newPositionErr) positionsErr.push(newPositionErr);
				else positionsInsert.push(position);

				replacementPositionsUpdate.push([
					position.childPosition,
					{
						$set: {
							parentPosition: positionId,
						},
					},
				]);
			}

			newProcurement.positions.push(positionId);

			positionsDeleteStoreNotification.push(positionTemp.notCreated ? position.childPosition : positionId);

			return { ...remainingParams, position };
		});

		if (positionsErr.length) return next({ code: 2 });

		const newProcurementErr = newProcurement.validateSync();

		if (newProcurementErr) return next({ code: newProcurementErr.errors ? 5 : 2, err: newProcurementErr });

		if (positionsInsert.length) {
			await Position.insertMany(positionsInsert).catch(err => next({ code: 2, err }));
		}

		const positionsUpdate = Position.updateMany(
			{ _id: { $in: newProcurement.positions } },
			{ $push: { deliveryIsExpected: newProcurement._id } }
		).catch(err => next({ code: 2, err }));

		replacementPositionsUpdate = replacementPositionsUpdate.map(promiseItem => Position.findByIdAndUpdate(promiseItem[0], promiseItem[1]));

		await Promise.all([newProcurement.save(), positionsUpdate, ...replacementPositionsUpdate]);

		Emitter.emit('newStoreNotification', {
			studio: studioId,
			type: 'delivery-is-expected',
			procurement: newProcurement._id,
		});

		positionsDeleteStoreNotification.forEach(position => {
			Emitter.emit('deleteStoreNotification', {
				studio: studioId,
				type: 'position-ends',
				position: position,
			});
		});

		Procurement.findById(newProcurement._id)
			.populate([
				{
					path: 'orderedByMember',
					populate: {
						path: 'user',
						select: 'avatar name email',
					},
				},
				{
					path: 'orderedReceiptsPositions.position',
					populate: {
						path: 'characteristics',
					},
				},
				{
					path: 'orderedReceiptsPositions.characteristics shop',
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

		Object.keys(procurementEdited).forEach(procurementParamEdited => {
			if (!/^(orderedReceiptsPositions|positions)$/.test(procurementParamEdited)) {
				procurement[procurementParamEdited] = procurementEdited[procurementParamEdited];
			}
		});

		const positionsInsert = [];
		const positionsErr = [];
		const oldPositions = procurement.positions.slice();
		const newPositions = [];

		procurement.positions = [];

		procurement.orderedReceiptsPositions = procurementEdited.orderedReceiptsPositions.map(orderedReceiptsPositions => {
			const { position: positionTemp, ...remainingParams } = orderedReceiptsPositions;

			const position = positionTemp.notCreated ? new Position(positionTemp) : positionTemp;
			const positionId = positionTemp.notCreated ? position._id : position;

			if (positionTemp.notCreated) {
				const newPositionErr = position.validateSync();

				if (newPositionErr) positionsErr.push(newPositionErr);
				else positionsInsert.push(position);
			}

			procurement.positions.push(positionId);
			newPositions.push(positionId);

			return { ...remainingParams, position };
		});

		if (positionsErr.length) return next({ code: 2 });

		const procurementErr = procurement.validateSync();

		if (procurementErr) return next({ code: procurementErr.errors ? 5 : 2, err: procurementErr });

		if (positionsInsert.length) {
			await Position.insertMany(positionsInsert).catch(err => next({ code: 2, err }));
		}

		await Position.updateMany({ _id: { $in: oldPositions } }, { $pull: { deliveryIsExpected: procurement._id } }).catch(err =>
			next({ code: 2, err })
		);
		await Position.updateMany({ _id: { $in: newPositions } }, { $push: { deliveryIsExpected: procurement._id } }).catch(err =>
			next({ code: 2, err })
		);

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
					populate: {
						path: 'user',
						select: 'avatar name email',
					},
				},
				{
					path: 'orderedReceiptsPositions.position',
					populate: {
						path: 'characteristics',
					},
				},
				{
					path: 'orderedReceiptsPositions.characteristics shop',
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
