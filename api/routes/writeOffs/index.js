import { Router } from 'express';

import { isAuthedResolver, hasPermissionsInStock } from 'api/utils/permissions';

import Stock from 'api/models/stock';
import Position from 'api/models/position';
import WriteOff from 'api/models/writeOff';
import Receipt from '../../models/receipt';

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
				select: 'createdAt name characteristics',
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
	(req, res, next) => {
		const { stockId, userId, positionId, quantity = req.body.quantity || 1, comment } = req.body;

		return Position.findById(positionId)
			.populate({ path: 'stock', select: 'status' })
			.populate('activeReceipt')
			.populate({
				path: 'receipts',
				match: { status: /received|active/ },
			})
			.then(async position => {
				const {
					stock: { status: statusOld },
					activeReceipt,
					receipts,
				} = position;

				const allQuantityReceipts = receipts.reduce((sum, receipt) => sum + receipt.current.quantity, 0);

				if (allQuantityReceipts === 0 || allQuantityReceipts - quantity < 0) {
					return res.json({
						code: 7,
						message:
							allQuantityReceipts === 0
								? 'Маркер отсутствует на складе'
								: allQuantityReceipts - quantity < 0
								? 'Вы пытаетесь списать количество большее, чем есть на складе'
								: 'Unknown error',
					});
				}

				const activeReceiptCurrentSet = {
					quantity: activeReceipt.current.quantity - quantity,
				};

				if (position.unitReceipt === 'nmp' && position.unitIssue === 'pce') {
					activeReceiptCurrentSet.quantityPackages = (activeReceipt.current.quantity - quantity) / activeReceipt.quantityInUnit;
				}

				Receipt.findByIdAndUpdate(activeReceipt._id, { $set: { current: activeReceiptCurrentSet } }, { runValidators: true }).catch(err =>
					next({ code: 2, err })
				);

				Stock.findByIdAndUpdate(
					stockId,
					{
						$set: {
							'status.stockPrice': statusOld.stockPrice - quantity * activeReceipt.unitPurchasePrice,
						},
					},
					{ runValidators: true }
				).catch(err => next({ code: 2, err }));

				const newWriteOff = new WriteOff({
					stock: stockId,
					user: userId,
					position: position._id,
					receipt: position.activeReceipt._id,
					quantity: quantity,
					comment: comment,
				});

				newWriteOff.save().catch(err => next({ code: 2, err }));

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
			})
			.catch(err => next(err));
	}
);

export default writeOffsRouter;
