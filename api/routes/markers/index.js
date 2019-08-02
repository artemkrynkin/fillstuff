import { Router } from 'express';

import { isAuthedResolver, hasPermissionsInStock } from 'api/utils/permissions';

import Stock from 'api/models/stock';
import Product from 'api/models/product';
import Marker from 'api/models/Marker';

const markersRouter = Router();

// const debug = require('debug')('api:products');

markersRouter.get(
	'/markers/:markerId/archive',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	(req, res, next) => {
		Marker.findByIdAndUpdate(req.params.markerId, { isArchived: true })
			.populate('product')
			.then(async marker => {
				if (!marker.product.dividedMarkers) {
					await Product.findByIdAndUpdate(marker.product._id, { $inc: { quantity: -marker.quantity } }).catch(err =>
						next({ code: 2, err })
					);
				}

				await Stock.findByIdAndUpdate(
					marker.stock,
					{
						$inc: {
							'status.numberMarkers': -1,
							'status.stockCost': -(marker.quantity * marker.unitPurchasePrice),
						},
					},
					{ runValidators: true }
				).catch(err => next({ code: 2, err }));

				res.json('success');
			})
			.catch(err => next({ code: 2, err }));
	}
);

export default markersRouter;
