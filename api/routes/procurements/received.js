import { Router } from 'express';
import mongoose from 'mongoose';

import { receiptCalc } from 'shared/checkPositionAndReceipt';

import Emitter from 'api/utils/emitter';
import { isAuthed, hasPermissions } from 'api/utils/permissions';

import User from 'api/models/user';
import Member from 'api/models/member';
import Studio from 'api/models/studio';
import Position from 'api/models/position';
import Receipt from 'api/models/receipt';
import Procurement from 'api/models/procurement';

const router = Router();

// const debug = require('debug')('api:products');

router.post(
	'/getProcurementsReceived',
	isAuthed,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			studioId,
			query: { page, limit, dateStart, dateEnd, invoiceNumber, position, member },
		} = req.body;

		const conditions = {
			studio: studioId,
			status: 'received',
		};

		if (dateStart && dateEnd) {
			conditions.createdAt = {
				$gte: dateStart,
				$lte: dateEnd,
			};
		}

		if (invoiceNumber) conditions.invoiceNumber = { $regex: invoiceNumber, $options: 'i' };

		if (member && member !== 'all') conditions.receivedByMember = mongoose.Types.ObjectId(member);

		if (position && position !== 'all') conditions.positions = mongoose.Types.ObjectId(position);

		const procurementsPromise = Procurement.paginate(conditions, {
			sort: { createdAt: -1 },
			lean: true,
			leanWithId: false,
			populate: [
				{
					path: 'orderedByMember',
					select: 'user',
					model: Member,
					populate: {
						path: 'user',
						model: User,
						select: 'picture name email',
					},
				},
				{
					path: 'receivedByMember',
					select: 'user',
					model: Member,
					populate: {
						path: 'user',
						model: User,
						select: 'picture name email',
					},
				},
				{
					path: 'receipts',
					populate: {
						path: 'position',
						populate: {
							path: 'characteristics',
						},
					},
				},
			],
			page,
			limit,
			customLabels: {
				docs: 'data',
				meta: 'paging',
			},
		}).catch(err => next({ code: 2, err }));
		const procurementsCountPromise = Procurement.countDocuments({
			studio: studioId,
			status: 'received',
		});

		const procurementsResult = await procurementsPromise;
		const procurementsCount = await procurementsCountPromise;

		const { data: procurements, paging } = procurementsResult;

		res.json({
			data: procurements,
			paging: {
				...paging,
				totalCount: procurementsCount,
			},
		});
	}
);

router.post(
	'/getProcurementReceived',
	isAuthed,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			params: { procurementId },
		} = req.body;

		const procurement = await Procurement.findOne({ _id: procurementId, status: 'received' })
			.populate([
				{
					path: 'orderedByMember',
					model: Member,
					populate: {
						path: 'user',
						model: User,
						select: 'picture name email',
					},
				},
				{
					path: 'receivedByMember',
					model: Member,
					populate: {
						path: 'user',
						model: User,
						select: 'picture name email',
					},
				},
				{
					path: 'receipts',
					populate: {
						path: 'position',
						populate: {
							path: 'characteristics',
						},
					},
				},
			])
			.catch(err => next({ code: 2, err }));

		res.json(procurement);
	}
);

