import { Router } from 'express';

import { isAuthedResolver, hasPermissions } from 'api/utils/permissions';

import Characteristic from 'api/models/characteristic';

const characteristicsRouter = Router();

// const debug = require('debug')('api:studio');

characteristicsRouter.post(
	'/getCharacteristics',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	(req, res, next) => {
		const {
			studioId,
			params: { type },
		} = req.body;

		const conditions = { studio: studioId };

		if (type) conditions.type = type;

		Characteristic.find(conditions)
			.then(characteristics => res.json(characteristics))
			.catch(err => next(err));
	}
);

characteristicsRouter.post(
	'/createCharacteristic',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	(req, res, next) => {
		const {
			studioId,
			data: { characteristic: newCharacteristic },
		} = req.body;

		const characteristic = new Characteristic({
			studio: studioId,
			...newCharacteristic,
		});

		return characteristic
			.save()
			.then(characteristic => res.json(characteristic))
			.catch(err => next({ code: err.errors ? 5 : 2, err }));
	}
);

export default characteristicsRouter;
