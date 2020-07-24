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
					path: 'shops.shop',
				},
				{
					path: 'activeReceipt',
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
			params: { positionId },
		} = req.body;

		Position.findById(positionId)
			.populate([
				{
					path: 'shops.shop',
				},
				{
					path: 'activeReceipt',
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
					path: 'shops.shop',
				},
				{
					path: 'activeReceipt',
					populate: 'characteristics',
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

		const promisesAwaits = [];

		position.name = positionEdited.name;
		position.minimumBalance = positionEdited.minimumBalance;
		position.shopName = positionEdited.shopName;
		position.shopLink = positionEdited.shopLink;
		position.shops = positionEdited.shops;

		if (!position.activeReceipt) {
			position.unitReceipt = positionEdited.unitReceipt;
			position.unitRelease = positionEdited.unitRelease;
		}

		if (position.isFree !== positionEdited.isFree) {
			Receipt.updateMany(
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

			position.isFree = positionEdited.isFree;
		}

		const positionErr = position.validateSync();

		if (positionErr) return next({ code: positionErr.errors ? 5 : 2, err: positionErr });

		promisesAwaits.push(position.save());

		await Promise.all(promisesAwaits);

		Position.findById(position._id)
			.populate([
				{
					path: 'shops.shop',
				},
				{
					path: 'activeReceipt',
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
					match: { status: /received|active|closed/ },
					options: {
						sort: { createdAt: 1 },
					},
				},
			])
			.catch(err => next({ code: 2, err }));

		if (position.deliveryIsExpected.length) {
			return res.json({
				code: 400,
				message: 'Позиция не может быть архивирована пока ожидается доставка',
			});
		}

		if (position.receipts.length) {
			Position.findByIdAndUpdate(position._id, {
				$set: { isArchived: true },
				$unset: { positionGroup: 1 },
			}).catch(err => next({ code: 2, err }));
		} else {
			Position.findByIdAndRemove(position._id).catch(err => next({ code: 2, err }));
		}

		if (position.positionGroup) {
			if (position.positionGroup.positions.length > 1) {
				PositionGroup.findByIdAndUpdate(position.positionGroup._id, { $pull: { positions: position._id } }).catch(err =>
					next({ code: 2, err })
				);
			} else {
				PositionGroup.findByIdAndRemove(position.positionGroup._id, { $pull: { positions: position._id } }).catch(err =>
					next({ code: 2, err })
				);
			}
		}

		const {
			studio: {
				store: { numberPositions: numberPositionsOld, storePrice: storePriceOld },
			},
			receipts,
		} = position;

		Emitter.emit('deleteStoreNotification', {
			studio: studioId,
			type: 'position-ends',
			position: position._id,
		});

		const purchasePriceReceiptsPosition = receipts
			.filter(receipt => /received|active/.test(receipt.status))
			.reduce((sum, receipt) => sum + receipt.current.quantity * receipt.unitPurchasePrice, 0);

		Studio.findByIdAndUpdate(
			position.studio._id,
			{
				$set: {
					'store.numberPositions': numberPositionsOld - 1,
					'store.storePrice': storePriceOld - purchasePriceReceiptsPosition,
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

		const positionEdited = {
			$set: {},
			$unset: {},
		};

		if (archivedAfterEnded) positionEdited.$set.archivedAfterEnded = archivedAfterEnded;
		else positionEdited.$unset.archivedAfterEnded = 1;

		const position = await Position.findByIdAndUpdate(positionId, positionEdited, { new: true })
			.populate([
				{
					path: 'shops.shop',
				},
				{
					path: 'activeReceipt',
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
			.catch(err => next({ code: 2, err }));

		const allQuantityReceipts = position.receipts
			.filter(receipt => /received|active/.test(receipt.status))
			.reduce((sum, receipt) => sum + receipt.current.quantity, 0);

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
