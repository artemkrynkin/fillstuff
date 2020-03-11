import { Router } from 'express';

import { receiptCalc } from 'shared/checkPositionAndReceipt';

import { isAuthedResolver, hasPermissions } from 'api/utils/permissions';

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
					path: 'activeReceipt characteristics',
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
			.populate('activeReceipt characteristics')
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
					select: 'stock',
				},
				{
					path: 'characteristics',
				},
			])
			.catch(err => next({ code: 2, err }));

		const {
			studio: {
				stock: { numberPositions: numberPositionsOld },
			},
		} = position;

		Studio.findByIdAndUpdate(
			position.studio._id,
			{
				$set: {
					'stock.numberPositions': numberPositionsOld + 1,
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

		position.name = positionEdited.name;
		position.minimumBalance = positionEdited.minimumBalance;
		position.isFree = positionEdited.isFree;
		position.shopName = positionEdited.shopName;
		position.shopLink = positionEdited.shopLink;
		position.characteristics = positionEdited.characteristics;

		if (!position.activeReceipt) {
			position.unitReceipt = positionEdited.unitReceipt;
			position.unitRelease = positionEdited.unitRelease;
		}

		const positionErr = position.validateSync();

		if (positionErr) return next({ code: positionErr.errors ? 5 : 2, err: positionErr });

		await Promise.all([position.save()]);

		Position.findById(position._id)
			.populate([
				{
					path: 'activeReceipt characteristics',
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
			params: { positionId },
		} = req.body;

		const position = await Position.findById(positionId)
			.populate([
				{
					path: 'studio',
					select: 'stock',
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

		// if (position.receipts.some(receipt => receipt.status === 'expected')) {
		// 	return res.json({
		// 		code: 400,
		// 		message: 'Позиция не может быть архивирована, пока есть поступление в одном из непоступивших заказов.',
		// 	});
		// }
		let remainingPositionId = null;

		if (position.receipts.length) {
			Position.findByIdAndUpdate(position._id, {
				$set: { isArchived: true, divided: true },
				$unset: { positionGroup: 1 },
			}).catch(err => next({ code: 2, err }));
		} else {
			Position.findByIdAndDelete(position._id).catch(err => next({ code: 2, err }));
		}

		if (position.positionGroup) {
			if (position.positionGroup.positions.length > 2) {
				PositionGroup.findByIdAndUpdate(position.positionGroup._id, { $pull: { positions: position._id } }).catch(err =>
					next({ code: 2, err })
				);
			} else {
				remainingPositionId = position.positionGroup.positions.find(positionId => String(positionId) !== String(position._id));

				Position.findByIdAndUpdate(remainingPositionId, {
					$set: { divided: true },
					$unset: { positionGroup: 1 },
				}).catch(err => next({ code: 2, err }));

				PositionGroup.findByIdAndRemove(position.positionGroup._id).catch(err => next({ code: 2, err }));
			}
		}

		const {
			studio: {
				stock: { numberPositions: numberPositionsOld, stockPrice: stockPriceOld },
			},
			receipts,
		} = position;

		const purchasePriceReceiptsPosition = receipts
			.filter(receipt => /received|active/.test(receipt.status))
			.reduce((sum, receipt) => sum + receipt.current.quantity * receipt.unitPurchasePrice, 0);

		Studio.findByIdAndUpdate(
			position.studio._id,
			{
				$set: {
					'stock.numberPositions': numberPositionsOld - 1,
					'stock.stockPrice': stockPriceOld - purchasePriceReceiptsPosition,
				},
			},
			{ runValidators: true }
		).catch(err => next({ code: 2, err }));

		res.json({
			remainingPositionId,
		});
	}
);

export default positionsRouter;
