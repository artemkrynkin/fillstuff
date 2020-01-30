import fs from 'fs';
import { Router } from 'express';
import multer from 'multer';
import validator from 'validator';
import i18n from 'i18n';
import sharp from 'sharp';

import { uploadAvatar } from 'api/utils/multer-settings';
import { isAuthedResolver } from 'api/utils/permissions';
import { updateCookieUserData } from 'api/utils/update-cookie-user-data';

import mongoose from 'mongoose';
import User, { UserSchema } from 'api/models/user';
import Member from 'api/models/member';

const accountRouter = Router();
const upload = uploadAvatar.single('avatar');

accountRouter.post('/getMyAccount', isAuthedResolver, (req, res) => {
	res.json(req.user);
});

accountRouter.post(
	'/editMyAccount',
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
		const {
			data: { newEmail, oldPassword, newPassword, confirmPassword },
		} = req.body;

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
						{ new: true, runValidators: true, fields: { salt: false, hashedPassword: false } }
					)
						.then(async user => {
							await updateCookieUserData(req, user);

							return res.json(user);
						})
						.catch(err => next({ code: err.errors ? 5 : 2, err }));
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
						if (!oldPassword || (oldPassword && !user.checkPassword(oldPassword)) || !validator.isLength(oldPassword.trim(), { min: 6 })) {
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
						.catch(err => next({ code: err.errors ? 5 : 2, err }));
				})
				.catch(err => next(err));
		} else {
			let { data: dataEdited } = req.body;

			if (req.file) {
				await sharp(req.file.path)
					.resize(300, 300)
					.jpeg({
						quality: 80,
					})
					.toFile(`${req.file.path}.jpg`)
					.then(() => {
						const rootFolder = process.env.NODE_ENV === 'production' ? 'build' : 'public';

						dataEdited.avatar = `${req.file.path.replace(rootFolder, '')}.jpg`;

						fs.unlink(req.file.path, err => {
							if (err) return next(err);
						});

						if (req.user.avatar && !!~req.user.avatar.search('upload')) {
							fs.unlink(rootFolder + req.user.avatar, err => {
								if (err) return next(err);
							});
						}
					});
			}

			dataEdited.modifiedAt = Date.now();

			return User.findByIdAndUpdate(req.user._id, dataEdited, {
				new: true,
				runValidators: true,
				fields: { salt: false, hashedPassword: false },
			})
				.then(async user => {
					await updateCookieUserData(req, user);

					return res.json(user);
				})
				.catch(err => next({ code: err.errors ? 5 : 2, err }));
		}
	}
);

accountRouter.post('/getMyAccountMember', isAuthedResolver, (req, res, next) => {
	const { userId, memberId } = req.body;

	Member.findOne({ _id: memberId, user: mongoose.Types.ObjectId(userId) })
		.then(studio => res.json(studio))
		.catch(err => next(err));
});

export default accountRouter;
