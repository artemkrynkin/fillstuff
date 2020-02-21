import { Router } from 'express';
import moment from 'moment';

import { isAuthedResolver, hasPermissions } from 'api/utils/permissions';

import mongoose from 'mongoose';
import Member from 'api/models/member';
import Studio from 'api/models/studio';
import Position from 'api/models/position';
import WriteOff from 'api/models/writeOff';
import Receipt from 'api/models/receipt';

const writeOffsRouter = Router();

// const debug = require('debug')('api:writeOffs');

writeOffsRouter.post(
	'/getWriteOffs',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
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

		if (role && !/all|owners|admins|artists/.test(role)) conditions.member = mongoose.Types.ObjectId(role);

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

		if (role && /owners|admins|artists/.test(role)) {
			const roleFilter = role.slice(0, -1);

			writeOffs.data = writeOffs.data.filter(writeOff => writeOff.member.roles.some(role => role.includes(roleFilter)));
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
	// (req, res, next) => hasPermissions(req, res, next, ['products.scanning']),
	async (req, res, next) => {
		const {
			studioId,
			memberId,
			params: { positionId },
			data: { quantity: quantityWriteOff, purchaseExpenseStudio },
		} = req.body;

		const quantity = Number(quantityWriteOff);

		const positionPromise = Position.findById(positionId)
			.populate({ path: 'studio', select: 'stock' })
			.populate('activeReceipt')
			.populate({
				path: 'receipts',
				match: { status: /received|active/ },
			})
			.catch(err => next({ code: 2, err }));

		const memberPromise = Member.findById(memberId).catch(err => next({ code: 2, err }));

		const position = await positionPromise;
		const member = await memberPromise;

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

		if (purchaseExpenseStudio && !member.purchaseExpenseStudio) {
			return res.json({ code: 4 });
		}

		const awaitingPromises = [];
		const newWriteOffsErr = [];
		const writeOffsIds = [];
		let remainingQuantity = quantity;
		let totalPurchasePrice = 0;
		let totalSellingPrice = 0;

		receipts.forEach((receipt, index) => {
			if (remainingQuantity !== 0) {
				const currentWriteOffQuantity = remainingQuantity > receipt.current.quantity ? receipt.current.quantity : remainingQuantity;

				const unitSellingPrice = member.extraCharge
					? receipt.unitSellingPrice
					: receipt.unitSellingPrice - (receipt.unitExtraCharge + receipt.unitManualExtraCharge);

				const newWriteOff = new WriteOff({
					studio: studioId,
					position: position._id,
					receipt: receipt._id,
					member: memberId,
					isFree: position.isFree,
					quantity: currentWriteOffQuantity,
					purchasePrice: currentWriteOffQuantity * receipt.unitPurchasePrice,
					unitPurchasePrice: receipt.unitPurchasePrice,
					sellingPrice: !position.isFree ? currentWriteOffQuantity * unitSellingPrice : 0,
					unitSellingPrice: !position.isFree ? unitSellingPrice : 0,
					unitCostDelivery: receipt.unitCostDelivery,
					unitExtraCharge: member.extraCharge ? receipt.unitExtraCharge : 0,
					unitManualExtraCharge: member.extraCharge ? receipt.unitManualExtraCharge : 0,
				});

				if (purchaseExpenseStudio && /artist/.test(member.roles)) {
					newWriteOff.purchaseExpenseStudio = purchaseExpenseStudio;
				}

				const newWriteOffErr = newWriteOff.validateSync();

				if (newWriteOffErr) newWriteOffsErr.push(newWriteOffErr);

				awaitingPromises.push(newWriteOff.save());

				if (!position.isFree) writeOffsIds.push(newWriteOff._id);

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
				totalPurchasePrice += newWriteOff.purchasePrice;
				if (!position.isFree) totalSellingPrice += newWriteOff.sellingPrice;

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

		Member.findByIdAndUpdate(
			memberId,
			{
				$set: {
					billingDebt: member.billingDebt + totalSellingPrice,
					billingPeriodDebt: member.billingPeriodDebt + totalSellingPrice,
				},
				$push: {
					billingPeriodWriteOffs: writeOffsIds,
				},
			},
			{ runValidators: true }
		).catch(err => next({ code: 2, err }));

		Studio.findByIdAndUpdate(
			studioId,
			{
				$set: {
					stock: {
						stockPrice: stockPriceOld - totalPurchasePrice,
					},
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
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			memberId,
			params: { writeOffId },
			data: { cancellationRequestBy },
		} = req.body;

		const writeOffPromise = WriteOff.findById(writeOffId)
			.populate({ path: 'studio', select: 'stock' })
			.populate('position receipt')
			.catch(err => next({ code: 2, err }));

		const memberPromise = Member.findById(memberId).catch(err => next({ code: 2, err }));

		const writeOff = await writeOffPromise;
		const member = await memberPromise;

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
			WriteOff.findByIdAndUpdate(writeOff._id, {
				$set: {
					canceled: true,
					canceledDate: Date.now(),
					cancellationRequestBy,
					cancellationConfirmedBy: memberId,
				},
			}).catch(err => next({ code: 2, err }))
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

		Member.findByIdAndUpdate(
			memberId,
			{
				$set: {
					billingDebt: member.billingDebt - writeOff.sellingPrice,
					billingPeriodDebt: member.billingPeriodDebt - writeOff.sellingPrice,
				},
				$pull: {
					billingPeriodWriteOffs: { _id: writeOff._id },
				},
			},
			{ runValidators: true }
		).catch(err => next({ code: 2, err }));

		Studio.findByIdAndUpdate(
			writeOff.studio._id,
			{
				$set: {
					'stock.stockPrice': stockPriceOld + writeOff.purchasePrice,
				},
			},
			{ runValidators: true }
		).catch(err => next({ code: 2, err }));

		const updatedWriteOff = await WriteOff.findById(writeOff._id)
			.populate({
				path: 'member',
				populate: {
					path: 'user',
					select: 'avatar name email',
				},
			})
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
