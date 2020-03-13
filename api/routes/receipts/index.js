import { Router } from 'express';

import { isAuthedResolver, hasPermissions } from 'api/utils/permissions';

import Studio from 'api/models/studio';
import Position from 'api/models/position';
import Receipt from 'api/models/receipt';

const receiptsRouter = Router();

// const debug = require('debug')('api:products');

receiptsRouter.post(
	'/getReceiptsPosition',
	isAuthedResolver,
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
			.then(invoices => res.json(invoices))
			.catch(err => next({ code: 2, err }));
	}
);

receiptsRouter.post(
	'/changeReceiptPosition',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			params: { receiptId },
			data: receiptEdited,
		} = req.body;

		const receipt = await Receipt.findById(receiptId).catch(err => next({ code: 2, err }));

		receipt.sellingPrice = receiptEdited.sellingPrice;
		receipt.unitSellingPrice = receiptEdited.unitSellingPrice;
		receipt.markupPercent = receiptEdited.markupPercent;
		receipt.markup = receiptEdited.markup;
		receipt.unitMarkup = receiptEdited.unitMarkup;
		receipt.manualMarkup = receiptEdited.manualMarkup;
		receipt.unitManualMarkup = receiptEdited.unitManualMarkup;

		const receiptErr = receipt.validateSync();

		if (receiptErr) return next({ code: receiptErr.errors ? 5 : 2, err: receiptErr });

		await Promise.all([receipt.save()]);

		Receipt.findById(receipt._id)
			.populate([
				{
					path: 'procurement',
				},
			])
			.then(receipt => res.json(receipt))
			.catch(err => next({ code: 2, err }));
	}
);

receiptsRouter.post(
	'/activeReceiptAddQuantity',
	isAuthedResolver,
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

export default receiptsRouter;
