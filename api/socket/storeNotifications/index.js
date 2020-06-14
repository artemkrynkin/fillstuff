import Emitter from 'api/utils/emitter';

import StoreNotification from 'api/models/storeNotification';

export const createStoreNotification = io => {
	Emitter.on('createStoreNotification', async storeNotificationValues => {
		const newStoreNotification = new StoreNotification(storeNotificationValues);

		const newStoreNotificationErr = newStoreNotification.validateSync();

		if (newStoreNotificationErr) return;

		await newStoreNotification.save();

		const storeNotification = await StoreNotification.findById(newStoreNotification._id).populate([
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
		]);

		io.in(storeNotificationValues.studio).emit('editStoreNotification', storeNotification);
	});
};

export const deleteStoreNotification = io => {
	Emitter.on('deleteStoreNotification', async storeNotificationValues => {
		const storeNotification = await StoreNotification.findOneAndRemove(storeNotificationValues);

		io.in(storeNotificationValues.studio).emit('deleteStoreNotification', storeNotification);
	});
};
