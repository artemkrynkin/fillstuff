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
			.populate({
				path: 'activeReceipt characteristics',
			})
			.populate({
				path: 'receipts',
				match: { status: /received|active/ },
			})
			.catch(err => next({ code: 2, err }));

		const positions = await positionsPromise;

		res.json(positions);
	}
);

positionsRouter.post(
	'/getPositionsAndGroups',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const { studioId } = req.body;

		const positionsPromise = Position.find({
			studio: studioId,
			isArchived: false,
			positionGroup: { $exists: false },
		})
			.sort({ name: 1 })
			.populate({
				path: 'activeReceipt characteristics',
			})
			.populate({
				path: 'receipts',
				match: { status: /received|active/ },
			})
			.catch(err => next({ code: 2, err }));

		const positionGroupsPromise = PositionGroup.find({
			studio: studioId,
		})
			.sort({ name: 1 })
			.populate({
				path: 'positions',
				populate: {
					path: 'activeReceipt characteristics',
				},
			})
			.populate({
				path: 'positions',
				populate: {
					path: 'receipts',
					match: { status: /received|active/ },
				},
			})
			.catch(err => next({ code: 2, err }));

		const positions = await positionsPromise;
		const positionGroups = await positionGroupsPromise;

		// positions.sort((positionA, positionB) => positionA.name.localeCompare(positionB.name));
		// positionGroups.sort((groupA, groupB) => groupA.name.localeCompare(groupB.name));

		const positionsAndGroups = [...positionGroups, ...positions];

		res.json(positionsAndGroups);
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
			.populate('characteristics')
			.populate('activeReceipt')
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
			.populate({ path: 'studio', select: 'stock' })
			.populate({
				path: 'characteristics',
			})
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
		position.unitReceipt = positionEdited.unitReceipt;
		position.unitRelease = positionEdited.unitRelease;
		position.minimumBalance = positionEdited.minimumBalance;
		position.isFree = positionEdited.isFree;
		position.extraCharge = positionEdited.extraCharge;
		position.shopName = positionEdited.shopName;
		position.shopLink = positionEdited.shopLink;
		position.characteristics = positionEdited.characteristics;

		const positionErr = position.validateSync();

		if (positionErr) return next({ code: positionErr.errors ? 5 : 2, err: positionErr });

		await Promise.all([position.save()]);

		Position.findById(position._id)
			.populate({
				path: 'activeReceipt characteristics',
			})
			.populate({
				path: 'receipts',
				match: { status: /received|active/ },
			})
			.then(position => res.json(position))
			.catch(err => next({ code: 2, err }));
	}
);

positionsRouter.post(
	'/createPositionWithReceipt',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			studioId,
			data: { position: newPositionValues, receipt: newReceiptValues },
		} = req.body;

		const newReceipt = new Receipt({
			...newReceiptValues,
			studio: studioId,
			status: 'active',
		});

		const newPosition = new Position({
			...newPositionValues,
			studio: studioId,
			activeReceipt: newReceipt._id,
			receipts: [newReceipt],
		});

		newReceipt.position = newPosition._id;

		receiptCalc.quantity(newReceipt, {
			unitReceipt: newPosition.unitReceipt,
			unitRelease: newPosition.unitRelease,
		});
		receiptCalc.unitPurchasePrice(newReceipt, {
			unitReceipt: newPosition.unitReceipt,
			unitRelease: newPosition.unitRelease,
		});
		receiptCalc.sellingPrice(newReceipt, {
			isFree: newPosition.isFree,
			extraCharge: newPosition.extraCharge,
		});
		receiptCalc.manualExtraCharge(newReceipt, {
			isFree: newPosition.isFree,
			unitReceipt: newPosition.unitReceipt,
			unitRelease: newPosition.unitRelease,
		});

		const newReceiptErr = newReceipt.validateSync();
		const newPositionErr = newPosition.validateSync();

		if (newReceiptErr) return next({ code: newReceiptErr.errors ? 5 : 2, err: newReceiptErr });
		if (newPositionErr) return next({ code: newPositionErr.errors ? 5 : 2, err: newPositionErr });

		await Promise.all([newReceipt.save(), newPosition.save()]);

		const position = await Position.findById(newPosition._id)
			.populate({ path: 'studio', select: 'stock' })
			.populate({
				path: 'activeReceipt characteristics',
			})
			.populate({
				path: 'receipts',
				match: { status: /received|active/ },
			})
			.catch(err => next({ code: 2, err }));

		const {
			studio: {
				stock: { numberPositions: numberPositionsOld, stockPrice: stockPriceOld },
			},
			activeReceipt,
		} = position;

		Studio.findByIdAndUpdate(
			position.studio._id,
			{
				$set: {
					'stock.numberPositions': numberPositionsOld + 1,
					'stock.stockPrice': stockPriceOld + activeReceipt.current.quantity * activeReceipt.unitPurchasePrice,
				},
			},
			{ runValidators: true }
		).catch(err => next({ code: 2, err }));

		position.depopulate('studio');

		res.json(position);
	}
);

