import { Router } from 'express';

import { receiptCalc } from 'shared/checkPositionAndReceipt';

import Emitter from 'api/utils/emitter';
import { isAuthed, hasPermissions } from 'api/utils/permissions';

import Studio from 'api/models/studio';
import Position from 'api/models/position';
import Receipt from 'api/models/receipt';

const router = Router();

// const debug = require('debug')('api:products');

router.post(
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

router.post(
	'/createReceipt',
	isAuthed,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			studioId,
			data: { receipt: newReceiptValues },
		} = req.body;

		const positionPromise = Position.findById(newReceiptValues.position).catch(err => next({ code: 2, err }));
		const studioPromise = Studio.findById(studioId, 'stock').catch(err => next({ code: 2, err }));

		const position = await positionPromise;
		const studio = await studioPromise;

		const newReceipt = new Receipt({
			...newReceiptValues,
			position: position._id,
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
				$set: { activeReceipt: newReceipt, hasReceipts: true, notifyReceiptMissing: false },
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
			stock: { stockPrice },
		} = studio;

		const purchasePriceReceipt = newReceipt.initial.quantity * newReceipt.unitPurchasePrice;

		Studio.findByIdAndUpdate(
			studioId,
			{ $set: { 'stock.stockPrice': stockPrice + purchasePriceReceipt } },
			{ runValidators: true }
		).catch(err => next({ code: 2, err }));

		await newReceipt.populate().execPopulate();

		res.json(newReceipt);
	}
);

router.post(
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

router.post(
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
					select: 'stock',
					model: Studio,
				},
				{
					path: 'activeReceipt',
				},
			])
			.catch(err => next({ code: 2, err }));

		const {
			studio: {
				stock: { stockPrice: stockPriceOld },
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
					'stock.stockPrice': stockPriceOld + quantity * activeReceipt.unitPurchasePrice,
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

export default router;
