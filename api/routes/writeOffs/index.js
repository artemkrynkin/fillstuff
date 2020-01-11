import { Router } from 'express';
import moment from 'moment';

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
					select: 'isArchived name unitIssue characteristics',
				},
				{
					path: 'receipt',
					select: 'unitPurchasePrice',
				},
				{
					path: 'user requestCancellationUser',
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

		writeOffs.data.forEach(writeOff => writeOff.depopulate('stock'));

		res.json({
			data: writeOffs.data,
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
					isFree: position.isFree,
					quantity: currentWriteOffQuantity,
					totalPurchasePrice: currentWriteOffQuantity * receipt.unitPurchasePrice,
					totalSalePrice: !position.isFree ? currentWriteOffQuantity * receipt.unitSellingPrice : 0,
					unitSalePrice: !position.isFree ? receipt.unitSellingPrice : 0,
					unitPurchasePrice: receipt.unitPurchasePrice,
					unitSellingPrice: receipt.unitSellingPrice,
					unitCostDelivery: receipt.unitCostDelivery,
					unitExtraCharge: receipt.unitExtraCharge,
					unitManualExtraCharge: receipt.unitManualExtraCharge,
					comment: comment,
				});

				if (!position.isFree) {
					newWriteOff.paymentStatus = 'unpaid';
				}

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
				stockPrice += newWriteOff.totalPurchasePrice;

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

writeOffsRouter.get(
	'/write-offs/cancel/:writeOffId',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	async (req, res, next) => {
		const { requestCancellationUser = req.user._id } = req.query;

		const writeOff = await WriteOff.findById(req.params.writeOffId)
			.populate({ path: 'stock', select: 'status' })
			.populate('position receipt')
			.catch(err => next({ code: 2, err }));

		if (
			!moment()
				.subtract({ day: 1 })
				.isBefore(writeOff.createdAt)
		) {
			return res.json({
				code: 7,
				message: 'Отмену можно произвести только в течении 24 часов после списания',
			});
		}

		const awaitingPromises = [];

		const {
			stock: { status: statusOld },
			receipt,
		} = writeOff;

		awaitingPromises.push(
			WriteOff.findByIdAndUpdate(writeOff._id, { $set: { canceled: true, canceledDate: Date.now(), requestCancellationUser } }).catch(err =>
				next({ code: 2, err })
			)
		);

		const receiptCurrentSet = {
			quantity: receipt.current.quantity + writeOff.quantity,
		};
		const receiptSet = {};

		if (writeOff.position.unitReceipt === 'nmp' && writeOff.position.unitIssue === 'pce') {
			receiptCurrentSet.quantityPackages = (receipt.current.quantity + writeOff.quantity) / receipt.quantityInUnit;
		}

		receiptSet.current = receiptCurrentSet;

		if (receipt.status === 'closed') {
			receiptSet.status = 'active';
			awaitingPromises.push(
				Receipt.findByIdAndUpdate(writeOff.position.activeReceipt, { $set: { status: 'received' } }, { runValidators: true }).catch(err =>
					next({ code: 2, err })
				)
			);
			awaitingPromises.push(
				Position.findByIdAndUpdate(writeOff.position._id, { $set: { activeReceipt: receipt._id } }, { runValidators: true }).catch(err =>
					next({ code: 2, err })
				)
			);
		}

		awaitingPromises.push(
			Receipt.findByIdAndUpdate(receipt._id, { $set: receiptSet }, { runValidators: true }).catch(err => next({ code: 2, err }))
		);

		await Promise.all(awaitingPromises);

		Stock.findByIdAndUpdate(
			writeOff.stock,
			{
				$set: {
					'status.stockPrice': statusOld.stockPrice + writeOff.quantity * receipt.unitPurchasePrice,
				},
			},
			{ runValidators: true }
		).catch(err => next({ code: 2, err }));

		const updatedWriteOff = await WriteOff.findById(writeOff._id)
			.populate({
				path: 'position',
				populate: {
					path: 'characteristics',
				},
				select: 'isArchived name unitIssue characteristics',
			})
			.populate({
				path: 'receipt',
				select: 'unitPurchasePrice',
			})
			.populate({
				path: 'user requestCancellationUser',
				select: 'profilePhoto name email',
			})
			.catch(err => next({ code: 2, err }));

		res.json(updatedWriteOff);
	}
);

export default writeOffsRouter;
