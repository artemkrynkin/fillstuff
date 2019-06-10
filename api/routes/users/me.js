import fs from 'fs';
import { Router } from 'express';
import multer from 'multer';
import validator from 'validator';
import i18n from 'i18n';
import sharp from 'sharp';

import { uploadProfilePhoto } from 'api/utils/multer-settings';
import { isAuthedResolver } from 'api/utils/permissions';
import { updateCookieUserData } from 'api/utils/update-cookie-user-data';

import User, { UserSchema } from 'api/models/user';

const meRouter = Router();
const upload = uploadProfilePhoto.single('profilePhoto');

meRouter.get('/me', isAuthedResolver, (req, res) => {
	res.json(req.user);
});

meRouter.put(
	'/me',
	isAuthedResolver,
	(req, res, next) => {
		upload(req, res, err => {
			if (err instanceof multer.MulterError) {
				return next({
					code: 7,
					message: err.code === 'LIMIT_FILE_SIZE' ? i18n.__('Файл слишком большой') : err.message,
				});
			}

			next();
		});
	},
	async (req, res, next) => {
		const { newEmail, oldPassword, newPassword, confirmPassword } = req.body;

		if (newEmail) {
			User.findOne({ email: newEmail })
				.then(existingUser => {
					if (existingUser) {
						return next({
							code: 5,
							customErr: [
								{
									field: 'newEmail',
									message: validator.equals(String(req.user._id), String(existingUser._id))
										? i18n.__('Введённый Email уже привязан к текущему аккаунту')
										: i18n.__('A person with this E-mail already registered'),
								},
							],
						});
					}

					return User.findByIdAndUpdate(
						req.user._id,
						{ email: newEmail, modifiedAt: Date.now() },
						{ new: true, runValidators: true, fields: { salt: false, hashedPassword: false, 'vkProvider.accessToken': false } }
					)
						.then(async user => {
							await updateCookieUserData(req, user);

							return res.json(user);
						})
						.catch(err =>
							next({
								code: err.errors ? 5 : 2,
								err,
							})
						);
				})
				.catch(err => next(err));
		} else if (oldPassword || newPassword || confirmPassword) {
			User.findById(req.user._id)
				.then(user => {
					const customErr = [];

					if (!validator.isLength(newPassword.trim(), { min: 6 }) || !newPassword) {
						customErr.push({
							field: 'newPassword',
							message: !validator.isLength(newPassword.trim(), { min: 6 })
								? i18n.__('Пароль не может быть короче 6 символов')
								: i18n.__('Обязательное поле'),
						});
					}

					if (user.hasPassword) {
						if (
							!oldPassword ||
							(oldPassword && !user.checkPassword(oldPassword)) ||
							!validator.isLength(oldPassword.trim(), { min: 6 })
						) {
							customErr.push({
								field: 'oldPassword',
								message:
									oldPassword && !user.checkPassword(oldPassword)
										? i18n.__('Старый пароль введён неверно')
										: !validator.isLength(oldPassword.trim(), { min: 6 })
										? i18n.__('Пароль не может быть короче 6 символов')
										: i18n.__('Обязательное поле'),
							});
						}
						if (!confirmPassword || !validator.equals(newPassword, confirmPassword)) {
							customErr.push({
								field: 'confirmPassword',
								message: !validator.equals(newPassword, confirmPassword)
									? i18n.__('Новый пароль повторён неправильно')
									: i18n.__('Обязательное поле'),
							});
						}
					}

					if (customErr.length)
						return next({
							code: 5,
							customErr,
						});

					user.password = newPassword;
					user.modifiedAt = Date.now();

					return user
						.save()
						.then(user => {
							return user
								.execPopulate()
								.then(async () => {
									UserSchema.options.toObject.deleteConfidentialData = true;

									await updateCookieUserData(req, user.toObject());

									return res.json(user.toObject());
								})
								.catch(err => next(err));
						})
						.catch(err =>
							next({
								code: err.errors ? 5 : 2,
								err,
							})
						);
				})
				.catch(err => next(err));
		} else {
			let updateData = req.body;

			if (req.file) {
				await sharp(req.file.path)
					.resize(300, 300)
					.jpeg({
						quality: 80,
					})
					.toFile(`${req.file.path}.jpg`)
					.then(() => {
						const rootFolder = process.env.NODE_ENV === 'production' ? 'build' : 'public';

						updateData.profilePhoto = `${req.file.path.replace(rootFolder, '')}.jpg`;

						fs.unlink(req.file.path, err => {
							if (err) return next(err);
						});

						if (req.user.profilePhoto && !!~req.user.profilePhoto.search('upload')) {
							fs.unlink(rootFolder + req.user.profilePhoto, err => {
								if (err) return next(err);
							});
						}
					});
			}

			updateData.modifiedAt = Date.now();

			return User.findByIdAndUpdate(req.user._id, updateData, {
				new: true,
				runValidators: true,
				fields: { salt: false, hashedPassword: false, 'vkProvider.accessToken': false },
			})
				.then(async user => {
					await updateCookieUserData(req, user);

					return res.json(user);
				})
				.catch(err =>
					next({
						code: err.errors ? 5 : 2,
						err,
					})
				);
		}
	}
);

meRouter.post('/me/notifications', isAuthedResolver, (req, res, next) => {
	const updateData = req.body;

	return User.findByIdAndUpdate(
		req.user._id,
		{
			modifiedAt: Date.now(),
			['notifications.' +
			(updateData.parameter ? updateData.parameter : updateData.channel + '.' + updateData.option)]: updateData.enabled,
		},
		{ new: true, fields: { salt: false, hashedPassword: false, 'vkProvider.accessToken': false } }
	)
		.then(async user => {
			await updateCookieUserData(req, user);

			return res.json(user.notifications);
		})
		.catch(err =>
			next({
				code: 2,
				err,
			})
		);
});

meRouter.put('/me/active-project', isAuthedResolver, (req, res, next) => {
	const { activeProjectId } = req.body;

	return User.findByIdAndUpdate(
		req.user._id,
		{ activeProjectId: activeProjectId },
		{ new: true, fields: { salt: false, hashedPassword: false, 'vkProvider.accessToken': false } }
	)
		.then(async user => {
			await updateCookieUserData(req, user);

			return res.json('success');
		})
		.catch(err =>
			next({
				code: 2,
				err,
			})
		);
});

export default meRouter;
