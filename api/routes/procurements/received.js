import { Router } from 'express';
import mongoose from 'mongoose';

import { receiptCalc } from 'shared/checkPositionAndReceipt';

import Emitter from 'api/utils/emitter';
import { isAuthedResolver, hasPermissions } from 'api/utils/permissions';

import Studio from 'api/models/studio';
import Position from 'api/models/position';
import Receipt from 'api/models/receipt';
import Procurement from 'api/models/procurement';
import PositionGroup from '../../models/positionGroup';

const procurementsRouter = Router();

// const debug = require('debug')('api:products');

procurementsRouter.post(
	'/getProcurementsReceived',
	isAuthedResolver,
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
					populate: {
						path: 'user',
						select: 'avatar name email',
					},
				},
				{
					path: 'receivedByMember',
					select: 'user',
					populate: {
						path: 'user',
						select: 'avatar name email',
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

procurementsRouter.post(
	'/getProcurementReceived',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			params: { procurementId },
		} = req.body;

		Procurement.findOne({ _id: procurementId, status: 'received' })
			.populate([
				{
					path: 'orderedByMember',
					populate: {
						path: 'user',
						select: 'avatar name email',
					},
				},
				{
					path: 'receivedByMember',
					populate: {
						path: 'user',
						select: 'avatar name email',
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
			.then(procurement => res.json(procurement))
			.catch(err => next({ code: 2, err }));
	}
);

procurementsRouter.post(
	'/createProcurementReceived',
	isAuthedResolver,
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

		const positionsInsert = [];
		const positionsErr = [];
		const receiptsErr = [];
		const positionReplacementNumbers = newProcurementValues.receipts.reduce(
			(sum, { position }) => sum + Number(Boolean(position.notCreated)),
			0
		);
		const positionsDeleteStoreNotification = [];
		const positionsGroupsPositionsAdding = [];
		let awaitingPromises = [];
		let replacementPositionsUpdate = [];

		newProcurement.positions = [];

		newProcurement.receipts = newProcurementValues.receipts.map(initialReceipt => {
			const { position: positionTemp, ...receipt } = initialReceipt;

			const position = positionTemp.notCreated
				? new Position(positionTemp)
				: positions.find(position => String(position._id) === positionTemp);

			if (positionTemp.notCreated) {
				const newPositionErr = position.validateSync();

				if (newPositionErr) positionsErr.push(newPositionErr);
				else positionsInsert.push(position);

				replacementPositionsUpdate.push([
					position.childPosition,
					{
						$set: {
							parentPosition: position._id,
							archivedAfterEnded: true,
						},
					},
				]);

				if (position.positionGroup) {
					const positionGroup = positionsGroupsPositionsAdding.find(positionGroup => positionGroup._id === String(position.positionGroup));

					if (!positionGroup) {
						positionsGroupsPositionsAdding.push({
							_id: position.positionGroup,
							positions: [position._id],
						});
					} else {
						positionGroup.positions.push(position._id);
					}
				}
			}

			newProcurement.positions.push(position._id);

			positionsDeleteStoreNotification.push(positionTemp.notCreated ? position.childPosition : position._id);

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
				$pull: {},
			};
			const positionShopIndex = position.shops.findIndex(shop => String(shop.shop) === String(newProcurement.shop));

			if (!position.activeReceipt) {
				positionUpdate.$set.activeReceipt = newReceipt._id;
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

		if (positionsErr.length || receiptsErr.length) return next({ code: 2 });

		const newProcurementErr = newProcurement.validateSync();

		if (newProcurementErr) return next({ code: newProcurementErr.errors ? 5 : 2, err: newProcurementErr });

		if (positionsInsert.length) {
			await Position.insertMany(positionsInsert).catch(err => next({ code: 2, err }));
		}

		await Receipt.insertMany(newProcurement.receipts).catch(err => next({ code: 2, err }));

		replacementPositionsUpdate = replacementPositionsUpdate.map(promiseItem => Position.findByIdAndUpdate(promiseItem[0], promiseItem[1]));

		if (positionsGroupsPositionsAdding) {
			positionsGroupsPositionsAdding.forEach(positionGroup => {
				PositionGroup.findByIdAndUpdate(positionGroup._id, { $push: { positions: { $each: positionGroup.positions } } }).catch(err =>
					next({ code: 2, err })
				);
			});
		}

		awaitingPromises = awaitingPromises.map(promiseItem => Position.findByIdAndUpdate(promiseItem[0], promiseItem[1]));

		await Promise.all([newProcurement.save(), ...awaitingPromises, ...replacementPositionsUpdate]);

		if (procurementExist) {
			Emitter.emit('deleteStoreNotification', {
				studio: studioId,
				type: 'delivery-is-expected',
				procurement: procurementExist._id,
			});
		} else {
			positionsDeleteStoreNotification.forEach(positionId => {
				Emitter.emit('deleteStoreNotification', {
					studio: studioId,
					type: 'position-ends',
					position: positionId,
				});
			});
		}

		const procurement = await Procurement.findById(newProcurement._id)
			.populate([
				{
					path: 'studio',
					select: 'store',
				},
				{
					path: 'orderedByMember',
					populate: {
						path: 'user',
						select: 'avatar name email',
					},
				},
				{
					path: 'receivedByMember',
					populate: {
						path: 'user',
						select: 'avatar name email',
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

		const {
			studio: {
				store: { storePrice: storePriceOld },
			},
		} = procurement;

		Studio.findByIdAndUpdate(
			procurement.studio._id,
			{
				$set: {
					'store.storePrice':
						storePriceOld + procurement.receipts.reduce((sum, receipt) => sum + receipt.initial.quantity * receipt.unitPurchasePrice, 0),
				},
				$inc: {
					'store.numberPositions': positionReplacementNumbers,
				},
			},
			{ runValidators: true }
		).catch(err => next({ code: 2, err }));

		procurement.depopulate('studio');

		res.json(procurement);
	}
);

export default procurementsRouter;
