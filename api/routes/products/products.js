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
		const { stockId } = req.query;

		Product.find({
			stock: stockId,
			archived: false,
		})
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
				await Stock.findByIdAndUpdate(stockId, {
					$inc: {
						'status.numberProducts': 1,
						'status.unitsProduct': product.quantity,
						'status.stockCost': product.quantity * product.unitPurchasePrice,
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
	async (req, res, next) => {
		return Product.findById(req.params.productId)
			.then(product => {
				const productUpdate = { ...req.body };
				const { quantity: quantityOld, unitPurchasePrice: unitPurchasePriceOld } = product;

				product.name = productUpdate.name;
				product.archived = productUpdate.archived;
				product.receiptUnits = productUpdate.receiptUnits;
				product.unitIssue = productUpdate.unitIssue;
				product.quantity = productUpdate.quantity;
				product.quantityPackages = productUpdate.quantityPackages;
				product.quantityInUnit = productUpdate.quantityInUnit;
				product.minimumBalance = productUpdate.minimumBalance;
				product.purchasePrice = productUpdate.purchasePrice;
				product.sellingPrice = productUpdate.sellingPrice;
				product.unitPurchasePrice = productUpdate.unitPurchasePrice;
				product.unitSellingPrice = productUpdate.unitSellingPrice;
				product.freeProduct = productUpdate.freeProduct;
				product.shopId = productUpdate.shopId;
				product.specifications = productUpdate.specifications;

				return product
					.save()
					.then(async product => {
						await Stock.findByIdAndUpdate(product.stock, {
							$inc: {
								'status.unitsProduct': product.quantity - quantityOld,
								'status.stockCost': product.quantity * product.unitPurchasePrice - quantityOld * unitPurchasePriceOld,
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
						'status.unitsProduct': -product.quantity,
						'status.stockCost': -(product.quantity * product.unitPurchasePrice),
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
