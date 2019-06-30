import { Router } from 'express';

import { isAuthedResolver, hasPermissionsInStock } from 'api/utils/permissions';

import Product from 'api/models/product';

const productsRouter = Router();

// const debug = require('debug')('api:products');

productsRouter.get(
	'/',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	(req, res, next) => {
		const { stockId, categoryId } = req.query;

		const conditions = { stock: stockId };

		if (categoryId) conditions.categoryId = categoryId;

		Product.find(conditions)
			.then(products => setTimeout(() => res.json(products), 300))
			.catch(err => next(err));
	}
);

productsRouter.post(
	'/',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	(req, res, next) => {
		const { name, amount, purchasePrice, sellingPrice, categoryId, stockId } = req.body;

		let product = new Product({
			name,
			amount,
			purchasePrice,
			sellingPrice,
			categoryId,
			stock: stockId,
		});

		return product
			.save()
			.then(product => res.json(product))
			.catch(err =>
				next({
					code: err.errors ? 5 : 2,
					err,
				})
			);
	}
);

productsRouter.put(
	'/:productId',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	(req, res, next) => {
		Product.findByIdAndUpdate(req.params.productId, { $set: req.body }, { runValidators: true })
			.then(() => res.json('success'))
			.catch(err =>
				next({
					code: err.errors ? 5 : 2,
					err,
				})
			);
	}
);

productsRouter.delete(
	'/:productId',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	(req, res, next) => {
		Product.findByIdAndDelete(req.params.productId)
			.then(() => res.json('success'))
			.catch(err => next(err));
	}
);

productsRouter.get(
	'/scanning/write-off/:productId',
	// isAuthedResolver,
	// (req, res, next) => hasPermissionsInStock(req, res, next, ['products.scanning']),
	(req, res, next) => {
		Product.findByIdAndUpdate(req.params.productId, { $inc: { amount: -1 } })
			.then(() => res.json('success'))
			.catch(err => next(err));
	}
);

export default productsRouter;