positionsRouter.post(
	'/positionReceiptAddQuantity',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			params: { positionId },
			data: { comment, quantity: quantityAdded },
		} = req.body;

		const quantity = Number(quantityAdded);

		const position = await Position.findById(positionId)
			.populate({ path: 'studio', select: 'stock' })
			.populate('activeReceipt')
			.catch(err => next({ code: 2, err }));

		const {
			studio: {
				stock: { stockPrice: stockPriceOld },
			},
			activeReceipt,
		} = position;

		const activeReceiptCurrentSet = {
			quantity: activeReceipt.current.quantity + quantity,
		};

		if (position.unitReceipt === 'nmp' && position.unitRelease === 'pce') {
			activeReceiptCurrentSet.quantityPackages = (activeReceipt.current.quantity + quantity) / activeReceipt.quantityInUnit;
		}

		await Receipt.findByIdAndUpdate(
			activeReceipt._id,
			{
				$set: {
					current: activeReceiptCurrentSet,
				},
				$push: {
					additions: {
						quantity,
						comment,
					},
				},
			},
			{ runValidators: true }
		).catch(err => next({ code: 2, err }));

		Studio.findByIdAndUpdate(
			position.studio._id,
			{
				$set: {
					'stock.stockPrice': stockPriceOld + quantity * activeReceipt.unitPurchasePrice,
				},
			},
			{ runValidators: true }
		).catch(err => next({ code: 2, err }));

		Position.findById(position._id)
			.populate({
				path: 'activeReceipt characteristics',
			})
			.populate({
				path: 'receipts',
				match: { status: /received|active/ },
			})
			.then(position => res.json(position))
			.catch(err => next({ code: 2, err }));
	}
);

positionsRouter.post(
	'/removePositionFromGroup',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			params: { positionId },
		} = req.body;

		const position = await Position.findById(positionId)
			.populate('positionGroup')
			.catch(err => next({ code: 2, err }));

		Position.findByIdAndUpdate(position._id, {
			$set: { divided: true },
			$unset: { positionGroup: 1 },
		}).catch(err => next({ code: 2, err }));

		let remainingPositionId = {};

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

		res.json(remainingPositionId);
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
			.populate({ path: 'studio', select: 'stock' })
			.populate('positionGroup')
			.populate({
				path: 'receipts',
				match: { status: /received|active/ },
			})
			.catch(err => next({ code: 2, err }));

		// if (position.receipts.some(receipt => receipt.status === 'expected')) {
		// 	return res.json({
		// 		code: 400,
		// 		message: 'Позиция не может быть архивирована, пока есть поступление в одном из непоступивших заказов.',
		// 	});
		// }

		Position.findByIdAndUpdate(position._id, {
			$set: { isArchived: true, divided: true },
			$unset: { positionGroup: 1 },
		}).catch(err => next({ code: 2, err }));

		if (position.positionGroup) {
			if (position.positionGroup.positions.length > 2) {
				PositionGroup.findByIdAndUpdate(position.positionGroup._id, { $pull: { positions: position._id } }).catch(err =>
					next({ code: 2, err })
				);
			} else {
				const remainingPositionId = position.positionGroup.positions.find(positionId => String(positionId) !== String(position._id));

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

		const purchasePriceReceiptsPosition = receipts.reduce((sum, receipt) => {
			return sum + receipt.current.quantity * receipt.unitPurchasePrice;
		}, 0);

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

		res.json();
	}
);

export default positionsRouter;
