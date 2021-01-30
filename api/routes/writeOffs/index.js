import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import mongoose from 'mongoose';

import { isAuthed, hasPermissions } from 'api/utils/permissions';

import Emitter from 'api/utils/emitter';

import User from 'api/models/user';
import Member from 'api/models/member';
import Studio from 'api/models/studio';
import PositionGroup from 'api/models/positionGroup';
import Position from 'api/models/position';
import WriteOff from 'api/models/writeOff';
import Receipt from 'api/models/receipt';
import StoreNotification from 'api/models/storeNotification';

const router = Router();

// const debug = require('debug')('api:writeOffs');

router.post(
	'/getWriteOffs',
	isAuthed,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			studioId,
			query: { page, limit, dateStart, dateEnd, position, role, onlyCanceled },
		} = req.body;

		const conditions = {
			studio: studioId,
		};

		if (dateStart && dateEnd) {
			conditions.createdAt = {
				$gte: dateStart,
				$lte: dateEnd,
			};
		}

		if (position && !/all|paid|free/.test(position)) conditions.position = position;

		if (position && /paid|free/.test(position)) conditions.isFree = position !== 'paid';

		if (role && !/all|owners|admins|artists/.test(role)) conditions.member = mongoose.Types.ObjectId(role);

		if (onlyCanceled) conditions.canceled = onlyCanceled;

		const writeOffPromise = WriteOff.paginate(conditions, {
			sort: { createdAt: -1 },
			lean: true,
			leanWithId: false,
			populate: [
				{
					path: 'member',
					select: 'roles user',
					model: Member,
					populate: {
						path: 'user',
						model: User,
						select: 'picture name email',
					},
				},
				{
					path: 'position',
					populate: {
						path: 'characteristics',
					},
					select: 'isArchived name unitRelease characteristics',
				},
			],
			page,
			limit,
			customLabels: {
				docs: 'data',
				meta: 'paging',
			},
		}).catch(err => next({ code: 2, err }));
		const writeOffCountPromise = WriteOff.countDocuments({ studio: studioId });

		const writeOffsResult = await writeOffPromise;
		const writeOffsCount = await writeOffCountPromise;

		let { data: writeOffs, paging } = writeOffsResult;

		if (role && /owners|admins|artists/.test(role)) {
			const roleFilter = role.slice(0, -1);

			writeOffs = writeOffs.filter(writeOff => writeOff.member.roles.some(role => role.includes(roleFilter)));
		}

		res.json({
			data: writeOffs,
			paging: {
				...paging,
				totalCount: writeOffsCount,
			},
		});
	}
);

router.post(
	'/getUserWriteOffs',
	isAuthed,
	(req, res, next) => hasPermissions(req, res, next, ['products.scanning']),
	async (req, res, next) => {
		const {
			studioId,
			memberId,
			query: { page, limit, dateStart, dateEnd, position, onlyCanceled },
		} = req.body;

		const conditions = {
			studio: studioId,
			member: memberId,
		};

		if (dateStart && dateEnd) {
			conditions.createdAt = {
				$gte: dateStart,
				$lte: dateEnd,
			};
		}

		if (position && !/all|paid|free/.test(position)) conditions.position = position;

		if (position && /paid|free/.test(position)) conditions.isFree = position !== 'paid';

		if (onlyCanceled) conditions.canceled = onlyCanceled;

		const writeOffPromise = WriteOff.paginate(conditions, {
			sort: { createdAt: -1 },
			lean: true,
			leanWithId: false,
			populate: [
				{
					path: 'member',
					select: 'roles user',
					model: Member,
					populate: {
						path: 'user',
						model: User,
						select: 'picture name email',
					},
				},
				{
					path: 'position',
					populate: {
						path: 'characteristics',
					},
					select: 'isArchived name unitRelease characteristics',
				},
			],
			page,
			limit,
			customLabels: {
				docs: 'data',
				meta: 'paging',
			},
		}).catch(err => next({ code: 2, err }));
		const writeOffCountPromise = WriteOff.countDocuments({ studio: studioId, member: memberId });

		const writeOffsResult = await writeOffPromise;
		const writeOffsCount = await writeOffCountPromise;

		let { data: writeOffs, paging } = writeOffsResult;

		res.json({
			data: writeOffs,
			paging: {
				...paging,
				totalCount: writeOffsCount,
			},
		});
	}
);

