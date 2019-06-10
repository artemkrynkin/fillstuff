import { Router } from 'express';
import { createSigninRoutes } from './create-signin-routes';

const localAuthRouter = Router();
const { callbacks } = createSigninRoutes('local', {
	jsonResponse: true,
});

import i18n from 'i18n';

localAuthRouter.post(
	'/',
	(req, res, next) => {
		const { email, password } = req.body;

		if (!email || !password) {
			return next({
				code: 5,
				customErr: [
					{
						field: 'unknown',
						message: i18n.__('Email or password is incorrect'),
					},
				],
			});
		}

		next();
	},
	...callbacks
);

export default localAuthRouter;
