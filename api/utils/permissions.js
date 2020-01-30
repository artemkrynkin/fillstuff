import { checkPermissions } from 'shared/roles-access-rights';

import Member from 'api/models/member';

export const isAuthedResolver = (req, res, next) => {
	if (!req.user) return next({ code: 3 });

	next();
};

export const hasPermissionsInStudio = async (req, res, next, accessRightList, skipCheck = false) => {
	if (!skipCheck) {
		const memberId = req.params.memberId || req.body.memberId || req.query.memberId;

		if (!memberId)
			return next({
				code: 6,
				message: 'missing "memberId" parameter',
			});

		await Member.findById(memberId)
			.then(member => {
				if (!checkPermissions(member.role, accessRightList)) return next({ code: 4 });
			})
			.catch(err => next({ code: 2, err }));
	}

	next();
};
