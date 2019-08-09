import { Router } from 'express';

import { isAuthedResolver, hasPermissionsInStock } from 'api/utils/permissions';

import Characteristic from 'api/models/characteristic';

const characteristicsRouter = Router();

// const debug = require('debug')('api:stocks');

characteristicsRouter.get(
	'/characteristics',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	(req, res, next) => {
		const { stockId } = req.query;

		Characteristic.find({ stock: stockId })
			.then(characteristics => res.json(characteristics))
			.catch(err => next(err));
	}
);

characteristicsRouter.post(
	'/characteristics',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	(req, res, next) => {
		const characteristic = new Characteristic(req.body);

		return characteristic
			.save()
			.then(characteristic => res.json(characteristic))
			.catch(err => next({ code: err.errors ? 5 : 2, err }));
	}
);

export default characteristicsRouter;
