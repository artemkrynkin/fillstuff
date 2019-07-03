import { Router } from 'express';

import { isAuthedResolver, hasPermissionsInStock } from 'api/utils/permissions';

import Stock from 'api/models/stock';

const productSpecificationsRouter = Router();

// const debug = require('debug')('api:stocks');

productSpecificationsRouter.post(
	'/:stockId/product-specifications/:schemaName',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	(req, res, next) => {
		if (!~req.params.schemaName.search(/names|values/)) return next({ code: 6 });

		Stock.findById(req.params.stockId)
			.then(stock => {
				const specificationIndex = stock.productSpecifications[req.params.schemaName].push(req.body);

				return stock
					.save()
					.then(stock => {
						return res.json(stock.productSpecifications[req.params.schemaName][specificationIndex - 1]);
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

productSpecificationsRouter.put(
	'/:stockId/product-specifications/:schemaName/:specificationId',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	(req, res, next) => {
		const { label } = req.body;

		if (req.params.schemaName !== 'names' || req.params.schemaName !== 'values') return next({ code: 6 });

		Stock.findById(req.params.stockId)
			.then(stock => {
				const specification = stock.productSpecifications[req.params.schemaName].id(req.params.specificationId);

				specification.label = label;

				return Stock.findByIdAndUpdate(
					req.params.stockId,
					{ $set: { [`productSpecifications.${req.params.schemaName}`]: stock.productSpecifications } },
					{ runValidators: true }
				)
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

// productSpecificationsRouter.delete(
// 	'/:stockId/product-specifications/:schemaName/:specificationId',
// 	isAuthedResolver,
// 	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
// 	(req, res, next) => {
// 		if (req.params.schemaName !== 'names' || req.params.schemaName !== 'values') return next({ code: 6 });
//
// 		Stock.findByIdAndUpdate(req.params.stockId, { $pull: { [`productSpecifications.${req.params.schemaName}`]: { _id: req.params.specificationId } } })
// 			.then(async () => {
// 				await Product.updateMany({ [`specifications${req.params.schemaName === 'names' ? 'nameId' : 'valueId'}`]: req.params.specificationId }, { categoryId: '' }).catch(err =>
// 					next({
// 						code: 2,
// 						err,
// 					})
// 				);
//
// 				res.json('success');
// 			})
// 			.catch(err =>
// 				next({
// 					code: 2,
// 					err,
// 				})
// 			);
// 	}
// );

export default productSpecificationsRouter;
