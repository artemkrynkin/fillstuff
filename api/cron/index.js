import { CronJob } from 'cron';
import moment from 'moment';

import Studio from 'api/models/studio';
import Position from 'api/models/position';

// [минута][час][день][месяц][неделя][пользователь][команда]

const studiosIds = {};

new CronJob(
	'00 00 00 * * *',
	() => {
		console.log(`cron job for recalculate studios launched in ${moment(new Date()).format('DD MMMM в HH:mm:ss')}`);

		Studio.find().then(studios => {
			studios.forEach(studio => {
				if (studiosIds[studio._id] === undefined) {
					studiosIds[studio._id] = {
						cron: new CronJob(
							'00 00 00 * * *',
							async () => {
								console.log(`Studio indicators under ID: ${studio._id} recalculated to ${moment(new Date()).format('DD MMMM в HH:mm:ss')}`);

								const positions = await Position.find({
									studio: studio._id,
									isArchived: false,
								}).populate([
									{
										path: 'receipts',
										match: { status: /received|active/ },
										options: {
											sort: { createdAt: 1 },
										},
									},
								]);

								const storePrice = positions
									.filter(position => position.receipts.length)
									.reduce((sum, position) => {
										return (
											sum +
											position.receipts.reduce(
												(purchasePrice, receipt) => purchasePrice + receipt.current.quantity * receipt.unitPurchasePrice,
												0
											)
										);
									}, 0);

								await Studio.findByIdAndUpdate(
									studio._id,
									{
										$set: {
											'store.numberPositions': positions.length,
											'store.storePrice': storePrice,
										},
									},
									{ runValidators: true }
								);
							},
							null,
							true,
							studio.timezone || 'UTC'
						),
					};
				}
			});
		});
	},
	null,
	true,
	'UTC'
);
