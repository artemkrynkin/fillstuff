import { Router } from 'express';
import mongoose from 'mongoose';

import { isAuthedResolver, hasPermissions } from 'api/utils/permissions';

import Emitter from 'api/utils/emitter';

import Studio from 'api/models/studio';
import Position from 'api/models/position';
import PositionGroup from 'api/models/positionGroup';
import Receipt from 'api/models/receipt';

const positionsRouter = Router();

// const debug = require('debug')('api:products');

positionsRouter.post(
	'/getPositions',
	isAuthedResolver,
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

positionsRouter.post(
	'/getPosition',
	// isAuthedResolver,
	// (req, res, next) => hasPermissions(req, res, next, ['products.control']),
	(req, res, next) => {
		const {
			params: { positionId, qrcodeId },
		} = req.body;

		const conditions = {};

		if (positionId) conditions._id = positionId;
		if (qrcodeId) conditions.qrcodeId = qrcodeId;

		Position.findOne(conditions)
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
			.then(position => res.json(position))
			.catch(err => next({ code: 2, err }));
	}
);

positionsRouter.post(
	'/createPosition',
	isAuthedResolver,
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

		const newPositionErr = newPosition.validateSync();

		if (newPositionErr) return next({ code: newPositionErr.errors ? 5 : 2, err: newPositionErr });

		await Promise.all([newPosition.save()]);

		const position = await Position.findById(newPosition._id)
			.populate([
				{
					path: 'studio',
					select: 'store',
				},
				{
					path: 'activeReceipt characteristics shops.shop',
				},
			])
			.catch(err => next({ code: 2, err }));

		const {
			studio: {
				store: { numberPositions: numberPositionsOld },
			},
		} = position;

		Studio.findByIdAndUpdate(
			position.studio._id,
			{
				$set: {
					'store.numberPositions': numberPositionsOld + 1,
				},
			},
			{ runValidators: true }
		).catch(err => next({ code: 2, err }));

		position.depopulate('studio');

		res.json(position);
	}
);

positionsRouter.post(
	'/editPosition',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			params: { positionId },
			data: { position: positionEdited },
		} = req.body;

		const position = await Position.findById(positionId).catch(err => next({ code: 2, err }));

		Object.keys(positionEdited).forEach(receiptParamEdited => {
			if (receiptParamEdited || (/unitReceipt|unitRelease/.test(receiptParamEdited) && !position.hasReceipts)) {
				position[receiptParamEdited] = positionEdited[receiptParamEdited];
			}
		});

		const positionErr = position.validateSync();

		if (positionErr) return next({ code: positionErr.errors ? 5 : 2, err: positionErr });

		if (positionEdited.isFree !== undefined && position.isFree !== positionEdited.isFree) {
			await Receipt.updateMany(
				{
					position: mongoose.Types.ObjectId(positionId),
					status: /received|active/,
				},
				{
					$set: {
						isFree: positionEdited.isFree,
					},
				}
			).catch(err => next({ code: 2, err }));
		}

		await position.save();

		Position.findById(position._id)
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
			.then(position => res.json(position))
			.catch(err => next({ code: 2, err }));
	}
);

positionsRouter.post(
	'/archivePosition',
	isAuthedResolver,
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
					select: 'store',
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
			return res.json({
				code: 400,
				message: `Позиция не может быть ${position.hasReceipts ? 'архивирована' : 'удалена'} пока ожидается доставка`,
			});
		}

		if (position.hasReceipts) {
			Position.findByIdAndUpdate(position._id, {
				$set: { isArchived: true },
				$unset: { childPosition: 1, parentPosition: 1, positionGroup: 1 },
			}).catch(err => next({ code: 2, err }));
		} else {
			Position.findByIdAndRemove(position._id).catch(err => next({ code: 2, err }));
		}

		if (position.childPosition) {
			Position.findByIdAndUpdate(position.childPosition, {
				$unset: { parentPosition: 1 },
			}).catch(err => next({ code: 2, err }));
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

		const {
			studio: {
				store: { numberPositions, storePrice },
			},
			receipts,
		} = position;

		Emitter.emit('deleteStoreNotification', {
			studio: studioId,
			type: 'position-ends',
			position: position._id,
		});

		const purchasePriceReceiptsPosition = receipts.reduce((sum, receipt) => sum + receipt.current.quantity * receipt.unitPurchasePrice, 0);

		Studio.findByIdAndUpdate(
			position.studio._id,
			{
				$set: {
					'store.numberPositions': numberPositions - 1,
					'store.storePrice': storePrice - purchasePriceReceiptsPosition,
				},
			},
			{ runValidators: true }
		).catch(err => next({ code: 2, err }));

		res.json();
	}
);

positionsRouter.post(
	'/archivePositionAfterEnded',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			studioId,
			params: { positionId },
			data: { archivedAfterEnded },
		} = req.body;

		const positionUpdate = {
			$set: {},
			$unset: {},
		};

		if (archivedAfterEnded) positionUpdate.$set.archivedAfterEnded = archivedAfterEnded;
		else positionUpdate.$unset.archivedAfterEnded = 1;

		const position = await Position.findByIdAndUpdate(positionId, positionUpdate, { new: true })
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

		const allQuantityReceipts = position.receipts.reduce((sum, receipt) => sum + receipt.current.quantity, 0);

		if (allQuantityReceipts <= position.minimumBalance) {
			const storeNotification = {
				studio: studioId,
				type: 'position-ends',
				position: position._id,
			};

			if (archivedAfterEnded) {
				Emitter.emit('deleteStoreNotification', storeNotification);
			} else {
				Emitter.emit('newStoreNotification', storeNotification);
			}
		}

		res.json(position);
	}
);

export default positionsRouter;
