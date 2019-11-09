import { Router } from 'express';

import { recountReceipt } from 'shared/checkPositionAndReceipt';

import { isAuthedResolver, hasPermissionsInStock } from 'api/utils/permissions';

import Stock from 'api/models/stock';
import Position from 'api/models/position';
import PositionGroup from 'api/models/positionGroup';
import Receipt from 'api/models/receipt';

const positionsRouter = Router();

// const debug = require('debug')('api:products');

positionsRouter.get(
	'/positions',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	async (req, res, next) => {
		const { stockId } = req.query;

		const positionsPromise = Position.find({
			stock: stockId,
			isArchived: false,
		})
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

positionsRouter.get(
	'/positions/positions-in-groups',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	async (req, res, next) => {
		const { stockId } = req.query;

		const positionsPromise = Position.find({
			stock: stockId,
			isArchived: false,
			positionGroup: { $exists: false },
		})
			.populate({
				path: 'activeReceipt characteristics',
			})
			.populate({
				path: 'receipts',
				match: { status: /received|active/ },
			})
			.catch(err => next({ code: 2, err }));

		const positionGroupsPromise = PositionGroup.find({
			stock: stockId,
		})
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
		const compareByName = (a, b) => {
			if (a.name > b.name) return 1;
			else if (a.name < b.name) return -1;
			else return 0;
		};

		const positionsInGroups = [...positions, ...positionGroups].sort(compareByName);

		res.json(positionsInGroups);
	}
);

positionsRouter.get(
	'/positions/:positionId',
	// isAuthedResolver,
	// (req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	(req, res, next) => {
		Position.findById(req.params.positionId)
			.populate('characteristics')
			.then(position => res.json(position))
			.catch(err => next({ code: 2, err }));
	}
);

positionsRouter.post(
	'/positions',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	async (req, res, next) => {
		const { stockId } = req.query;
		const { position: newPositionValues } = req.body;

		const newPosition = new Position({
			...newPositionValues,
			stock: stockId,
		});

		const newPositionErr = newPosition.validateSync();

		if (newPositionErr) return next({ code: newPositionErr.errors ? 5 : 2, err: newPositionErr });

		await Promise.all([newPosition.save()]);

		const position = await Position.findById(newPosition._id)
			.populate({ path: 'stock', select: 'status' })
			.populate({
				path: 'characteristics',
			})
			.catch(err => next({ code: 2, err }));

		const {
			stock: { status: statusOld },
		} = position;

		Stock.findByIdAndUpdate(
			position.stock._id,
			{
				$set: {
					'status.numberPositions': statusOld.numberPositions + 1,
				},
			},
			{ runValidators: true }
		).catch(err => next({ code: 2, err }));

		position.depopulate('stock');

		res.json(position);
	}
);

positionsRouter.put(
	'/positions/:positionId',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	async (req, res, next) => {
		const { position: positionUpdated } = req.body;

		const position = await Position.findById(req.params.positionId).catch(err => next({ code: 2, err }));

		position.name = positionUpdated.name;
		position.unitReceipt = positionUpdated.unitReceipt;
		position.unitIssue = positionUpdated.unitIssue;
		position.minimumBalance = positionUpdated.minimumBalance;
		position.isFree = positionUpdated.isFree;
		position.shopName = positionUpdated.shopName;
		position.shopLink = positionUpdated.shopLink;
		position.characteristics = positionUpdated.characteristics;

		const positionErr = position.validateSync();

		if (positionErr) return next({ code: positionErr.errors ? 5 : 2, err: positionErr });

		await Promise.all([position.save()]);

		Position.findById(position._id)
			.populate({
				path: 'characteristics',
			})
			.then(position => res.json(position))
			.catch(err => next({ code: 2, err }));
	}
);

positionsRouter.post(
	'/positions/position-and-receipt',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	async (req, res, next) => {
		const { stockId } = req.query;
		const { position: newPositionValues, receipt: newReceiptValues } = req.body;

		const newReceipt = new Receipt({
			...newReceiptValues,
			stock: stockId,
			user: req.user._id,
			status: 'active',
			comment: 'Создание позиции',
		});

		const newPosition = new Position({
			...newPositionValues,
			stock: stockId,
			activeReceipt: newReceipt._id,
			receipts: [newReceipt],
		});

		newReceipt.position = newPosition._id;

		recountReceipt({ unitReceipt: newPosition.unitReceipt, unitIssue: newPosition.unitIssue }, newPosition.isFree, newReceipt);

		const newReceiptErr = newReceipt.validateSync();
		const newPositionErr = newPosition.validateSync();

		if (newReceiptErr) return next({ code: newReceiptErr.errors ? 5 : 2, err: newReceiptErr });
		if (newPositionErr) return next({ code: newPositionErr.errors ? 5 : 2, err: newPositionErr });

		await Promise.all([newReceipt.save(), newPosition.save()]);

		const position = await Position.findById(newPosition._id)
			.populate({ path: 'stock', select: 'status' })
			.populate({
				path: 'activeReceipt characteristics',
			})
			.populate({
				path: 'receipts',
				match: { status: /received|active/ },
			})
			.catch(err => next({ code: 2, err }));

		const {
			stock: { status: statusOld },
			activeReceipt,
		} = position;

		Stock.findByIdAndUpdate(
			position.stock._id,
			{
				$set: {
					'status.numberPositions': statusOld.numberPositions + 1,
					'status.stockPrice': statusOld.stockPrice + activeReceipt.current.quantity * activeReceipt.unitPurchasePrice,
				},
			},
			{ runValidators: true }
		).catch(err => next({ code: 2, err }));

		position.depopulate('stock');

		res.json(position);
	}
);

positionsRouter.put(
	'/positions/position-and-receipt/:positionId',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	async (req, res, next) => {
		const { position: positionUpdated, receipt: receiptUpdatedValues } = req.body;

		const position = await Position.findById(req.params.positionId)
			.populate({ path: 'stock', select: 'status' })
			.populate('activeReceipt')
			.catch(err => next({ code: 2, err }));

		const {
			stock: { status: statusOld },
			activeReceipt,
		} = position;
		const activeReceiptOld = position.activeReceipt.toObject();

		if (receiptUpdatedValues.quantityInUnit) activeReceipt.quantityInUnit = receiptUpdatedValues.quantityInUnit;
		if (receiptUpdatedValues.purchasePrice) activeReceipt.purchasePrice = receiptUpdatedValues.purchasePrice;
		if (receiptUpdatedValues.sellingPrice) activeReceipt.sellingPrice = receiptUpdatedValues.sellingPrice;
		if (receiptUpdatedValues.unitSellingPrice) activeReceipt.unitSellingPrice = receiptUpdatedValues.unitSellingPrice;

		recountReceipt({ unitReceipt: position.unitReceipt, unitIssue: position.unitIssue }, positionUpdated.isFree, activeReceipt, false);

		position.name = positionUpdated.name;
		position.minimumBalance = positionUpdated.minimumBalance;
		position.isFree = positionUpdated.isFree;
		position.shopName = positionUpdated.shopName;
		position.shopLink = positionUpdated.shopLink;
		position.characteristics = positionUpdated.characteristics;

		const activeReceiptErr = activeReceipt.validateSync();
		const positionErr = position.validateSync();

		if (activeReceiptErr) return next({ code: activeReceiptErr.errors ? 5 : 2, err: activeReceiptErr });
		if (positionErr) return next({ code: positionErr.errors ? 5 : 2, err: positionErr });

		await Promise.all([activeReceipt.save(), position.save()]);

		Stock.findByIdAndUpdate(
			position.stock,
			{
				$set: {
					'status.stockPrice':
						statusOld.stockPrice +
						(activeReceipt.current.quantity * activeReceipt.unitPurchasePrice -
							activeReceiptOld.current.quantity * activeReceiptOld.unitPurchasePrice),
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
	'/positions/:positionId/add-quantity',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	async (req, res, next) => {
		const { comment } = req.body;
		const quantity = Number(req.body.quantity);

		const position = await Position.findById(req.params.positionId)
			.populate({ path: 'stock', select: 'status' })
			.populate('activeReceipt')
			.catch(err => next({ code: 2, err }));

		const {
			stock: { status: statusOld },
			activeReceipt,
		} = position;

		const activeReceiptCurrentSet = {
			quantity: activeReceipt.current.quantity + quantity,
		};

		if (position.unitReceipt === 'nmp' && position.unitIssue === 'pce') {
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
						user: req.user,
						quantity,
						comment,
					},
				},
			},
			{ runValidators: true }
		).catch(err => next({ code: 2, err }));

		Stock.findByIdAndUpdate(
			position.stock,
			{
				$set: {
					'status.stockPrice': statusOld.stockPrice + quantity * activeReceipt.unitPurchasePrice,
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

positionsRouter.get(
	'/positions/:positionId/remove-from-group',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	async (req, res, next) => {
		const position = await Position.findById(req.params.positionId)
			.populate('positionGroup')
			.catch(err => next({ code: 2, err }));

		Position.findByIdAndUpdate(position._id, {
			$set: { divided: true },
			$unset: { positionGroup: 1 },
		}).catch(err => next({ code: 2, err }));

		let remainingPositionId = null;

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

		res.json(
			remainingPositionId
				? {
						remainingPositionId,
				  }
				: {}
		);
	}
);

positionsRouter.get(
	'/positions/:positionId/archive',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	async (req, res, next) => {
		const position = await Position.findById(req.params.positionId)
			.populate({ path: 'stock', select: 'status' })
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
			stock: { status: statusOld },
			receipts,
		} = position;

		const purchasePriceReceiptsPosition = receipts.reduce((sum, receipt) => {
			return sum + receipt.current.quantity * receipt.unitPurchasePrice;
		}, 0);

		Stock.findByIdAndUpdate(
			position.stock,
			{
				$set: {
					'status.numberPositions': statusOld.numberPositions - 1,
					'status.stockPrice': statusOld.stockPrice - purchasePriceReceiptsPosition,
				},
			},
			{ runValidators: true }
		).catch(err => next({ code: 2, err }));

		res.json();
	}
);

export default positionsRouter;
