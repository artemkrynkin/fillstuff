import { Router } from 'express';

import { isAuthedResolver, hasPermissionsInProject } from 'api/utils/permissions';

import Project from 'api/models/project';

const topicsRouter = Router();

const debug = require('debug')('api:projects');

topicsRouter.post(
	'/:projectId/topics',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInProject(req, res, next, ['events.control']),
	(req, res, next) => {
		Project.findByIdAndUpdate(req.params.projectId, { $push: { topics: req.body } }, { new: true, runValidators: true })
			.then(project => res.json(project.topics))
			.catch(err =>
				next({
					code: err.errors ? 5 : 2,
					err,
				})
			);
	}
);

topicsRouter.put(
	'/:projectId/topics/:topicId',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInProject(req, res, next, ['events.control']),
	(req, res, next) => {
		const { name, color } = req.body;

		Project.findById(req.params.projectId)
			.then(project => {
				const topicIndex = project.topics.findIndex(topic => String(topic._id) === req.params.topicId);

				project.topics[topicIndex].name = name;
				project.topics[topicIndex].color = color;

				return Project.findByIdAndUpdate(req.params.projectId, { $set: { topics: project.topics } }, { runValidators: true })
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

topicsRouter.delete(
	'/:projectId/topics/:topicId',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInProject(req, res, next, ['events.control']),
	(req, res, next) => {
		Project.findByIdAndUpdate(req.params.projectId, { $pull: { topics: { _id: req.params.topicId } } })
			.then(() => res.json('success'))
			.catch(err =>
				next({
					code: 2,
					err,
				})
			);
	}
);

export default topicsRouter;
