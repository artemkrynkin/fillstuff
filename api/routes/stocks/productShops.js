import { Router } from 'express';

import { isAuthedResolver, hasPermissionsInStock } from 'api/utils/permissions';

import Stock from 'api/models/stock';

const productShopsRouter = Router();

// const debug = require('debug')('api:stocks');

productShopsRouter.post(
	'/:stockId/product-shops',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	(req, res, next) => {
		Stock.findById(req.params.stockId)
			.then(stock => {
				const shopIndex = stock.productShops.push(req.body);

				return stock
					.save()
					.then(stock => {
						return res.json(stock.productShops[shopIndex - 1]);
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

export default productShopsRouter;
