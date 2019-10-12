import { Router } from 'express';
import i18n from 'i18n';

import { checkPermissions, findMemberInStock } from 'shared/roles-access-rights';

import { isAuthedResolver, hasPermissionsInStock } from 'api/utils/permissions';

import Stock from 'api/models/stock';
import User from 'api/models/user';

const membersRouter = Router();

const debug = require('debug')('api:stocks-members');

membersRouter.get(
	'/:stockId/member-invitation',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['stock.control']),
	(req, res, next) => {
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
	async (req, res, next) => {
		const {
			role,
			user: { _id: userId, name, email },
		} = req.body;

		await Stock.findById(req.params.stockId)
			.then(async stock => {
				const currentUserRole = findMemberInStock(req.user._id, stock).role;
				const member = stock.members.id(req.params.memberId);

				if ((member.role === 'owner' || role === 'owner') && !Boolean(checkPermissions(currentUserRole, ['stock.full_control']))) {
					return next({ code: 4 });
				}

				member.role = role;

				await stock.save().catch(err => next({ code: err.errors ? 5 : 2, err }));
			})
			.catch(err => next(err));

		await User.findById(userId)
			.then(async user => {
				if (user && String(user._id) !== String(userId)) {
					return next({
						code: 5,
						customErr: [
							{
								field: 'user.email',
								message: i18n.__('A person with this E-mail already registered'),
							},
						],
					});
				}

				user.name = name;
				user.email = email;
				user.modifiedAt = Date.now();

				await user
					.save()
					.then(() => res.json('success'))
					.catch(err => next({ code: err.errors ? 5 : 2, err }));
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
				const member = stock.members.id(req.params.memberId);

				if (member.role === 'owner') return next({ code: 4 });

				return Stock.findByIdAndUpdate(req.params.stockId, { $pull: { members: { _id: req.params.memberId } } })
					.then(() => res.json('success'))
					.catch(err => next({ code: 2, err }));
			})
			.catch(err => next(err));
	}
);

membersRouter.get('/member-invitation-qr', (req, res, next) => {
	const { memberId } = req.query;

	Stock.findOne({ 'members._id': memberId })
		.then(async stock => {
			let member = stock.members.id(memberId);

			if (!member.isWaiting) return next({ code: 1 });

			let user = new User({
				activeStockId: stock._id,
			});

			await user.save().catch(err => next(err));

			member.user = user._id;
			member.isWaiting = undefined;

			await stock.save().catch(err => next(err));

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