router.post(
	'/createProcurementReceived',
	isAuthed,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			studioId,
			memberId,
			data: { procurement: newProcurementValues },
		} = req.body;

		const procurementPromise = Procurement.findById(newProcurementValues._id).catch(err => next({ code: 2, err }));

		const positionsPromise = Position.find({ _id: { $in: newProcurementValues.positions } })
			.populate([
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
			.lean()
			.catch(err => next({ code: 2, err }));

		const positions = await positionsPromise;
		const procurementExist = await procurementPromise;

		const newProcurement = !procurementExist
			? new Procurement({
					...newProcurementValues,
					studio: studioId,
					receivedByMember: memberId,
					status: 'received',
			  })
			: procurementExist;

		const receiptsErr = [];
		let awaitingPromises = [];

		newProcurement.receipts = newProcurementValues.receipts.map(({ position: positionId, ...receipt }) => {
			const position = positions.find(position => String(position._id) === positionId);

			const newReceipt = new Receipt({
				...receipt,
				procurement: newProcurement._id,
				position: position._id,
				studio: studioId,
				status: position.activeReceipt && position.activeReceipt.current.quantity !== 0 ? 'received' : 'active',
				isFree: position.isFree,
			});

			receiptCalc.quantity(newReceipt, {
				unitReceipt: position.unitReceipt,
				unitRelease: position.unitRelease,
			});

			const newReceiptErr = newReceipt.validateSync();

			if (newReceiptErr) receiptsErr.push(newReceiptErr);

			const positionUpdate = {
				$set: {
					hasReceipts: true,
				},
				$inc: {},
				$push: {
					receipts: newReceipt._id,
				},
				$unset: {},
				$pull: {},
			};
			const positionShopIndex = position.shops.findIndex(shop => String(shop.shop) === String(newProcurement.shop));

			if (!position.activeReceipt) {
				positionUpdate.$set.activeReceipt = newReceipt._id;
			}

			if (position.notifyReceiptMissing) {
				positionUpdate.$set.notifyReceiptMissing = false;
			}

			if (newProcurement.status === 'expected') {
				positionUpdate.$pull.deliveryIsExpected = newProcurement._id;
			}

			if (!!~positionShopIndex) {
				positionUpdate.$inc[`shops.${positionShopIndex}.numberReceipts`] = 1;
				positionUpdate.$set[`shops.${positionShopIndex}.lastProcurement`] = newProcurement._id;
			} else {
				positionUpdate.$push.shops = {
					shop: newProcurement.shop,
					numberReceipts: 1,
					lastProcurement: newProcurement._id,
				};
			}

			awaitingPromises.push([position._id, positionUpdate]);

			return newReceipt;
		});

		if (newProcurement.status === 'expected') {
			newProcurement.receivedByMember = memberId;
			newProcurement.status = 'received';
			newProcurement.createdAt = Date.now();
			newProcurement.compensateCostDelivery = newProcurementValues.compensateCostDelivery;
			newProcurement.noInvoice = newProcurementValues.noInvoice;
			if (newProcurementValues.invoiceNumber) {
				newProcurement.invoiceNumber = newProcurementValues.invoiceNumber;
			}
			if (newProcurementValues.invoiceDate) {
				newProcurement.invoiceDate = newProcurementValues.invoiceDate;
			}
			newProcurement.orderedReceiptsPositions = undefined;
		}

		if (receiptsErr.length) return next({ code: 2 });

		const newProcurementErr = newProcurement.validateSync();

		if (newProcurementErr) return next({ code: newProcurementErr.errors ? 5 : 2, err: newProcurementErr });

		await Receipt.insertMany(newProcurement.receipts).catch(err => next({ code: 2, err }));

		awaitingPromises = awaitingPromises.map(promiseItem => Position.findByIdAndUpdate(promiseItem[0], promiseItem[1]));

		await Promise.all([newProcurement.save(), ...awaitingPromises]);

		if (procurementExist) {
			Emitter.emit('deleteStoreNotification', {
				studio: studioId,
				type: 'delivery-is-expected',
				procurement: procurementExist._id,
			});
		} else {
			newProcurement.positions.forEach(positionId => {
				const position = positions.find(position => String(position._id) === String(positionId));

				Emitter.emit('deleteStoreNotification', {
					studio: studioId,
					type: !position.notifyReceiptMissing ? 'position-ends' : 'receipts-missing',
					position: positionId,
				});
			});
		}

		await newProcurement
			.populate([
				{
					path: 'orderedByMember',
					model: Member,
					populate: {
						path: 'user',
						model: User,
						select: 'picture name email',
					},
				},
				{
					path: 'receivedByMember',
					model: Member,
					populate: {
						path: 'user',
						model: User,
						select: 'picture name email',
					},
				},
				{
					path: 'receipts',
					populate: {
						path: 'position',
						populate: {
							path: 'characteristics',
						},
					},
				},
			])
			.execPopulate();

		const purchasePriceReceipts = newProcurement.receipts.reduce(
			(total, receipt) => total + receipt.initial.quantity * receipt.unitPurchasePrice,
			0
		);

		const studio = await Studio.findById(studioId).catch(err => next({ code: 2, err }));

		studio.stock.stockPrice += purchasePriceReceipts;

		const studioErr = studio.validateSync();

		if (studioErr) return next({ code: studioErr.errors ? 5 : 2, err: studioErr });

		await studio.save();

		res.json(newProcurement);
	}
);

export default router;
