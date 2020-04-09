import { Router } from 'express';
import mongoose from 'mongoose';
// import i18n from 'i18n';

import { isAuthedResolver, hasPermissions } from 'api/utils/permissions';

import Studio from 'api/models/studio';

const studioRouter = Router();

// const debug = require('debug')('api:studios');

studioRouter.post('/getStudio', isAuthedResolver, (req, res, next) => {
	const { studioId, userId } = req.body;

	Studio.findOne({ _id: studioId, users: mongoose.Types.ObjectId(userId) })
		.then(studio => res.json(studio))
		.catch(err => next(err));
});

studioRouter.post('/getStudioStore', isAuthedResolver, (req, res, next) => {
	const { studioId } = req.body;

	Studio.findById(studioId)
		.then(studio => res.json(studio.store))
		.catch(err => next(err));
});

studioRouter.post(
	'/editStudio',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['studio.control']),
	(req, res, next) => {
		const { studioId, data: studioEdited } = req.body;

		Studio.findByIdAndUpdate(studioId, { $set: studioEdited }, { runValidators: true })
			.then(() => res.json('success'))
			.catch(err => next({ code: err.errors ? 5 : 2, err }));
	}
);

export default studioRouter;
