import { Router } from 'express';
import mongoose from 'mongoose';
import { difference } from 'lodash';

import { isAuthed, hasPermissions } from 'api/utils/permissions';

import Emitter from 'api/utils/emitter';

import Position from 'api/models/position';
import Procurement from 'api/models/procurement';

const procurementsRouter = Router();

// const debug = require('debug')('api:products');

const existIsNotSame = (propName, originalData, editedData) =>
	editedData[propName] !== undefined && originalData[propName] !== editedData[propName];

procurementsRouter.post(
	'/getProcurementsExpected',
	isAuthed,
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
	isAuthed,
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
	isAuthed,
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

		newProcurement.positions.forEach(positionId => {
			const position = positions.find(position => String(position._id) === String(positionId));

			Emitter.emit('deleteStoreNotification', {
				studio: studioId,
				type: !position.notifyReceiptMissing ? 'position-ends' : 'receipts-missing',
				position: position._id,
			});
		});

		await newProcurement
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
			.execPopulate();

		res.json(newProcurement);
	}
);

procurementsRouter.post(
	'/editProcurementExpected',
	isAuthed,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			studioId,
			params: { procurementId },
			data: { procurement: procurementEdited },
		} = req.body;

		const procurement = await Procurement.findById(procurementId).catch(err => next({ code: 2, err }));

		const oldPositionsInString = procurement.positions.slice().map(positionId => String(positionId));

		if (existIsNotSame('shop', procurement, procurementEdited)) procurement.shop = procurementEdited.shop;
		if (existIsNotSame('isConfirmed', procurement, procurementEdited)) procurement.isConfirmed = procurementEdited.isConfirmed;
		if (existIsNotSame('isUnknownDeliveryDate', procurement, procurementEdited))
			procurement.isUnknownDeliveryDate = procurementEdited.isUnknownDeliveryDate;
		if (existIsNotSame('deliveryDate', procurement, procurementEdited)) procurement.deliveryDate = procurementEdited.deliveryDate;
		if (existIsNotSame('deliveryTimeFrom', procurement, procurementEdited))
			procurement.deliveryTimeFrom = procurementEdited.deliveryTimeFrom;
		if (existIsNotSame('deliveryTimeTo', procurement, procurementEdited)) procurement.deliveryTimeTo = procurementEdited.deliveryTimeTo;
		if (existIsNotSame('pricePositions', procurement, procurementEdited)) procurement.pricePositions = procurementEdited.pricePositions;
		if (existIsNotSame('costDelivery', procurement, procurementEdited)) procurement.costDelivery = procurementEdited.costDelivery;
		if (existIsNotSame('totalPrice', procurement, procurementEdited)) procurement.totalPrice = procurementEdited.totalPrice;
		if (existIsNotSame('compensateCostDelivery', procurement, procurementEdited))
			procurement.compensateCostDelivery = procurementEdited.compensateCostDelivery;
		if (existIsNotSame('orderedReceiptsPositions', procurement, procurementEdited))
			procurement.orderedReceiptsPositions = procurementEdited.orderedReceiptsPositions;
		if (existIsNotSame('positions', procurement, procurementEdited))
			procurement.positions = procurementEdited.positions.map(positionId => String(positionId));
		if (existIsNotSame('comment', procurement, procurementEdited)) procurement.comment = procurementEdited.comment;

		const newPositionInString = procurement.positions.slice().map(positionId => String(positionId));
		const positionsRemoved = difference(oldPositionsInString, newPositionInString);
		const positionsAdded = difference(newPositionInString, oldPositionsInString);

		const procurementErr = procurement.validateSync();

		if (procurementErr) return next({ code: procurementErr.errors ? 5 : 2, err: procurementErr });

		const positionsEdited = await Position.find({ _id: { $in: [...positionsRemoved, ...positionsAdded] } })
			.populate([
				{
					path: 'receipts',
					match: { status: /received|active/ },
					options: {
						sort: { createdAt: 1 },
					},
				},
			])
			.lean()
			.catch(err => next({ code: 2, err }));

		if (positionsRemoved.length) {
			Position.updateMany({ _id: { $in: positionsRemoved } }, { $pull: { deliveryIsExpected: procurement._id } }).catch(err =>
				next({ code: 2, err })
			);

			positionsEdited
				.filter(position => positionsRemoved.some(positionRemovedId => String(positionRemovedId) === String(position._id)))
				.forEach(position => {
					const deliveryIsExpected = position.deliveryIsExpected.filter(
						expectedProcurementId => String(expectedProcurementId) !== procurementId
					);

					if (deliveryIsExpected.length === 0) {
						if (position.hasReceipts) {
							const totalQuantityReceipts = position.receipts.reduce((total, { current }) => total + current.quantity, 0);

							if (totalQuantityReceipts <= position.minimumBalance) {
								Emitter.emit('newStoreNotification', {
									studio: studioId,
									type: 'position-ends',
									position: position._id,
								});
							}
						} else if (!position.hasReceipts && position.notifyReceiptMissing) {
							Emitter.emit('newStoreNotification', {
								studio: studioId,
								type: 'receipts-missing',
								position: position._id,
							});
						}
					}
				});
		}
		if (positionsAdded.length) {
			Position.updateMany({ _id: { $in: positionsAdded } }, { $push: { deliveryIsExpected: procurement._id } }).catch(err =>
				next({ code: 2, err })
			);

			positionsEdited
				.filter(position => positionsAdded.some(positionAddedId => String(positionAddedId) === String(position._id)))
				.forEach(position => {
					Emitter.emit('deleteStoreNotification', {
						studio: studioId,
						type: !position.notifyReceiptMissing ? 'position-ends' : 'receipts-missing',
						position: position._id,
					});
				});
		}

		await procurement.save();

		Emitter.emit('editStoreNotification', {
			studio: studioId,
			type: 'delivery-is-expected',
			procurement: procurement._id,
		});

		await procurement
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
			.execPopulate();

		res.json(procurement);
	}
);

procurementsRouter.post(
	'/cancelProcurementExpected',
	isAuthed,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			studioId,
			params: { procurementId },
		} = req.body;

		const positions = await Position.find({ deliveryIsExpected: { $in: procurementId } })
			.populate([
				{
					path: 'receipts',
					match: { status: /received|active/ },
					options: {
						sort: { createdAt: 1 },
					},
				},
			])
			.lean()
			.catch(err => next({ code: 2, err }));

		Position.updateMany({ deliveryIsExpected: { $in: procurementId } }, { $pull: { deliveryIsExpected: procurementId } }).catch(err =>
			next({ code: 2, err })
		);

		positions.forEach(position => {
			const deliveryIsExpected = position.deliveryIsExpected.filter(
				expectedProcurementId => String(expectedProcurementId) !== procurementId
			);

			if (deliveryIsExpected.length === 0) {
				if (position.hasReceipts) {
					const totalQuantityReceipts = position.receipts.reduce((total, { current }) => total + current.quantity, 0);

					if (totalQuantityReceipts <= position.minimumBalance) {
						Emitter.emit('newStoreNotification', {
							studio: studioId,
							type: 'position-ends',
							position: position._id,
						});
					}
				} else if (!position.hasReceipts && position.notifyReceiptMissing) {
					Emitter.emit('newStoreNotification', {
						studio: studioId,
						type: 'receipts-missing',
						position: position._id,
					});
				}
			}
		});

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
