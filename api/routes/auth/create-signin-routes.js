/* A reusable set of routes for signing in with different providers. Handles token-based authentication.
 * Usage:
 *
 * const { main, callbacks } = createSigninRoutes('vk');
 * vkRouter.get('/', main);
 * vkRouter.get('/callback', ...callbacks);
 */
import passport from 'passport';

import { URL } from 'url';
import isBliksideUrl from 'api/utils/is-blikside-url';

const debug = require('debug')('shared:middlewares:logging');

const IS_PROD = process.env.NODE_ENV === 'production';
const FALLBACK_URL = IS_PROD ? 'https://blikside.com/' : 'http://localhost:3000/';

// Strategy: 'local' | 'vk'
export const createSigninRoutes = (strategy, strategyOptions) => {
	async function response(err, req, res, next) {
		let redirectUrl = req.session.redirectUrl ? new URL(req.session.redirectUrl) : new URL(FALLBACK_URL);

		if (err) return next(err);
		// redirectUrl.searchParams.append('authed', 'true');

		// Delete the redirectURL from the session again so we don't redirect
		// to the old URL the next time around
		req.session.redirectUrl = undefined;

		if (strategyOptions.jsonResponse) return res.json(redirectUrl.pathname + redirectUrl.search);

		res.redirect(redirectUrl.href);
	}

	return {
		// The main route takes care of storing the redirect URL in the session
		// and passing the right options
		main: (req, ...rest) => {
			let url = FALLBACK_URL;
			if (typeof req.query.r === 'string' && isBliksideUrl(req.query.r)) {
				url = req.query.r;
			}

			// Attach the redirectURL and authType to the session so we have it in the /auth/vk/callback route
			req.session.redirectUrl = url;

			return passport.authenticate(strategy, strategyOptions)(req, ...rest);
		},
		// The callbacks take care of authenticating, setting the response cookies,
		// redirecting to the right place and handling tokens
		callbacks: [
			passport.authenticate(strategy, {
				failureRedirect: IS_PROD ? '/' : 'http://localhost:3000/',
			}),
			(req, res, next) => response(null, req, res, next),
			(err, req, res, next) => response(err, req, res, next),
		],
	};
};
