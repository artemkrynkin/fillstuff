import { findMemberInStock, checkPermissions } from 'shared/roles-access-rights';

import Stock from 'api/models/stock';

export const isAuthedResolver = (req, res, next) => {
	if (!req.user) {
		return next({ code: 3 });
	}

	next();
};

export const hasPermissionsInStock = async (req, res, next, accessRightList, skipCheck) => {
	if (!skipCheck) {
		const stockId = req.query.stockId || req.params.stockId || req.body.stockId;

		if (!stockId)
			return next({
				code: 6,
				message: 'missing "stockId" parameter',
			});

		await Stock.findOne({ _id: stockId, 'members.user': req.user._id })
			.then(stock => {
				const currentUserRole = findMemberInStock(req.user._id, stock).role;

				if (!checkPermissions(currentUserRole, accessRightList)) return next({ code: 4 });
			})
			.catch(err => next({ code: 2, err }));
	}

	next();
};
