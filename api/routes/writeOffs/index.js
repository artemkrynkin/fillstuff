import { Router } from 'express';
import moment from 'moment';

import { isAuthedResolver, hasPermissions } from 'api/utils/permissions';

import mongoose from 'mongoose';
import Member from 'api/models/member';
import Studio from 'api/models/studio';
import PositionGroup from 'api/models/positionGroup';
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
			query: { dateStart, dateEnd, position, role, onlyCanceled },
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

		if (position && !/all|paid|free/.test(position)) conditions.position = position;

		if (position && /paid|free/.test(position)) conditions.isFree = position !== 'paid';

		if (role && !/all|owners|admins|artists/.test(role)) conditions.member = mongoose.Types.ObjectId(role);

		if (onlyCanceled) conditions.canceled = onlyCanceled;

		const writeOffPromise = WriteOff.paginate(conditions, {
			sort: { createdAt: -1 },
			populate: [
				{
					path: 'member',
					select: 'roles user',
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
					select: 'isArchived name unitRelease characteristics',
				},
			],
			pagination: false,
			customLabels: {
				docs: 'data',
				meta: 'paging',
			},
		}).catch(err => next({ code: 2, err }));
		const writeOffCountPromise = WriteOff.countDocuments({ studio: studioId });

		const writeOffsResult = await writeOffPromise;
		const writeOffsCount = await writeOffCountPromise;

		let { data: writeOffs } = writeOffsResult;

		if (role && /owners|admins|artists/.test(role)) {
			const roleFilter = role.slice(0, -1);

			writeOffs = writeOffs.filter(writeOff => writeOff.member.roles.some(role => role.includes(roleFilter)));
		}

		res.json({
			data: writeOffs,
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
			.populate([
				{
					path: 'studio',
					select: 'store',
				},
				{
					path: 'positionGroup',
				},
				{
					path: 'activeReceipt',
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
				store: { numberPositions: numberPositionsOld, storePrice: storePriceOld },
			},
			receipts = position.receipts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
		} = position;

		const allQuantityReceipts = receipts
			.filter(receipt => /received|active/.test(receipt.status))
			.reduce((sum, receipt) => sum + receipt.current.quantity, 0);

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

					if (position.archivedAfterEnded && !position.deliveryIsExpected && currentReceiptSet.current.quantity === 0) {
						awaitingPromises.push(
							Position.findByIdAndUpdate(position._id, {
								$set: { isArchived: true },
								$unset: { archivedAfterEnded: 1, positionGroup: 1 },
							}).catch(err => next({ code: 2, err }))
						);

						numberArchivedPosition += 1;

						if (position.positionGroup) {
							if (position.positionGroup.positions.length > 1) {
								awaitingPromises.push(
									PositionGroup.findByIdAndUpdate(position.positionGroup._id, { $pull: { positions: position._id } }).catch(err =>
										next({ code: 2, err })
									)
								);
							} else {
								awaitingPromises.push(
									PositionGroup.findByIdAndRemove(position.positionGroup._id, { $pull: { positions: position._id } }).catch(err =>
										next({ code: 2, err })
									)
								);
							}
						}
					}
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
					'store.numberPositions': numberPositionsOld - numberArchivedPosition,
					'store.storePrice': storePriceOld - totalPurchasePrice,
				},
			},
			{ runValidators: true }
		).catch(err => next({ code: 2, err }));

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
			.populate([
				{
					path: 'studio',
					select: 'store',
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

		if (!writeOff.isFree && !member.billingPeriodWriteOffs.some(billingWriteOff => String(billingWriteOff._id) === String(writeOff._id))) {
			return res.json({
				code: 7,
				message: 'Списание не может быть отменено, так как по нему уже был выставлен счет',
			});
		}

		const awaitingPromises = [];

		const {
			studio: {
				store: { storePrice: storePriceOld },
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

		if (writeOff.position.unitReceipt === 'nmp' && writeOff.position.unitRelease === 'pce') {
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
				Position.findByIdAndUpdate(writeOff.position._id, { $set: { activeReceipt: receipt._id } }).catch(err => next({ code: 2, err }))
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
					billingPeriodWriteOffs: writeOff._id,
				},
			},
			{ runValidators: true }
		).catch(err => next({ code: 2, err }));

		Studio.findByIdAndUpdate(
			writeOff.studio._id,
			{
				$set: {
					'store.storePrice': storePriceOld + writeOff.purchasePrice,
				},
			},
			{ runValidators: true }
		).catch(err => next({ code: 2, err }));

		const updatedWriteOff = await WriteOff.findById(writeOff._id)
			.populate([
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

export default writeOffsRouter;
