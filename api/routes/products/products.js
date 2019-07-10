import { Router } from 'express';

import { isAuthedResolver, hasPermissionsInStock } from 'api/utils/permissions';

import Stock from 'api/models/stock';
import Product from 'api/models/product';

const productsRouter = Router();

// const debug = require('debug')('api:products');

productsRouter.get(
	'/',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	(req, res, next) => {
		const { stockId, categoryId } = req.query;

		const conditions = {
			stock: stockId,
			archived: false,
		};

		if (categoryId) conditions.categoryId = categoryId;

		Product.find(conditions)
			.collation({ locale: 'ru', strength: 3 })
			.sort({ name: 1 })
			.then(products => setTimeout(() => res.json(products), 300))
			.catch(err => next(err));
	}
);

productsRouter.post(
	'/',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	(req, res, next) => {
		const { stockId } = req.query;

		let product = new Product({
			...req.body,
			stock: stockId,
		});

		return product
			.save()
			.then(async product => {
				const { unitIssue, quantity, quantityInUnit, purchasePrice } = product;

				await Stock.findByIdAndUpdate(stockId, {
					$inc: {
						'status.numberProducts': 1,
						'status.unitsProduct': unitIssue === 'pce' ? quantityInUnit : quantity,
						'status.stockCost': quantity * purchasePrice,
					},
				}).catch(err =>
					next({
						code: err.errors ? 5 : 2,
						err,
					})
				);

				res.json(product);
			})
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
		const { unitIssue, quantity, quantityInUnit, purchasePrice } = req.body;

		Product.findByIdAndUpdate(req.params.productId, { $set: req.body }, { runValidators: true })
			.then(async product => {
				await Stock.findByIdAndUpdate(product.stock, {
					$inc: {
						'status.unitsProduct': unitIssue === 'pce' ? quantityInUnit - product.quantityInUnit : quantity - product.quantity,
						'status.stockCost': quantity * purchasePrice - product.quantity * product.purchasePrice,
					},
				}).catch(err =>
					next({
						code: err.errors ? 5 : 2,
						err,
					})
				);

				res.json('success');
			})
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
		Product.findByIdAndUpdate(req.params.productId, { archived: true })
			.then(async product => {
				await Stock.findByIdAndUpdate(product.stock, {
					$inc: {
						'status.numberProducts': -1,
						'status.unitsProduct': product.unitIssue === 'pce' ? -product.quantityInUnit : -product.quantity,
						'status.stockCost': -(product.quantity * product.purchasePrice),
					},
				}).catch(err =>
					next({
						code: err.errors ? 5 : 2,
						err,
					})
				);

				res.json('success');
			})
			.catch(err => next(err));
	}
);

export default productsRouter;
