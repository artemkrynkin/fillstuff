import { checkPermissions, findMemberInProject } from 'shared/roles-access-rights';

import Project from 'api/models/project';

export const isAuthedResolver = (req, res, next) => {
	if (!req.user) {
		return next({ code: 3 });
	}

	next();
};

export const hasPermissionsInProject = async (req, res, next, accessRightList, skipCheck) => {
	if (!skipCheck) {
		await Project.findOne({ _id: req.params.projectId, 'members.user': req.user._id })
			.then(project => {
				const currentUserRole = findMemberInProject(req.user._id, project).role;

				if (!checkPermissions(currentUserRole, accessRightList)) next({ code: 4 });
			})
			.catch(err =>
				next({
					code: 2,
					err,
				})
			);
	}

	next();
};
