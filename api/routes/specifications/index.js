import { Router } from 'express';

import { isAuthedResolver, hasPermissionsInStock } from 'api/utils/permissions';

import Specification from 'api/models/specification';

const specificationsRouter = Router();

// const debug = require('debug')('api:stocks');

specificationsRouter.get(
	'/specifications',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	(req, res, next) => {
		const { stockId } = req.query;

		Specification.find({ stock: stockId })
			.then(specifications => res.json(specifications))
			.catch(err => next(err));
	}
);

specificationsRouter.post(
	'/specifications',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	(req, res, next) => {
		const specification = new Specification(req.body);

		return specification
			.save()
			.then(specification => res.json(specification))
			.catch(err => next({ code: err.errors ? 5 : 2, err }));
	}
);

export default specificationsRouter;
