import { Router } from 'express';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { isAuthed, hasPermissions } from 'api/utils/permissions';

import Emitter from 'api/utils/emitter';

import Studio from 'api/models/studio';
import Position from 'api/models/position';
import PositionGroup from 'api/models/positionGroup';
import Receipt from 'api/models/receipt';
import StoreNotification from 'api/models/storeNotification';

const router = Router();

const existIsNotSame = (propName, originalData, editedData) =>
	editedData[propName] !== undefined && originalData[propName] !== editedData[propName];

// const debug = require('debug')('api:products');

router.post(
	'/getPositions',
	isAuthed,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const { studioId } = req.body;

		const positionsPromise = Position.find({ studio: studioId })
			.sort({ isArchived: 1, name: 1 })
			.populate([
				{
					path: 'activeReceipt characteristics shops.shop',
				},
				{
					path: 'receipts',
					match: { status: /received|active/ },
					options: {
						sort: { createdAt: 1 },
					},
				},
			])
			.catch(err => next({ code: 2, err }));

		const positions = await positionsPromise;

		res.json(positions);
	}
);

router.post(
	'/getPosition',
	isAuthed,
	(req, res, next) => hasPermissions(req, res, next, ['products.scanning']),
	(req, res, next) => {
		const {
			params: { positionId, qrcodeId },
		} = req.body;

		const conditions = {};

		if (positionId) conditions._id = positionId;
		if (qrcodeId) conditions.qrcodeId = qrcodeId;

		Position.find(conditions)
			.populate([
				{
					path: 'activeReceipt characteristics shops.shop',
				},
				{
					path: 'childPosition parentPosition',
					select: 'name characteristics',
					populate: 'characteristics',
				},
				{
					path: 'receipts',
					match: { status: /received|active/ },
					options: {
						sort: { createdAt: 1 },
					},
				},
			])
			.then(positions => res.json(positions.length === 1 ? positions[0] : positions))
			.catch(err => next({ code: 2, err }));
	}
);

router.post(
	'/createPosition',
	isAuthed,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			studioId,
			data: { position: newPositionValues },
		} = req.body;

		const newPosition = new Position({
			...newPositionValues,
			studio: studioId,
		});

		if (newPosition.childPosition) {
			newPosition.notifyReceiptMissing = true;
		}

		const newPositionErr = newPosition.validateSync();

		if (newPositionErr) return next({ code: newPositionErr.errors ? 5 : 2, err: newPositionErr });

		if (newPosition.childPosition) {
			await Position.findByIdAndUpdate(newPosition.childPosition, {
				$set: {
					parentPosition: newPosition._id,
					archivedAfterEnded: true,
				},
			}).catch(err => next({ code: 2, err }));

			if (newPosition.positionGroup) {
				PositionGroup.findByIdAndUpdate(newPosition.positionGroup, { $push: { positions: newPosition._id } }).catch(err =>
					next({ code: 2, err })
				);
			}

			Emitter.emit('deleteStoreNotification', {
				studio: studioId,
				type: 'position-ends',
				position: newPosition.childPosition,
			});

			Emitter.emit('newStoreNotification', {
				studio: studioId,
				type: 'receipts-missing',
				position: newPosition._id,
			});
		}

		await newPosition.save();

		await newPosition
			.populate([
				{
					path: 'activeReceipt characteristics shops.shop',
				},
			])
			.execPopulate();

		Studio.findByIdAndUpdate(studioId, { $inc: { 'stock.numberPositions': 1 } }).catch(err => next({ code: 2, err }));

		res.json(newPosition);
	}
);

