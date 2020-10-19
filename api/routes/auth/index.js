import { Router } from 'express';
import { URL } from 'url';

import { config } from 'shared/auth0/api';

import { auth0client } from 'api/utils/auth';
import localAuthRoutes from './local';
import logoutRoutes from './logout';

const IS_PROD = process.env.NODE_ENV === 'production';
const FALLBACK_URL = IS_PROD ? 'https://blikside.com' : 'http://localhost:3000';

const authRouter = Router();

authRouter.use('/local', localAuthRoutes);
authRouter.use('/logout', logoutRoutes);
authRouter.get('/login/callback', async (req, res) => {
	const { code } = req.query;

	let redirectUrl = new URL(FALLBACK_URL);

	await auth0client.oauth
		.authorizationCodeGrant({
			code,
			redirect_uri: config.redirectUri,
		})
		.then(({ access_token, id_token, scope, expires_in, token_type }) => {
			console.log(expires_in);
			res.cookie('session.token', access_token, {
				maxAge: expires_in * 1000,
				httpOnly: true,
				domain: IS_PROD ? '.blikside.com' : '',
				secure: IS_PROD,
			});
		})
		.catch(err => {
			const error = JSON.parse(err.message);

			res.clearCookie('session.token');

			redirectUrl = new URL(`${FALLBACK_URL}/login`);

			redirectUrl.searchParams.append('snackbarMessage', error.error_description);
			redirectUrl.searchParams.append('snackbarType', 'error');
		});

	return res.redirect(redirectUrl.href);
});

export default authRouter;
