import express from 'express';
import validator from 'validator';
import i18n from 'i18n';

import User from 'api/models/user';
import Project from 'api/models/project';

const router = express.Router();

router.post('/registration', function(req, res, next) {
	const { email, name, password } = req.body;

	User.findOne({ email })
		.then(async existingUser => {
			const customErr = [];

			if (existingUser || !email) {
				customErr.push({
					field: 'email',
					message: existingUser ? i18n.__('A person with this E-mail already registered') : i18n.__('Обязательное поле'),
				});
			}

			if (!validator.isLength(password.trim(), { min: 6 }) || !password) {
				customErr.push({
					field: 'password',
					message: !validator.isLength(password.trim(), { min: 6 })
						? i18n.__('Пароль не может быть короче 6 символов')
						: i18n.__('Обязательное поле'),
				});
			}

			if (customErr.length)
				return next({
					code: 5,
					customErr,
				});

			let user = new User({ name, email, password });
			let project = new Project({
				name: 'Проект #1',
				members: [
					{
						user: user._id,
						role: 'owner',
					},
				],
			});

			user.activeProjectId = project;

			await user.save().catch(err =>
				next({
					code: err.errors ? 5 : 2,
					err,
				})
			);

			await project.save().catch(err =>
				next({
					code: err.errors ? 5 : 2,
					err,
				})
			);

			res.json('success');
		})
		.catch(err => next(err));
});

export default router;
