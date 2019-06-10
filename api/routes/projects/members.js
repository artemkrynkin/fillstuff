import { Router } from 'express';
import validator from 'validator';
import { pbkdf2Sync, randomBytes } from 'crypto';
import i18n from 'i18n';

import { isAuthedResolver, hasPermissionsInProject } from 'api/utils/permissions';
import { updateCookieUserData } from 'api/utils/update-cookie-user-data';

import { createSigninRoutes } from 'api/routes/auth/create-signin-routes';

import Project from 'api/models/project';
import User from 'api/models/user';

const membersRouter = Router();
const { callbacks } = createSigninRoutes('local', {});

const debug = require('debug')('api:projects-members');

const IS_PROD = process.env.NODE_ENV === 'production';

membersRouter.post(
	'/:projectId/members',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInProject(req, res, next, ['project.control']),
	(req, res, next) => {
		const { invitationEmail, role } = req.body;
		const invitationEmailFormError = existingUserError => ({
			code: 5,
			customErr: [
				{
					field: 'invitationEmail',
					message: existingUserError
						? i18n.__('Участник с таким email уже приглашен в проект')
						: validator.isEmail(invitationEmail)
						? 'Некорректный Email'
						: i18n.__('Обязательное поле'),
				},
			],
		});

		if (!invitationEmail) return next(invitationEmailFormError());

		User.findOne({ email: invitationEmail })
			.then(async existingUser => {
				let conditions = { _id: req.params.projectId };

				conditions[`members.${existingUser ? 'user' : 'invitationEmail'}`] = existingUser ? existingUser._id : invitationEmail;

				return Project.findOne(conditions).then(existingUserInProject => {
					if (existingUserInProject) return next(invitationEmailFormError(true));

					const newMember = {
						role,
						invitationEmail,
						invitationCode: pbkdf2Sync(invitationEmail, randomBytes(256).toString('hex'), 10000, 15, 'sha1').toString('hex'),
						isWaiting: true,
					};

					return Project.findByIdAndUpdate(
						req.params.projectId,
						{ $push: { members: newMember } },
						{ new: true, runValidators: true, fields: { 'members.invitationCode': false } }
					)
						.populate('members.user', 'profilePhoto name email')
						.then(project => res.json(project.members))
						.catch(err =>
							next({
								code: err.errors ? 5 : 2,
								err,
							})
						);
				});
			})
			.catch(err => next(err));
	}
);

membersRouter.put(
	'/:projectId/members/:memberId',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInProject(req, res, next, ['project.control']),
	(req, res, next) => {
		const { role } = req.body;

		if (role === 'owner') return next({ code: 4 });

		Project.findById(req.params.projectId)
			.then(project => {
				const memberIndex = project.members.findIndex(member => String(member._id) === req.params.memberId);

				if (project.members[memberIndex].role === 'owner') return next({ code: 4 });

				project.members[memberIndex].role = role;

				return Project.findByIdAndUpdate(project._id, { $set: { members: project.members } }, { runValidators: true })
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
	'/:projectId/members/:memberId',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInProject(req, res, next, ['project.control'], req.user._id !== req.params.memberId),
	(req, res, next) => {
		Project.findById(req.params.projectId)
			.then(project => {
				const memberIndex = project.members.findIndex(member => String(member._id) === req.params.memberId);

				if (project.members[memberIndex].role === 'owner') return next({ code: 4 });

				return Project.findByIdAndUpdate(req.params.projectId, { $pull: { members: { _id: req.params.memberId } } })
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

membersRouter.get(
	'/member-invitation',
	(req, res, next) => {
		const { ic: invitationCode } = req.query;
		const redirectUrl = req.user
			? IS_PROD
				? '/projects'
				: 'http://localhost:3000/projects'
			: IS_PROD
			? '/'
			: 'http://localhost:3000/';

		if (!invitationCode) return res.redirect(redirectUrl);

		Project.findOne({ 'members.invitationCode': invitationCode })
			.then(project => {
				if (!project) return res.redirect(redirectUrl);

				const memberIndex = project.members.findIndex(member => member.invitationCode === invitationCode);

				return User.findOne({ email: project.members[memberIndex].invitationEmail })
					.then(async existingUser => {
						let user = new User({
							email: project.members[memberIndex].invitationEmail,
							activeProjectId: project._id,
							password: invitationCode,
							invitationCode: invitationCode,
						});

						if (!existingUser) await user.save().catch(err => next(err));

						project.members[memberIndex] = {
							user: existingUser ? existingUser._id : user._id,
							role: project.members[memberIndex].role,
						};

						await Project.findByIdAndUpdate(project._id, { $set: { members: project.members } }).catch(err => next(err));

						return User.findByIdAndUpdate(
							existingUser ? existingUser._id : user._id,
							{ $set: { activeProjectId: project._id } },
							{ new: true, fields: { salt: false, hashedPassword: false, 'vkProvider.accessToken': false } }
						)
							.then(async user => {
								if (req.user) {
									await updateCookieUserData(req, user);

									return res.redirect(redirectUrl);
								}

								req.body = {
									email: existingUser ? existingUser.email : user.email,
									password: invitationCode,
								};

								next();
							})
							.catch(err => next(err));
					})
					.catch(err => next(err));
			})
			.catch(err => next(err));
	},
	...callbacks
);

export default membersRouter;
