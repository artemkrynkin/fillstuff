import { Router } from 'express';

import { isAuthed, hasPermissions } from 'api/utils/permissions';

import Shop from 'api/models/shop';

const router = Router();

// const debug = require('debug')('api:studio');

router.post(
	'/getShops',
	isAuthed,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	(req, res, next) => {
		const { studioId } = req.body;

		Shop.find({ studio: studioId })
			.sort({ name: 1 })
			.then(shops => res.json(shops))
			.catch(err => next(err));
	}
);

router.post(
	'/createShop',
	isAuthed,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	(req, res, next) => {
		const {
			studioId,
			data: { shop: newShop },
		} = req.body;

		const shop = new Shop({
			studio: studioId,
			...newShop,
		});

		return shop
			.save()
			.then(shop => res.json(shop))
			.catch(err => next({ code: err.errors ? 5 : 2, err }));
	}
);

export default router;
