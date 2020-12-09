import { Router } from 'express';

import { isAuthed, hasPermissions } from 'api/utils/permissions';

import { receiptCalc } from 'shared/checkPositionAndReceipt';

import Studio from 'api/models/studio';
import Position from 'api/models/position';
import Receipt from 'api/models/receipt';
import Emitter from '../../utils/emitter';

const receiptsRouter = Router();

// const debug = require('debug')('api:products');

receiptsRouter.post(
	'/getReceiptsPosition',
	isAuthed,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			studioId,
			params: { positionId },
		} = req.body;

		Receipt.find({ studio: studioId, position: positionId })
			.sort('-createdAt')
			.populate([
				{
					path: 'procurement',
				},
			])
			.then(receipts => res.json(receipts))
			.catch(err => next({ code: 2, err }));
	}
);

receiptsRouter.post(
	'/createReceipt',
	isAuthed,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			studioId,
			data: { receipt: newReceiptValues },
		} = req.body;

		const positionPromise = Position.findById(newReceiptValues.position).catch(err => next({ code: 2, err }));
		const studioPromise = Studio.findById(studioId, 'store').catch(err => next({ code: 2, err }));

		const position = await positionPromise;
		const studio = await studioPromise;

		const newReceipt = new Receipt({
			...newReceiptValues,
			position: position,
			studio: studioId,
			status: 'active',
			isFree: position.isFree,
		});

		receiptCalc.quantity(newReceipt, {
			unitReceipt: position.unitReceipt,
			unitRelease: position.unitRelease,
		});

		const newReceiptErr = newReceipt.validateSync();

		if (newReceiptErr) return next({ code: newReceiptErr.errors ? 5 : 2, err: newReceiptErr });

		await Promise.all([
			newReceipt.save(),
			Position.findByIdAndUpdate(newReceipt.position, {
				$set: { activeReceipt: newReceipt, hasReceipts: true },
				$unset: { notifyReceiptMissing: 1 },
				$push: { receipts: newReceipt },
			}),
		]);

		if (position.notifyReceiptMissing) {
			Emitter.emit('deleteStoreNotification', {
				studio: studioId,
				type: 'receipts-missing',
				position: position._id,
			});
		}

		const {
			store: { storePrice },
		} = studio;

		const purchasePriceReceipt = newReceipt.initial.quantity * newReceipt.unitPurchasePrice;

		Studio.findByIdAndUpdate(
			studioId,
			{ $set: { 'store.storePrice': storePrice + purchasePriceReceipt } },
			{ runValidators: true }
		).catch(err => next({ code: 2, err }));

		await newReceipt.populate('procurement').execPopulate();

		res.json(newReceipt);
	}
);

receiptsRouter.post(
	'/changeReceipt',
	isAuthed,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			params: { receiptId },
			data: receiptEdited,
		} = req.body;

		const receipt = await Receipt.findById(receiptId).catch(err => next({ code: 2, err }));

		Object.keys(receiptEdited).forEach(receiptParamEdited => {
			receipt[receiptParamEdited] = receiptEdited[receiptParamEdited];
		});

		const receiptErr = receipt.validateSync();

		if (receiptErr) return next({ code: receiptErr.errors ? 5 : 2, err: receiptErr });

		await receipt.save();

		await receipt.populate('procurement').execPopulate();

		res.json(receipt);
	}
);

receiptsRouter.post(
	'/activeReceiptAddQuantity',
	isAuthed,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			params: { positionId },
			data: { comment, quantity: quantityAdded },
		} = req.body;

		const quantity = Number(quantityAdded);

		const position = await Position.findById(positionId)
			.populate([
				{
					path: 'studio',
					select: 'store',
				},
				{
					path: 'activeReceipt',
				},
			])
			.catch(err => next({ code: 2, err }));

		const {
			studio: {
				store: { storePrice: storePriceOld },
			},
			activeReceipt,
		} = position;

		const activeReceiptCurrentSet = {
			quantity: activeReceipt.current.quantity + quantity,
		};

		if (position.unitReceipt === 'nmp' && position.unitRelease === 'pce') {
			activeReceiptCurrentSet.quantityPackages = (activeReceipt.current.quantity + quantity) / activeReceipt.quantityInUnit;
		}

		await Receipt.findByIdAndUpdate(
			activeReceipt._id,
			{
				$set: {
					current: activeReceiptCurrentSet,
				},
				$push: {
					additions: {
						quantity,
						comment,
					},
				},
			},
			{ runValidators: true }
		).catch(err => next({ code: 2, err }));

		Studio.findByIdAndUpdate(
			position.studio._id,
			{
				$set: {
					'store.storePrice': storePriceOld + quantity * activeReceipt.unitPurchasePrice,
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

export default receiptsRouter;
