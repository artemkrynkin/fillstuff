import { Router } from 'express';

import { percentOfNumber } from 'shared/utils';

import { isAuthedResolver, hasPermissionsInStock } from 'api/utils/permissions';

import Stock from 'api/models/stock';
import Position from 'api/models/position';
import WriteOff from 'api/models/writeOff';
import Receipt from 'api/models/receipt';

const writeOffsRouter = Router();

// const debug = require('debug')('api:writeOffs');

writeOffsRouter.get(
	'/write-offs',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	(req, res, next) => {
		const currentDate = new Date();

		const {
			stockId,
			userId,
			endDateLt = req.query.endDate ? new Date(req.query.endDate) : currentDate,
			startDateGte = req.query.startDate
				? new Date(req.query.startDate)
				: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate()),
		} = req.query;

		const conditions = {
			stock: stockId,
			createdAt: {
				$gte: startDateGte,
				$lt: endDateLt,
			},
		};

		if (userId) conditions.user = userId;

		WriteOff.find(conditions)
			.populate({
				path: 'position',
				populate: {
					path: 'characteristics',
				},
				select: 'name characteristics',
			})
			.populate({
				path: 'receipt',
				select: 'unitCostDelivery',
			})
			.populate('user', 'name email')
			.sort({ createdAt: -1 })
			.then(writeOffs => res.json(writeOffs))
			.catch(err => next(err));
	}
);

writeOffsRouter.post(
	'/write-offs',
	// isAuthedResolver,
	// (req, res, next) => hasPermissionsInStock(req, res, next, ['products.scanning']),
	async (req, res, next) => {
		let { stockId, userId, positionId, comment } = req.body;
		const quantity = Number(req.body.quantity) || 1;

		const position = await Position.findById(positionId)
			.populate({ path: 'stock', select: 'status' })
			.populate('activeReceipt')
			.populate({
				path: 'receipts',
				match: { status: /received|active/ },
			})
			.catch(err => next({ code: 2, err }));

		const {
			stock: { status: statusOld },
			receipts = position.receipts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
		} = position;

		const allQuantityReceipts = receipts.reduce((sum, receipt) => sum + receipt.current.quantity, 0);

		if (allQuantityReceipts === 0 || allQuantityReceipts - quantity < 0) {
			return res.json({
				code: 7,
				message:
					allQuantityReceipts === 0
						? 'Позиция отсутствует на складе'
						: allQuantityReceipts - quantity < 0
						? 'Вы пытаетесь списать количество большее, чем есть на складе'
						: 'Unknown error',
			});
		}

		const newWriteOffs = [];
		const newWriteOffsErr = [];
		const updateReceipts = [];
		let remainingQuantity = quantity;
		let writeOffCost = 0;

		receipts.forEach((receipt, index) => {
			if (remainingQuantity !== 0) {
				const currentWriteOffQuantity = remainingQuantity > receipt.current.quantity ? receipt.current.quantity : remainingQuantity;

				const newWriteOff = new WriteOff({
					stock: stockId,
					user: userId,
					position: position._id,
					receipt: receipt._id,
					quantity: currentWriteOffQuantity,
					cost: receipt.unitSellingPrice + receipt.unitCostDelivery + percentOfNumber(receipt.unitSellingPrice, position.extraCharge),
					unitSellingPrice: receipt.unitSellingPrice,
					extraCharge: position.extraCharge,
					comment: comment,
				});

				const newWriteOffErr = newWriteOff.validateSync();

				newWriteOffs.push(newWriteOff.save());
				if (newWriteOffErr) newWriteOffsErr.push(newWriteOffErr);

				const currentReceiptSet = {
					current: {
						quantity: remainingQuantity > receipt.current.quantity ? 0 : receipt.current.quantity - remainingQuantity,
					},
				};

				if (position.unitReceipt === 'nmp' && position.unitIssue === 'pce') {
					currentReceiptSet.current.quantityPackages = currentReceiptSet.current.quantity / receipt.quantityInUnit;
				}

				if (receipts[index + 1] !== undefined && currentReceiptSet.current.quantity === 0) {
					currentReceiptSet.status = 'closed';
				}

				remainingQuantity = remainingQuantity > receipt.current.quantity ? Math.abs(receipt.current.quantity - remainingQuantity) : 0;
				writeOffCost += currentWriteOffQuantity * (receipt.unitPurchasePrice + receipt.unitCostDelivery);

				const activeReceiptId =
					receipts[index + 1] !== undefined && currentReceiptSet.current.quantity === 0 ? receipts[index + 1]._id : receipt._id;

				if (
					remainingQuantity === 0 &&
					(currentReceiptSet.current.quantity === 0 || (index !== 0 && currentReceiptSet.current.quantity !== 0))
				) {
					updateReceipts.push(
						Receipt.findByIdAndUpdate(activeReceiptId, { $set: { status: 'active' } }, { runValidators: true }).catch(err =>
							next({ code: 2, err })
						),
						Position.findByIdAndUpdate(position._id, { $set: { activeReceipt: activeReceiptId } }, { runValidators: true }).catch(err =>
							next({ code: 2, err })
						)
					);
				}

				updateReceipts.push(
					Receipt.findByIdAndUpdate(receipt._id, { $set: currentReceiptSet }, { runValidators: true }).catch(err => next({ code: 2, err }))
				);
			}
		});

		if (newWriteOffsErr.length) return next({ code: 2 });

		await Promise.all([...newWriteOffs, ...updateReceipts]);

		Stock.findByIdAndUpdate(
			stockId,
			{
				$set: {
					'status.stockPrice': statusOld.stockPrice - writeOffCost,
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

writeOffsRouter.delete(
	'/write-offs/:writeOffId',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	async (req, res, next) => {
		const writeOff = await WriteOff.findById(req.params.writeOffId)
			.populate({ path: 'stock', select: 'status' })
			.populate('position receipt')
			.catch(err => next({ code: 2, err }));

		const {
			stock: { status: statusOld },
			receipt,
		} = writeOff;

		const activeReceiptCurrentSet = {
			quantity: receipt.current.quantity + writeOff.quantity,
		};

		if (writeOff.position.unitReceipt === 'nmp' && writeOff.position.unitIssue === 'pce') {
			activeReceiptCurrentSet.quantityPackages = (receipt.current.quantity + writeOff.quantity) / receipt.quantityInUnit;
		}

		Receipt.findByIdAndUpdate(receipt._id, { $set: { current: activeReceiptCurrentSet } }, { runValidators: true }).catch(err =>
			next({ code: 2, err })
		);

		Stock.findByIdAndUpdate(
			writeOff.stock,
			{
				$set: {
					'status.stockPrice': statusOld.stockPrice + writeOff.quantity * (receipt.unitPurchasePrice + receipt.unitCostDelivery),
				},
			},
			{ runValidators: true }
		).catch(err => next({ code: 2, err }));

		WriteOff.findByIdAndRemove(writeOff._id).catch(err => next({ code: 2, err }));

		res.json();
	}
);

export default writeOffsRouter;
