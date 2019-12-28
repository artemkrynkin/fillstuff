import { Router } from 'express';
import moment from 'moment';
import _ from 'lodash';

import { formatToCurrency } from 'shared/utils';

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
	async (req, res, next) => {
		const { stockId, dateStart, dateEnd, position, role } = req.query;

		const conditions = {
			stock: stockId,
		};

		if (dateStart && dateEnd) {
			conditions.createdAt = {
				$gte: new Date(Number(dateStart)),
				$lte: new Date(Number(dateEnd)),
			};
		}
		if (position && position !== 'all') conditions.position = position;

		const writeOffsPromise = WriteOff.paginate(conditions, {
			sort: { createdAt: -1 },
			populate: [
				{
					path: 'stock',
					select: 'members',
				},
				{
					path: 'position',
					populate: {
						path: 'characteristics',
					},
					select: 'name unitIssue isFree characteristics',
				},
				{
					path: 'receipt',
					select: 'unitPurchasePrice',
				},
				{
					path: 'user',
					select: 'profilePhoto name email',
				},
			],
			pagination: false,
			customLabels: {
				docs: 'data',
				meta: 'paging',
			},
		}).catch(err => next({ code: 2, err }));
		const writeOffCountPromise = WriteOff.estimatedDocumentCount();

		const writeOffs = await writeOffsPromise;
		const writeOffsCount = await writeOffCountPromise;

		switch (role) {
			case 'owners':
				writeOffs.data = writeOffs.data.filter(writeOff => {
					return writeOff.stock.members.some(member => String(member.user) === String(writeOff.user._id) && member.role === 'owner');
				});
				break;
			case 'admins':
				writeOffs.data = writeOffs.data.filter(writeOff => {
					return writeOff.stock.members.some(member => String(member.user) === String(writeOff.user._id) && member.role === 'admin');
				});
				break;
			default:
				if (role && role !== 'all') {
					writeOffs.data = writeOffs.data.filter(writeOff => String(writeOff.user._id) === role);
				}
				break;
		}

		// Группируем списания по дню
		const writeOffsPerDay = _.chain(writeOffs.data)
			.groupBy(writeOff => {
				return moment(writeOff.createdAt)
					.set({
						hour: 0,
						minute: 0,
						second: 0,
						millisecond: 0,
					})
					.format(moment.HTML5_FMT.DATETIME_LOCAL_MS);
			})
			.map((items, date) => {
				// Считаем данные для индикатора за день
				const indicators = items.reduce(
					(indicators, writeOff) => {
						indicators.total += formatToCurrency(writeOff.quantity * writeOff.receipt.unitPurchasePrice);

						if (!writeOff.position.isFree) {
							indicators.sellingPositions += formatToCurrency(writeOff.quantity * writeOff.receipt.unitPurchasePrice);
						} else {
							indicators.freePositions += formatToCurrency(writeOff.quantity * writeOff.receipt.unitPurchasePrice);
						}

						if (!indicators.users.some(user => String(user._id) === String(writeOff.user._id))) {
							indicators.users.push(writeOff.user);
						}

						return indicators;
					},
					{
						total: 0,
						sellingPositions: 0,
						freePositions: 0,
						users: [],
					}
				);

				return {
					date,
					indicators,
					items,
				};
			})
			.value();

		// Группируем списания по месяцу
		const writeOffsPerMonth = _.chain(writeOffsPerDay)
			.groupBy(writeOffsPerDay => {
				return moment(writeOffsPerDay.date)
					.set({
						day: 0,
						hour: 0,
						minute: 0,
						second: 0,
						millisecond: 0,
					})
					.format(moment.HTML5_FMT.DATETIME_LOCAL_MS);
			})
			.map((items, date) => ({
				date,
				items,
			}))
			.value();

		writeOffs.data.forEach(writeOff => {
			writeOff.depopulate('stock');
			writeOff.depopulate('receipt');
		});

		res.json({
			data: writeOffsPerMonth,
			paging: {
				totalCount: writeOffsCount,
			},
		});
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
		let stockPrice = 0;

		receipts.forEach((receipt, index) => {
			if (remainingQuantity !== 0) {
				const currentWriteOffQuantity = remainingQuantity > receipt.current.quantity ? receipt.current.quantity : remainingQuantity;

				const newWriteOff = new WriteOff({
					stock: stockId,
					user: userId,
					position: position._id,
					receipt: receipt._id,
					quantity: currentWriteOffQuantity,
					cost: !position.isFree ? receipt.unitSellingPrice : 0,
					unitSellingPrice: receipt.unitSellingPrice,
					unitCostDelivery: receipt.unitCostDelivery,
					unitExtraCharge: position.unitExtraCharge,
					unitManualExtraCharge: receipt.manualExtraCharge,
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
				stockPrice += currentWriteOffQuantity * receipt.unitPurchasePrice;

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
					'status.stockPrice': statusOld.stockPrice - stockPrice,
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
					'status.stockPrice': statusOld.stockPrice + writeOff.quantity * receipt.unitPurchasePrice,
				},
			},
			{ runValidators: true }
		).catch(err => next({ code: 2, err }));

		WriteOff.findByIdAndRemove(writeOff._id).catch(err => next({ code: 2, err }));

		res.json();
	}
);

export default writeOffsRouter;
