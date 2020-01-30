import { Router } from 'express';
import moment from 'moment';

import { isAuthedResolver, hasPermissionsInStudio } from 'api/utils/permissions';

import Studio from 'api/models/studio';
import Position from 'api/models/position';
import WriteOff from 'api/models/writeOff';
import Receipt from 'api/models/receipt';

const writeOffsRouter = Router();

// const debug = require('debug')('api:writeOffs');

writeOffsRouter.post(
	'/getWriteOffs',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStudio(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			studioId,
			query: { dateStart, dateEnd, position, role },
		} = req.body;

		const conditions = {
			studio: studioId,
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
					path: 'member',
					populate: {
						path: 'user',
						select: 'avatar name email',
					},
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
				writeOffs.data = writeOffs.data.filter(procurement => procurement.member.role === 'owner');
				break;
			case 'admins':
				writeOffs.data = writeOffs.data.filter(procurement => procurement.member.role === 'admin');
				break;
			default:
				if (role && role !== 'all') {
					writeOffs.data = writeOffs.data.filter(procurement => String(procurement.member._id) === role);
				}
				break;
		}

		res.json({
			data: writeOffs.data,
			paging: {
				totalCount: writeOffsCount,
			},
		});
	}
);

writeOffsRouter.post(
	'/createWriteOff',
	// isAuthedResolver,
	// (req, res, next) => hasPermissionsInStudio(req, res, next, ['products.scanning']),
	async (req, res, next) => {
		let {
			studioId,
			memberId,
			params: { positionId },
			data: { quantity: quantityWriteOff },
		} = req.body;

		const quantity = Number(quantityWriteOff);

		const position = await Position.findById(positionId)
			.populate({ path: 'studio', select: 'stock' })
			.populate('activeReceipt')
			.populate({
				path: 'receipts',
				match: { status: /received|active/ },
			})
			.catch(err => next({ code: 2, err }));

		const {
			studio: {
				stock: { stockPrice: stockPriceOld },
			},
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

		const awaitingPromises = [];
		const newWriteOffsErr = [];
		let remainingQuantity = quantity;
		let stockPrice = 0;

		receipts.forEach((receipt, index) => {
			if (remainingQuantity !== 0) {
				const currentWriteOffQuantity = remainingQuantity > receipt.current.quantity ? receipt.current.quantity : remainingQuantity;

				const newWriteOff = new WriteOff({
					studio: studioId,
					member: memberId,
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
				});

				if (!position.isFree) {
					newWriteOff.paymentStatus = 'unpaid';
				}

				const newWriteOffErr = newWriteOff.validateSync();

				if (newWriteOffErr) newWriteOffsErr.push(newWriteOffErr);

				awaitingPromises.push(newWriteOff.save());

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
					awaitingPromises.push(
						Receipt.findByIdAndUpdate(activeReceiptId, { $set: { status: 'active' } }, { runValidators: true }).catch(err =>
							next({ code: 2, err })
						),
						Position.findByIdAndUpdate(position._id, { $set: { activeReceipt: activeReceiptId } }, { runValidators: true }).catch(err =>
							next({ code: 2, err })
						)
					);
				}

				awaitingPromises.push(
					Receipt.findByIdAndUpdate(receipt._id, { $set: currentReceiptSet }, { runValidators: true }).catch(err => next({ code: 2, err }))
				);
			}
		});

		if (newWriteOffsErr.length) return next({ code: 2 });

		await Promise.all([...awaitingPromises]);

		Studio.findByIdAndUpdate(
			studioId,
			{
				$set: {
					'stock.stockPrice': stockPriceOld - stockPrice,
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

writeOffsRouter.post(
	'/cancelWriteOff',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStudio(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			params: { writeOffId },
			data: { cancellationMember },
		} = req.body;

		const writeOff = await WriteOff.findById(writeOffId)
			.populate({ path: 'studio', select: 'stock' })
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
			studio: {
				stock: { stockPrice: stockPriceOld },
			},
			receipt,
		} = writeOff;

		awaitingPromises.push(
			WriteOff.findByIdAndUpdate(writeOff._id, { $set: { canceled: true, canceledDate: Date.now(), cancellationMember } }).catch(err =>
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

		Studio.findByIdAndUpdate(
			writeOff.studio._id,
			{
				$set: {
					'stock.stockPrice': stockPriceOld + writeOff.quantity * receipt.unitPurchasePrice,
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
			.catch(err => next({ code: 2, err }));

		res.json(updatedWriteOff);
	}
);

export default writeOffsRouter;