router.post(
	'/createWriteOff',
	isAuthed,
	(req, res, next) => hasPermissions(req, res, next, ['products.scanning']),
	async (req, res, next) => {
		const {
			studioId,
			memberId,
			params: { positionId },
			data: { quantity: quantityWriteOff, purchaseExpenseStudio },
		} = req.body;

		const quantity = Number(quantityWriteOff);

		const positionPromise = Position.findById(positionId)
			.populate([
				{
					path: 'studio',
					select: 'stock',
					model: Studio,
				},
				{
					path: 'activeReceipt',
				},
				{
					path: 'positionGroup',
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

		const memberPromise = Member.findById(memberId).catch(err => next({ code: 2, err }));

		const position = await positionPromise;
		const member = await memberPromise;

		const {
			studio: {
				stock: { numberPositions: numberPositionsOld, stockPrice: stockPriceOld },
			},
			receipts = position.receipts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
		} = position;

		const allQuantityReceipts = receipts.reduce((sum, receipt) => sum + receipt.current.quantity, 0);
		const remainingQuantityAfterWriteOff = allQuantityReceipts - quantity;

		if (allQuantityReceipts === 0 || remainingQuantityAfterWriteOff < 0) {
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
			return next({ code: 4 });
		}

		const awaitingPromises = [];
		const newWriteOffsErr = [];
		const writeOffsIds = [];
		let numberArchivedPosition = 0;
		let remainingQuantity = quantity;
		let totalPurchasePrice = 0;
		let totalSellingPrice = 0;

		receipts.forEach((receipt, index) => {
			if (remainingQuantity !== 0) {
				const currentWriteOffQuantity = remainingQuantity > receipt.current.quantity ? receipt.current.quantity : remainingQuantity;

				const unitSellingPrice = member.markupPosition ? receipt.unitSellingPrice : receipt.unitSellingPrice - receipt.unitMarkup;

				const newWriteOff = new WriteOff({
					studio: studioId,
					position: position._id,
					receipt: receipt._id,
					member: memberId,
					isFree: position.isFree,
					quantity: currentWriteOffQuantity,
					purchasePrice: currentWriteOffQuantity * receipt.unitPurchasePrice,
					unitPurchasePrice: receipt.unitPurchasePrice,
					sellingPrice: !purchaseExpenseStudio && !position.isFree ? currentWriteOffQuantity * unitSellingPrice : 0,
					unitSellingPrice: !purchaseExpenseStudio && !position.isFree ? unitSellingPrice : 0,
				});

				if (purchaseExpenseStudio && /artist/.test(member.roles)) {
					newWriteOff.purchaseExpenseStudio = purchaseExpenseStudio;
				}

				const newWriteOffErr = newWriteOff.validateSync();

				if (newWriteOffErr) newWriteOffsErr.push(newWriteOffErr);

				awaitingPromises.push(newWriteOff.save());

				if (!position.isFree && !purchaseExpenseStudio) writeOffsIds.push(newWriteOff._id);

				const currentReceiptSet = {
					current: {
						quantity: remainingQuantity > receipt.current.quantity ? 0 : receipt.current.quantity - remainingQuantity,
					},
				};

				if (position.unitReceipt === 'nmp' && position.unitRelease === 'pce') {
					currentReceiptSet.current.quantityPackages = currentReceiptSet.current.quantity / receipt.quantityInUnit;
				}

				remainingQuantity = remainingQuantity > receipt.current.quantity ? remainingQuantity - receipt.current.quantity : 0;
				totalPurchasePrice += newWriteOff.purchasePrice;
				if (!position.isFree) totalSellingPrice += newWriteOff.sellingPrice;

				if (currentReceiptSet.current.quantity === 0) {
					currentReceiptSet.status = 'closed';
				}

				const nextReceipt = receipts[index + 1];

				if (nextReceipt !== undefined) {
					if (currentReceiptSet.current.quantity === 0) {
						awaitingPromises.push(
							Receipt.findByIdAndUpdate(nextReceipt._id, { $set: { status: 'active' } }, { runValidators: true }).catch(err =>
								next({ code: 2, err })
							),
							Position.findByIdAndUpdate(position._id, { $set: { activeReceipt: nextReceipt._id } }).catch(err => next({ code: 2, err }))
						);
					}
				} else {
					if (currentReceiptSet.current.quantity === 0) {
						Position.findByIdAndUpdate(position._id, { $unset: { activeReceipt: 1 } }).catch(err => next({ code: 2, err }));
					}

					if (position.archivedAfterEnded && !position.deliveryIsExpected.length && currentReceiptSet.current.quantity === 0) {
						if (position.parentPosition) {
							awaitingPromises.push(
								Position.findByIdAndUpdate(position.parentPosition, { $unset: { childPosition: 1 } }).catch(err => next({ code: 2, err }))
							);
						}

						if (position.childPosition) {
							awaitingPromises.push(
								Position.findByIdAndUpdate(position.childPosition, { $unset: { parentPosition: 1 } }).catch(err => next({ code: 2, err }))
							);
						}

						if (position.positionGroup) {
							if (position.positionGroup.positions.length > 1) {
								awaitingPromises.push(
									PositionGroup.findByIdAndUpdate(position.positionGroup, { $pull: { positions: position._id } }).catch(err =>
										next({ code: 2, err })
									)
								);
							} else {
								awaitingPromises.push(PositionGroup.findByIdAndRemove(position.positionGroup).catch(err => next({ code: 2, err })));
							}
						}

						awaitingPromises.push(
							Position.findByIdAndUpdate(position._id, {
								$set: position.parentPosition ? { qrcodeId: uuidv4(), isArchived: true } : { isArchived: true },
								$unset: { childPosition: 1, parentPosition: 1, archivedAfterEnded: 1, positionGroup: 1 },
							}).catch(err => next({ code: 2, err }))
						);

						numberArchivedPosition += 1;

						Emitter.emit('newStoreNotification', {
							studio: studioId,
							type: 'position-moved-archive',
							position: position._id,
						});
					}
				}

				awaitingPromises.push(
					Receipt.findByIdAndUpdate(receipt._id, { $set: currentReceiptSet }, { runValidators: true }).catch(err => next({ code: 2, err }))
				);
			}
		});

		if (newWriteOffsErr.length) return next({ code: 2 });

		await Promise.all(awaitingPromises);

		if (remainingQuantityAfterWriteOff <= position.minimumBalance && !position.archivedAfterEnded && !position.deliveryIsExpected.length) {
			const storeNotification = {
				studio: studioId,
				type: 'position-ends',
				position: position._id,
			};

			const isCreatedStoreNotification = await StoreNotification.findOne(storeNotification).catch(err => next({ code: 2, err }));

			if (!isCreatedStoreNotification) Emitter.emit('newStoreNotification', storeNotification);
			else Emitter.emit('editStoreNotification', storeNotification);
		}

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
					'stock.numberPositions': numberPositionsOld - numberArchivedPosition,
					'stock.stockPrice': stockPriceOld - totalPurchasePrice,
				},
			},
			{ runValidators: true }
		).catch(err => next({ code: 2, err }));

		Position.findById(position._id)
			.populate([
				{
					path: 'activeReceipt characteristics shops.shop',
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

router.post(
	'/cancelWriteOff',
	isAuthed,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			studioId,
			memberId,
			params: { writeOffId },
			data: { cancellationRequestBy },
		} = req.body;

		const writeOffPromise = WriteOff.findById(writeOffId)
			.populate([
				{
					path: 'studio',
					select: 'stock',
					model: Studio,
				},
				{
					path: 'position receipt',
				},
			])
			.catch(err => next({ code: 2, err }));

		const memberPromise = Member.findById(memberId, 'billingDebt billingPeriodDebt billingPeriodWriteOffs').catch(err =>
			next({ code: 2, err })
		);

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

		// if (!writeOff.isFree && !member.billingPeriodWriteOffs.some(billingWriteOff => String(billingWriteOff._id) === String(writeOff._id))) {
		// 	return res.json({
		// 		code: 7,
		// 		message: 'Списание не может быть отменено, так как по нему уже был выставлен счет',
		// 	});
		// }

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

		const receiptSet = {
			current: {
				quantity: receipt.current.quantity + writeOff.quantity,
			},
		};

		if (writeOff.position.unitReceipt === 'nmp' && writeOff.position.unitRelease === 'pce') {
			receiptSet.current.quantityPackages = (receipt.current.quantity + writeOff.quantity) / receipt.quantityInUnit;
		}

		if (receipt.status === 'closed') {
			receiptSet.status = 'active';
			awaitingPromises.push(
				Receipt.findByIdAndUpdate(writeOff.position.activeReceipt, { $set: { status: 'received' } }, { runValidators: true }).catch(err =>
					next({ code: 2, err })
				)
			);
			awaitingPromises.push(
				Position.findByIdAndUpdate(writeOff.position._id, { $set: { activeReceipt: receipt._id } }).catch(err => next({ code: 2, err }))
			);
		}

		awaitingPromises.push(
			Receipt.findByIdAndUpdate(receipt._id, { $set: receiptSet }, { runValidators: true }).catch(err => next({ code: 2, err }))
		);

		await Promise.all(awaitingPromises);

		const storeNotification = {
			studio: studioId,
			type: 'position-ends',
			position: writeOff.position._id,
		};

		if (receiptSet.current.quantity > writeOff.position.minimumBalance) {
			Emitter.emit('deleteStoreNotification', storeNotification);
		} else {
			Emitter.emit('editStoreNotification', storeNotification);
		}

		Member.findByIdAndUpdate(
			memberId,
			{
				$set: {
					billingDebt: member.billingDebt - writeOff.sellingPrice,
					billingPeriodDebt: member.billingPeriodDebt - writeOff.sellingPrice,
				},
				$pull: {
					billingPeriodWriteOffs: writeOff._id,
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
			.populate([
				{
					path: 'member',
					model: Member,
					populate: {
						path: 'user',
						model: User,
						select: 'picture name email',
					},
				},
				{
					path: 'position',
					populate: {
						path: 'characteristics',
					},
					select: 'isArchived name unitRelease characteristics',
				},
				{
					path: 'receipt',
					select: 'unitPurchasePrice',
				},
			])
			.catch(err => next({ code: 2, err }));

		res.json(updatedWriteOff);
	}
);

export default router;