router.post(
	'/editPosition',
	isAuthed,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			studioId,
			params: { positionId },
			data: { position: positionEditable },
		} = req.body;

		const position = await Position.findById(positionId).catch(err => next({ code: 2, err }));

		if (existIsNotSame('name', position, positionEditable)) position.name = positionEditable.name;
		if (existIsNotSame('printDestination', position, positionEditable)) position.printDestination = positionEditable.printDestination;
		if (existIsNotSame('trackBalance', position, positionEditable)) position.trackBalance = positionEditable.trackBalance;
		if (existIsNotSame('minimumBalance', position, positionEditable)) position.minimumBalance = positionEditable.minimumBalance;
		if (existIsNotSame('maximumBalance', position, positionEditable)) position.maximumBalance = positionEditable.maximumBalance;
		if (existIsNotSame('characteristics', position, positionEditable)) position.characteristics = positionEditable.characteristics;
		if (existIsNotSame('shops', position, positionEditable)) position.shops = positionEditable.shops;

		if (!position.hasReceipts) {
			if (existIsNotSame('unitReceipt', position, positionEditable)) position.unitReceipt = positionEditable.unitReceipt;
			if (existIsNotSame('unitRelease', position, positionEditable)) position.unitRelease = positionEditable.unitRelease;
		}

		if (existIsNotSame('isFree', position, positionEditable)) {
			position.isFree = positionEditable.isFree;

			await Receipt.updateMany(
				{
					position: mongoose.Types.ObjectId(positionId),
					status: /received|active/,
				},
				{
					$set: {
						isFree: position.isFree,
					},
				}
			).catch(err => next({ code: 2, err }));
		}

		const positionErr = position.validateSync();

		if (positionErr) return next({ code: positionErr.errors ? 5 : 2, err: positionErr });

		if (position.childPosition || position.parentPosition) {
			Position.findByIdAndUpdate(position.childPosition || position.parentPosition, {
				$set: { name: position.name },
			}).catch(err => next({ code: 2, err }));
		}

		await position.save();

		await position
			.populate([
				{
					path: 'activeReceipt characteristics shops.shop',
				},
				{
					path: 'receipts',
					match: { status: /received|active/ },
					options: {
						sort: { createdAt: 1 },
					},
				},
			])
			.execPopulate();

		if (position.hasReceipts && !position.archivedAfterEnded && !position.deliveryIsExpected.length) {
			const storeNotification = {
				studio: studioId,
				type: 'position-ends',
				position: position._id,
			};

			const isCreatedStoreNotification = await StoreNotification.findOne(storeNotification).catch(err => next({ code: 2, err }));

			const totalQuantityReceipts = position.receipts.reduce((total, { current }) => total + current.quantity, 0);

			if (!isCreatedStoreNotification && totalQuantityReceipts <= position.minimumBalance) {
				Emitter.emit('newStoreNotification', storeNotification);
			} else if (isCreatedStoreNotification && totalQuantityReceipts >= position.minimumBalance) {
				Emitter.emit('deleteStoreNotification', storeNotification);
			}
		}

		res.json(position);
	}
);

router.post(
	'/detachPositions',
	isAuthed,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			studioId,
			params: { positionId },
		} = req.body;

		const position = await Position.findById(positionId).catch(err => next({ code: 2, err }));
		const childPositionId = position.childPosition;

		if (!position.childPosition) {
			return next({
				code: 7,
				message: position.parentPosition
					? 'Разъединить позиции можно только через позицию на замену'
					: 'Чтобы разъединить позицию у нее должна быть заменяемая позиция',
			});
		}

		position.childPosition = undefined;
		position.parentPosition = undefined;
		position.qrcodeId = uuidv4();

		const positionErr = position.validateSync();

		if (positionErr) return next({ code: positionErr.errors ? 5 : 2, err: positionErr });

		Position.findByIdAndUpdate(childPositionId, { $unset: { parentPosition: 1, archivedAfterEnded: 1 } }).catch(err =>
			next({ code: 2, err })
		);

		if (position.notifyReceiptMissing && position.deliveryIsExpected.length === 0 && !position.hasReceipts) {
			Emitter.emit('newStoreNotification', {
				studio: studioId,
				type: 'receipts-missing',
				position: position._id,
			});
		}

		await position.save();

		await position
			.populate([
				{
					path: 'activeReceipt characteristics shops.shop',
				},
				{
					path: 'receipts',
					match: { status: /received|active/ },
					options: {
						sort: { createdAt: 1 },
					},
				},
			])
			.execPopulate();

		res.json(position);
	}
);

