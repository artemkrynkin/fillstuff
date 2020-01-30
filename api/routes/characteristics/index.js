import { Router } from 'express';

import { isAuthedResolver, hasPermissionsInStudio } from 'api/utils/permissions';

import Characteristic from 'api/models/characteristic';

const characteristicsRouter = Router();

// const debug = require('debug')('api:studio');

characteristicsRouter.post(
	'/getCharacteristics',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStudio(req, res, next, ['products.control']),
	(req, res, next) => {
		const { studioId } = req.body;

		Characteristic.find({ studio: studioId })
			.then(characteristics => res.json(characteristics))
			.catch(err => next(err));
	}
);

characteristicsRouter.post(
	'/createCharacteristics',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStudio(req, res, next, ['products.control']),
	(req, res, next) => {
		const {
			data: { characteristic: newCharacteristic },
		} = req.body;

		const characteristic = new Characteristic(newCharacteristic);

		return characteristic
			.save()
			.then(characteristic => res.json(characteristic))
			.catch(err => next({ code: err.errors ? 5 : 2, err }));
	}
);

export default characteristicsRouter;
