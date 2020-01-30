import { Router } from 'express';

import { isAuthedResolver, hasPermissionsInStudio } from 'api/utils/permissions';

import Member from 'api/models/member';

const membersRouter = Router();

// const debug = require('debug')('api:products');

membersRouter.post(
	'/getMembers',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStudio(req, res, next, ['products.control']),
	(req, res, next) => {
		const { studioId } = req.body;

		Member.find({ studio: studioId })
			.populate('user', 'avatar name email')
			.then(members => res.json(members))
			.catch(err => next({ code: 2, err }));
	}
);

export default membersRouter;
