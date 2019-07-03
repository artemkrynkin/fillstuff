import { Router } from 'express';
import validator from 'validator';
import { randomFillSync, randomBytes } from 'crypto';
import i18n from 'i18n';

import { isAuthedResolver, hasPermissionsInStock } from 'api/utils/permissions';
import { updateCookieUserData } from 'api/utils/update-cookie-user-data';

import { createSigninRoutes } from 'api/routes/auth/create-signin-routes';

import Stock from 'api/models/stock';
import User from 'api/models/user';

const membersRouter = Router();
const { callbacks } = createSigninRoutes('local', {});

const debug = require('debug')('api:stocks-members');

const IS_PROD = process.env.NODE_ENV === 'production';

membersRouter.get(
	'/:stockId/member-invitation',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['stock.control']),
	(req, res, next) => {
		// const { invitationEmail, invitationName, role } = req.body;
		// const invitationEmailFormError = existingUserError => ({
		// 	code: 5,
		// 	customErr: [
		// 		{
		// 			field: 'invitationEmail',
		// 			message: existingUserError
		// 				? i18n.__('Участник с таким email уже приглашен в склад')
		// 				: validator.isEmail(invitationEmail)
		// 				? 'Некорректный Email'
		// 				: i18n.__('Обязательное поле'),
		// 		},
		// 	],
		// });
		//
		// if (!invitationEmail) return next(invitationEmailFormError());
		//
		// User.findOne({ email: invitationEmail })
		// 	.then(async existingUser => {
		// 		let conditions = { _id: req.params.stockId };
		//
		// 		conditions[`members.${existingUser ? 'user' : 'invitationEmail'}`] = existingUser ? existingUser._id : invitationEmail;
		//
		// 		return Stock.findOne(conditions).then(existingUserInStock => {
		// 			if (existingUserInStock) return next(invitationEmailFormError(true));
		//
		// 			const newMember = {
		// 				role,
		// 				invitationEmail,
		// 				invitationName,
		// 				invitationCode: pbkdf2Sync(invitationEmail, randomBytes(256).toString('hex'), 10000, 15, 'sha1').toString('hex'),
		// 				isWaiting: true,
		// 			};
		//
		// 			return Stock.findByIdAndUpdate(
		// 				req.params.stockId,
		// 				{ $push: { members: newMember } },
		// 				{ new: true, runValidators: true }
		// 			)
		// 				.populate('members.user', 'profilePhoto name email')
		// 				.then(stock => res.json(stock.members))
		// 				.catch(err =>
		// 					next({
		// 						code: err.errors ? 5 : 2,
		// 						err,
		// 					})
		// 				);
		// 		});
		// 	})
		// 	.catch(err => next(err));
		return Stock.findById(req.params.stockId)
			.then(stock => {
				const newMemberIndex = stock.members.push({
					isWaiting: true,
				});

				return stock
					.save()
					.then(() => {
						return setTimeout(() => res.json(stock.members[newMemberIndex - 1]), 500);
					})
					.catch(err =>
						next({
							code: err.errors ? 5 : 2,
							err,
						})
					);
			})
			.catch(err => next(err));
	}
);

membersRouter.put(
	'/:stockId/members/:memberId',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['stock.control']),
	(req, res, next) => {
		const { name, email, role } = req.body;

		if (role === 'owner') return next({ code: 4 });

		Stock.findById(req.params.stockId)
			.then(stock => {
				const member = stock.members.id(req.params.memberId);

				if (member.role === 'owner') return next({ code: 4 });

				member.name = name;
				member.email = email;
				member.role = role;

				return Stock.save()
					.then(() => res.json('success'))
					.catch(err =>
						next({
							code: err.errors ? 5 : 2,
							err,
						})
					);
			})
			.catch(err => next(err));
	}
);

membersRouter.delete(
	'/:stockId/members/:memberId',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['stock.control'], req.user._id !== req.params.memberId),
	(req, res, next) => {
		Stock.findById(req.params.stockId)
			.then(stock => {
				const memberIndex = stock.members.findIndex(member => String(member._id) === req.params.memberId);

				if (stock.members[memberIndex].role === 'owner') return next({ code: 4 });

				return Stock.findByIdAndUpdate(req.params.stockId, { $pull: { members: { _id: req.params.memberId } } })
					.then(() => res.json('success'))
					.catch(err =>
						next({
							code: 2,
							err,
						})
					);
			})
			.catch(err => next(err));
	}
);

// membersRouter.get(
// 	'/member-invitation',
// 	(req, res, next) => {
// 		const { ic: invitationCode } = req.query;
// 		const redirectUrl = req.user
// 			? IS_PROD
// 				? '/stocks'
// 				: 'http://localhost:3000/stocks'
// 			: IS_PROD
// 			? '/'
// 			: 'http://localhost:3000/';
//
// 		if (!invitationCode) return res.redirect(redirectUrl);
//
// 		Stock.findOne({ 'members.invitationCode': invitationCode })
// 			.then(stock => {
// 				if (!stock) return res.redirect(redirectUrl);
//
// 				const memberIndex = stock.members.findIndex(member => member.invitationCode === invitationCode);
//
// 				return User.findOne({ email: stock.members[memberIndex].invitationEmail })
// 					.then(async existingUser => {
// 						let user = new User({
// 							email: stock.members[memberIndex].invitationEmail,
// 							activeStockId: stock._id,
// 							password: invitationCode,
// 							invitationCode: invitationCode,
// 						});
//
// 						if (!existingUser) await user.save().catch(err => next(err));
//
// 						stock.members[memberIndex] = {
// 							user: existingUser ? existingUser._id : user._id,
// 							role: stock.members[memberIndex].role,
// 						};
//
// 						await Stock.findByIdAndUpdate(stock._id, { $set: { members: stock.members } }).catch(err => next(err));
//
// 						return User.findByIdAndUpdate(
// 							existingUser ? existingUser._id : user._id,
// 							{ $set: { activeStockId: stock._id } },
// 							{ new: true, fields: { salt: false, hashedPassword: false } }
// 						)
// 							.then(async user => {
// 								if (req.user) {
// 									await updateCookieUserData(req, user);
//
// 									return res.redirect(redirectUrl);
// 								}
//
// 								req.body = {
// 									email: existingUser ? existingUser.email : user.email,
// 									password: invitationCode,
// 								};
//
// 								next();
// 							})
// 							.catch(err => next(err));
// 					})
// 					.catch(err => next(err));
// 			})
// 			.catch(err => next(err));
// 	},
// 	...callbacks
// );

membersRouter.get('/mobile/member-invitation', (req, res, next) => {
	const { memberId } = req.query;

	Stock.findOne({ 'members._id': memberId })
		.then(async stock => {
			let member = stock.member.id(memberId);

			let user = new User({
				activeStockId: stock._id,
			});

			await user.save().catch(err => next(err));

			member.user = user._id;
			delete member.isWaiting;

			await Stock.save().catch(err => next(err));

			return User.findByIdAndUpdate(
				user._id,
				{ $set: { activeStockId: stock._id } },
				{ new: true, fields: { salt: false, hashedPassword: false } }
			)
				.then(async user => {
					return res.json({
						userId: user._id,
						stockId: stock._id,
						role: member.role,
					});
				})
				.catch(err => next(err));
		})
		.catch(err => next(err));
});

export default membersRouter;
