import Emitter from 'api/utils/emitter';

import User from 'api/models/user';
import Member from 'api/models/member';
import StoreNotification from 'api/models/storeNotification';

export const newStoreNotification = io => {
	Emitter.on('newStoreNotification', async storeNotificationValues => {
		const newStoreNotification = new StoreNotification(storeNotificationValues);

		const newStoreNotificationErr = newStoreNotification.validateSync();

		if (newStoreNotificationErr) return;

		await newStoreNotification.save();

		const storeNotification = await StoreNotification.findById(newStoreNotification._id).populate([
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
						model: Member,
						populate: {
							path: 'user',
							model: User,
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
						model: Member,
						populate: {
							path: 'user',
							model: User,
							select: 'avatar name email',
						},
					},
				],
			},
			{
				path: 'writeOff',
			},
		]);

		io.in(storeNotificationValues.studio).emit('newStoreNotification', storeNotification);
	});
};

export const editStoreNotification = io => {
	Emitter.on('editStoreNotification', async storeNotificationValues => {
		const storeNotification = await StoreNotification.findOne(storeNotificationValues).populate([
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
						model: Member,
						populate: {
							path: 'user',
							model: User,
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
						model: Member,
						populate: {
							path: 'user',
							model: User,
							select: 'avatar name email',
						},
					},
				],
			},
			{
				path: 'writeOff',
			},
		]);

		if (storeNotification) io.in(storeNotificationValues.studio).emit('editStoreNotification', storeNotification);
	});
};

export const deleteStoreNotification = io => {
	Emitter.on('deleteStoreNotification', async storeNotificationValues => {
		const storeNotification = await StoreNotification.findOneAndRemove(storeNotificationValues);

		if (storeNotification) io.in(storeNotificationValues.studio).emit('deleteStoreNotification', storeNotification);
	});
};
