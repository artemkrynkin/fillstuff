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
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.scanning']),
	async (req, res, next) => {
		const { stockId, productId, userId, amount } = req.body;

		return Product.findByIdAndUpdate(productId, { $inc: { amount: amount ? -amount : -1 } }, { runValidators: true })
			.then(async product => {
				await Stock.findByIdAndUpdate(stockId, {
					$inc: {
						'status.unitsProduct': amount ? -amount : -1,
						'status.stockCost': -(amount * product.purchasePrice),
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
					amount: amount,
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
