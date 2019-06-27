import { Router } from 'express';
import i18n from 'i18n';

import { isAuthedResolver, hasPermissionsInStock } from 'api/utils/permissions';
import { updateCookieUserData } from 'api/utils/update-cookie-user-data';

import User from 'api/models/user';
import Stock from 'api/models/stock';

const stocksRouter = Router();

const debug = require('debug')('api:stocks');

stocksRouter.get('/', isAuthedResolver, (req, res, next) => {
	Stock.find({ 'members.user': req.user._id })
		.populate('members.user', 'profilePhoto name email')
		.then(stocks => setTimeout(() => res.json(stocks), 200))
		.catch(err => next(err));
});

stocksRouter.post('/', isAuthedResolver, (req, res, next) => {
	const { name } = req.body;

	Stock.find({ 'members.user': req.user._id })
		.then(stocks => {
			if (stocks.some(stock => stock.name === name))
				return next({
					code: 5,
					customErr: [
						{
							field: 'name',
							message: i18n.__('Склад с таким названием уже существует'),
						},
					],
				});

			let stock = new Stock({
				name: name,
				members: [
					{
						user: req.user._id,
						role: 'owner',
					},
				],
			});

			return stock
				.save()
				.then(stock => {
					return User.findByIdAndUpdate(
						req.user._id,
						{ activeStockId: stock },
						{ new: true, fields: { salt: false, hashedPassword: false } }
					)
						.then(async user => {
							await updateCookieUserData(req, user);

							return stock
								.populate('members.user', 'profilePhoto name email')
								.execPopulate()
								.then(() => res.json(stock))
								.catch(err => next(err));
						})
						.catch(err =>
							next({
								code: 2,
								err,
							})
						);
				})
				.catch(err =>
					next({
						code: err.errors ? 5 : 2,
						err,
					})
				);
		})
		.catch(err => next(err));
});

stocksRouter.put(
	'/:stockId',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['stock.control']),
	(req, res, next) => {
		Stock.findByIdAndUpdate(req.params.stockId, { $set: req.body }, { runValidators: true })
			.then(() => res.json('success'))
			.catch(err =>
				next({
					code: err.errors ? 5 : 2,
					err,
				})
			);
	}
);

// stocksRouter.delete(
// 	'/:stockId',
// 	isAuthedResolver,
// 	(req, res, next) => hasPermissionsInStock(req, res, next, ['stock.full_control']),
// 	async (req, res, next) => {
// 		await Stock.findByIdAndDelete(req.params.stockId)
// 			.catch(err => next(err));
//
// 		Stock.find({ 'members.user': req.user._id })
// 			.then(async stocks => {
// 				const nextStockId = stocks.length
// 					? stocks.sort((stockA, stockB) => stockB.createdAt - stockA.createdAt)[0]._id
// 					: null;
//
// 				await User.findByIdAndUpdate(
// 					req.user._id,
// 					{ activeStockId: nextStockId },
// 					{ new: true, fields: { salt: false, hashedPassword: false } }
// 				)
// 					.then(user => updateCookieUserData(req, user))
// 					.catch(err =>
// 						next({
// 							code: 2,
// 							err,
// 						})
// 					);
//
// 				return res.json(nextStockId);
// 			})
// 			.catch(err => next(err));
// 	}
// );

export default stocksRouter;
