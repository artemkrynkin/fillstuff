import { Router } from 'express';

import { isAuthedResolver, hasPermissions } from 'api/utils/permissions';

import StoreNotification from 'api/models/storeNotification';

const storeNotificationsRouter = Router();

// const debug = require('debug')('api:studio');

storeNotificationsRouter.post(
	'/getStoreNotifications',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	(req, res, next) => {
		const { studioId } = req.body;

		StoreNotification.find({ studio: studioId })
			.sort({ createdAt: -1 })
			.populate([
				{
					path: 'position',
					populate: [
						{
							path: 'receipts',
							match: { status: /received|active/ },
							options: {
								sort: { createdAt: 1 },
							},
						},
					],
				},
				{
					path: 'procurement',
					populate: [
						{
							path: 'shop',
						},
					],
				},
				{
					path: 'writeOff',
				},
			])
			.then(storeNotifications => res.json(storeNotifications))
			.catch(err => next(err));
	}
);

export default storeNotificationsRouter;