router.post(
	'/archivePosition',
	isAuthed,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			studioId,
			params: { positionId },
		} = req.body;

		const position = await Position.findById(positionId)
			.populate([
				{
					path: 'studio',
					select: 'stock',
					model: Studio,
				},
				{
					path: 'positionGroup',
				},
				{
					path: 'receipts',
					match: { status: /received|active/ },
					options: {
						sort: { createdAt: 1 },
					},
				},
			])
			.catch(err => next({ code: 2, err }));

		if (position.deliveryIsExpected.length) {
			return next({
				code: 6,
				message: `Позиция не может быть ${position.hasReceipts ? 'перемещена в архив' : 'удалена'} пока ожидается доставка закупки`,
			});
		}

		if (position.receipts.length) {
			return next({
				code: 6,
				message: `Позиция не может быть перемещена в архив пока все поступления не будут реализованы`,
			});
		}

		if (position.parentPosition) {
			Position.findByIdAndUpdate(position.parentPosition, { $unset: { childPosition: 1 } }).catch(err => next({ code: 2, err }));
		}

		if (position.childPosition) {
			Position.findByIdAndUpdate(position.childPosition, { $unset: { parentPosition: 1 } }).catch(err => next({ code: 2, err }));
		}

		if (position.positionGroup) {
			if (position.positionGroup.positions.length > 1) {
				PositionGroup.findByIdAndUpdate(position.positionGroup._id, { $pull: { positions: position._id } }).catch(err =>
					next({ code: 2, err })
				);
			} else {
				PositionGroup.findByIdAndRemove(position.positionGroup._id).catch(err => next({ code: 2, err }));
			}
		}

		if (position.hasReceipts) {
			Position.findByIdAndUpdate(position._id, {
				$set: position.parentPosition ? { qrcodeId: uuidv4(), isArchived: true } : { isArchived: true },
				$unset: { childPosition: 1, parentPosition: 1, archivedAfterEnded: 1, positionGroup: 1 },
			}).catch(err => next({ code: 2, err }));
		} else {
			Position.findByIdAndRemove(position._id).catch(err => next({ code: 2, err }));
		}

		Emitter.emit('deleteStoreNotification', {
			studio: studioId,
			type: !position.notifyReceiptMissing ? 'position-ends' : 'receipts-missing',
			position: position._id,
		});

		Studio.findByIdAndUpdate(
			position.studio._id,
			{
				$inc: {
					'stock.numberPositions': -1,
				},
			},
			{ runValidators: true }
		).catch(err => next({ code: 2, err }));

		res.json();
	}
);

router.post(
	'/archivePositionAfterEnded',
	isAuthed,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			studioId,
			params: { positionId },
			data: { archivedAfterEnded },
		} = req.body;

		const position = await Position.findById(positionId).catch(err => next({ code: 2, err }));

		if (archivedAfterEnded) {
			position.archivedAfterEnded = true;
		} else {
			position.archivedAfterEnded = undefined;

			if (position.parentPosition) {
				position.parentPosition = undefined;
				position.qrcodeId = uuidv4();

				Position.findByIdAndUpdate(position.parentPosition, { $unset: { childPosition: 1 } }).catch(err => next({ code: 2, err }));
			}
		}

		const positionErr = position.validateSync();

		if (positionErr) return next({ code: 2 });

		await position.save();

		await position
			.populate([
				{
					path: 'activeReceipt characteristics shops.shop',
				},
				{
					path: 'receipts',
					match: { status: /received|active/ },
					options: {
						sort: { createdAt: 1 },
					},
				},
			])
			.execPopulate();

		const totalQuantityReceipts = position.receipts.reduce((total, { current }) => total + current.quantity, 0);

		if (totalQuantityReceipts <= position.minimumBalance) {
			const storeNotification = {
				studio: studioId,
				type: 'position-ends',
				position: position._id,
			};

			const isCreatedStoreNotification = await StoreNotification.findOne(storeNotification).catch(err => next({ code: 2, err }));

			if (archivedAfterEnded) {
				Emitter.emit('deleteStoreNotification', storeNotification);
			} else if (!archivedAfterEnded && !isCreatedStoreNotification) {
				Emitter.emit('newStoreNotification', storeNotification);
			}
		}

		res.json(position);
	}
);

export default router;
