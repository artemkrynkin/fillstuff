import { CronJob } from 'cron';
import moment from 'moment';

import Stock from 'api/models/stock';
import Position from 'api/models/position';

// [минута][час][день][месяц][неделя][пользователь][команда]

const stocksIds = {};

new CronJob(
	'00 00 00 * * *',
	() => {
		console.log(`cron job for recalculate stocks launched in ${moment(new Date()).format('DD MMMM в HH:mm:ss')}`);

		Stock.find().then(stocks => {
			stocks.forEach(stock => {
				if (stocksIds[stock._id] === undefined) {
					stocksIds[stock._id] = {
						cron: new CronJob(
							'00 00 00 * * *',
							async () => {
								console.log(`Stock status under ID: ${stock._id} recalculated to ${moment(new Date()).format('DD MMMM в HH:mm:ss')}`);

								const positions = await Position.find({
									stock: stock._id,
									isArchived: false,
								}).populate({
									path: 'activeReceipt characteristics',
								});

								const stockPrice = positions.reduce((sum, position) => {
									return (
										sum +
										position.activeReceipt.current.quantity *
											(position.activeReceipt.unitPurchasePrice + position.activeReceipt.unitCostDelivery)
									);
								}, 0);

								await Stock.findByIdAndUpdate(
									stock._id,
									{
										$set: {
											'status.stockPrice': stockPrice,
										},
									},
									{ runValidators: true }
								);
							},
							null,
							true,
							stock.timezone || 'UTC'
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
