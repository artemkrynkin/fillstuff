import { Router } from 'express';

import { isAuthedResolver, hasPermissionsInStock } from 'api/utils/permissions';

import Stock from 'api/models/stock';
import Product from 'api/models/product';
import WriteOff from 'api/models/writeOff';

const writeOffsRouter = Router();

// const debug = require('debug')('api:writeOffs');

writeOffsRouter.get(
	'/',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	(req, res, next) => {
		const { stockId, productId, userId } = req.query;

		const conditions = { stock: stockId };

		if (productId) conditions.product = productId;
		if (userId) conditions.user = userId;

		WriteOff.find(conditions)
			.populate('product', 'name')
			.populate('user', 'name email')
			.sort({ createdAt: -1 })
			.then(products => setTimeout(() => res.json(products), 300))
			.catch(err => next(err));
	}
);

writeOffsRouter.post(
	'/product',
	// isAuthedResolver,
	// (req, res, next) => hasPermissionsInStock(req, res, next, ['products.scanning']),
	async (req, res, next) => {
		const { stockId, productId, userId, quantity = req.body.quantity || 1 } = req.body;

		return Product.findById(productId)
			.then(async product => {
				await Product.findByIdAndUpdate(
					productId,
					{
						$inc: {
							[product.unitIssue === 'pce' ? 'quantityInUnit' : 'quantity']: -quantity,
						},
					},
					{
						runValidators: true,
					}
				).catch(err => next(err));

				await Stock.findByIdAndUpdate(stockId, {
					$inc: {
						'status.unitsProduct': -quantity,
						'status.stockCost': -(quantity * (product.unitIssue === 'pce' ? product.unitPurchasePrice : product.purchasePrice)),
					},
				}).catch(err =>
					next({
						code: err.errors ? 5 : 2,
						err,
					})
				);

				const writeOff = new WriteOff({
					stock: stockId,
					product: productId,
					user: userId,
					quantity: quantity,
				});

				writeOff
					.save()
					.then(async writeOff => {
						await writeOff
							.populate('product', 'name')
							.populate('user', 'name email')
							.execPopulate();

						return res.json(writeOff);
					})
					.catch(err =>
						next({
							code: err.errors ? 5 : 2,
							err,
						})
					);
			})
			.catch(err => next(err));
	}
);

export default writeOffsRouter;
