import { Router } from 'express';

import { isAuthedResolver, hasPermissionsInStock } from 'api/utils/permissions';

import Manufacturer from 'api/models/manufacturer';

const manufacturersRouter = Router();

// const debug = require('debug')('api:stocks');

manufacturersRouter.get(
	'/manufacturers',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	(req, res, next) => {
		const { stockId } = req.query;

		Manufacturer.find({ stock: stockId })
			.then(manufacturers => res.json(manufacturers))
			.catch(err => next(err));
	}
);

manufacturersRouter.post(
	'/manufacturers',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	(req, res, next) => {
		const manufacturer = new Manufacturer(req.body);

		return manufacturer
			.save()
			.then(manufacturer => res.json(manufacturer))
			.catch(err => next({ code: err.errors ? 5 : 2, err }));
	}
);

export default manufacturersRouter;
