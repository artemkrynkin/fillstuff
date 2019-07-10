import { Router } from 'express';

import { isAuthedResolver, hasPermissionsInStock } from 'api/utils/permissions';

import Stock from 'api/models/stock';
import Product from 'api/models/product';

const categoriesRouter = Router();

const debug = require('debug')('api:stocks');

categoriesRouter.post(
	'/:stockId/categories',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	(req, res, next) => {
		Stock.findByIdAndUpdate(req.params.stockId, { $push: { categories: req.body } }, { new: true, runValidators: true })
			.then(stock => res.json(stock.categories))
			.catch(err =>
				next({
					code: err.errors ? 5 : 2,
					err,
				})
			);
	}
);

categoriesRouter.put(
	'/:stockId/categories/:categoryId',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	(req, res, next) => {
		const { name } = req.body;

		Stock.findById(req.params.stockId)
			.then(stock => {
				const categoryIndex = stock.categories.findIndex(category => String(category._id) === req.params.categoryId);

				stock.categories[categoryIndex].name = name;

				return Stock.findByIdAndUpdate(req.params.stockId, { $set: { categories: stock.categories } }, { runValidators: true })
					.then(() => res.json('success'))
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

categoriesRouter.delete(
	'/:stockId/categories/:categoryId',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	(req, res, next) => {
		Stock.findByIdAndUpdate(req.params.stockId, { $pull: { categories: { _id: req.params.categoryId } } })
			.then(async () => {
				await Product.updateMany({ categoryId: req.params.categoryId }, { categoryId: '' }).catch(err =>
					next({
						code: 2,
						err,
					})
				);

				res.json('success');
			})
			.catch(err =>
				next({
					code: 2,
					err,
				})
			);
	}
);

export default categoriesRouter;
