import express from 'express';
import i18n from 'i18n';

// import customPassword from 'shared/passwordGenerate';

import User from 'api/models/user';
import Stock from 'api/models/stock';

const router = express.Router();

router.post('/registration', function(req, res, next) {
	const { email, password } = req.body;

	// customPassword()

	User.findOne({ email })
		.then(async existingUser => {
			const customErr = [];

			if (existingUser || !email) {
				customErr.push({
					field: 'email',
					message: existingUser ? i18n.__('A person with this E-mail already registered') : i18n.__('Обязательное поле'),
				});
			}

			if (customErr.length)
				return next({
					code: 5,
					customErr,
				});

			let user = new User({ email, password });
			let stock = new Stock({
				name: 'Склад #1',
				members: [
					{
						user: user._id,
						role: 'owner',
					},
				],
			});

			user.activeStockId = stock;

			await user.save().catch(err =>
				next({
					code: err.errors ? 5 : 2,
					err,
				})
			);

			await stock.save().catch(err =>
				next({
					code: err.errors ? 5 : 2,
					err,
				})
			);

			User.findOne({ _id: user._id }, { salt: false, hashedPassword: false })
				.then(user => {
					req.login(user, () => res.json('success'));
				})
				.catch(err => next(err));
		})
		.catch(err => next(err));
});

export default router;
