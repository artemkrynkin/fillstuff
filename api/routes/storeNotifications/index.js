import { Router } from 'express';

import { isAuthed, hasPermissions } from 'api/utils/permissions';

import StoreNotification from 'api/models/storeNotification';

const storeNotificationsRouter = Router();

// const debug = require('debug')('api:studio');

storeNotificationsRouter.post(
	'/getStoreNotifications',
	isAuthed,
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
							path: 'characteristics',
						},
						{
							path: 'parentPosition',
							populate: {
								path: 'characteristics',
							},
						},
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
							path: 'orderedByMember',
							select: 'user',
							populate: {
								path: 'user',
								select: 'avatar name email',
							},
						},
						{
							path: 'orderedReceiptsPositions.position',
							populate: [
								{
									path: 'childPosition',
									select: 'name characteristics',
									populate: {
										path: 'characteristics',
									},
								},
								{
									path: 'parentPosition',
									select: 'name characteristics',
									populate: {
										path: 'characteristics',
									},
								},
								{
									path: 'characteristics',
								},
							],
						},
						{
							path: 'shop',
						},
					],
				},
				{
					path: 'invoice',
					populate: [
						{
							path: 'member',
							populate: {
								path: 'user',
								select: 'avatar name email',
							},
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
	isAuthed,
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
							path: 'characteristics',
						},
						{
							path: 'parentPosition',
							populate: {
								path: 'characteristics',
							},
						},
						{
							path: 'characteristics shops.shop shops.lastProcurement receipts',
						},
					],
				},
				{
					path: 'procurement',
					populate: [
						{
							path: 'orderedByMember',
							select: 'user',
							populate: {
								path: 'user',
								select: 'avatar name email',
							},
						},
						{
							path: 'orderedReceiptsPositions.position',
							populate: [
								{
									path: 'childPosition',
									select: 'name characteristics',
									populate: {
										path: 'characteristics',
									},
								},
								{
									path: 'parentPosition',
									select: 'name characteristics',
									populate: {
										path: 'characteristics',
									},
								},
								{
									path: 'characteristics',
								},
							],
						},
						{
							path: 'shop',
						},
					],
				},
				{
					path: 'invoice',
					populate: [
						{
							path: 'member',
							populate: {
								path: 'user',
								select: 'avatar name email',
							},
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
				if (shop.lastProcurement) {
					shop.lastProcurement.receipt = storeNotification.position.receipts.find(
						receipt =>
							String(receipt._id) === String(shop.lastProcurement.receipts.find(receiptId => String(receiptId) === String(receipt._id)))
					);
					delete shop.lastProcurement.receipts;
				}

				return shop;
			});

			storeNotification.position.receipts = storeNotification.position.receipts.filter(receipt => /received|active/.test(receipt.status));
		}

		res.json(storeNotification);
	}
);

export default storeNotificationsRouter;
