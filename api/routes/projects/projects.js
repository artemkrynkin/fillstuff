import { Router } from 'express';
import i18n from 'i18n';

import { isAuthedResolver, hasPermissionsInProject } from 'api/utils/permissions';
import { updateCookieUserData } from 'api/utils/update-cookie-user-data';

import User from 'api/models/user';
import Project from 'api/models/project';

const projectsRouter = Router();

const debug = require('debug')('api:projects');

projectsRouter.get('/', isAuthedResolver, (req, res, next) => {
	Project.find({ 'members.user': req.user._id }, { 'members.invitationCode': false })
		.populate('members.user', 'profilePhoto name email')
		// TODO: убрать задежку, она нужно только для теста
		.then(projects => res.json(projects))
		.catch(err => next(err));
});

projectsRouter.post('/', isAuthedResolver, (req, res, next) => {
	const { name } = req.body;

	Project.find({ 'members.user': req.user._id })
		.then(projects => {
			if (projects.some(project => project.name === name))
				return next({
					code: 5,
					customErr: [
						{
							field: 'name',
							message: i18n.__('Проект с таким названием уже существует'),
						},
					],
				});

			let project = new Project({
				name: name,
				members: [
					{
						user: req.user._id,
						role: 'owner',
					},
				],
			});

			return project
				.save()
				.then(project => {
					return User.findByIdAndUpdate(
						req.user._id,
						{ activeProjectId: project },
						{ new: true, fields: { salt: false, hashedPassword: false, 'vkProvider.accessToken': false } }
					)
						.then(async user => {
							await updateCookieUserData(req, user);

							return project
								.populate('members.user', 'profilePhoto name email')
								.execPopulate()
								.then(() => res.json(project))
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

projectsRouter.put(
	'/:projectId',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInProject(req, res, next, ['project.control']),
	(req, res, next) => {
		Project.findByIdAndUpdate(req.params.projectId, { $set: req.body }, { runValidators: true })
			.then(() => res.json('success'))
			.catch(err =>
				next({
					code: err.errors ? 5 : 2,
					err,
				})
			);
	}
);

projectsRouter.delete(
	'/:projectId',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInProject(req, res, next, ['project.full_control']),
	async (req, res, next) => {
		await Project.findByIdAndDelete(req.params.projectId).catch(err => next(err));

		Project.find({ 'members.user': req.user._id })
			.then(async projects => {
				const nextProjectId = projects.length
					? projects.sort((projectA, projectB) => projectB.createdAt - projectA.createdAt)[0]._id
					: null;

				await User.findByIdAndUpdate(
					req.user._id,
					{ activeProjectId: nextProjectId },
					{ new: true, fields: { salt: false, hashedPassword: false, 'vkProvider.accessToken': false } }
				)
					.then(user => updateCookieUserData(req, user))
					.catch(err =>
						next({
							code: 2,
							err,
						})
					);

				return res.json(nextProjectId);
			})
			.catch(err => next(err));
	}
);

export default projectsRouter;
