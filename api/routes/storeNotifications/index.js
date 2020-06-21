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

storeNotificationsRouter.post(
	'/getStoreNotification',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			params: { storeNotificationId },
		} = req.body;

		const storeNotification = await StoreNotification.findById(storeNotificationId)
			.populate([
				{
					path: 'position',
					populate: [
						{
							path: 'characteristics shops.shop shops.lastProcurement',
						},
						{
							path: 'receipts',
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
			.lean()
			.catch(err => next(err));

		if (storeNotification.type === 'position-ends') {
			storeNotification.position.shops = storeNotification.position.shops.map(shop => {
				shop.lastProcurement.receipt = storeNotification.position.receipts.find(
					receipt =>
						String(receipt._id) === String(shop.lastProcurement.receipts.find(receiptId => String(receiptId) === String(receipt._id)))
				);
				delete shop.lastProcurement.receipts;

				return shop;
			});

			storeNotification.position.receipts = storeNotification.position.receipts.filter(receipt => /received|active/.test(receipt.status));
		}

		res.json(storeNotification);
	}
);

export default storeNotificationsRouter;
