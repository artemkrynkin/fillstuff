/* A reusable set of routes for signing in with different providers. Handles token-based authentication.
 * Usage:
 *
 * const { main, callbacks } = createSigninRoutes('vk');
 * vkRouter.get('/', main);
 * vkRouter.get('/callback', ...callbacks);
 */
import passport from 'passport';

import { URL } from 'url';
import isPosterdateUrl from '../../utils/is-posterdate-url';

const debug = require('debug')('shared:middlewares:logging');

const IS_PROD = process.env.NODE_ENV === 'production';
const FALLBACK_URL = IS_PROD ? 'https://dev.posterdate.com/projects' : 'http://localhost:3000/projects';

// Strategy: 'local' | 'vk'
export const createSigninRoutes = (strategy, strategyOptions) => {
	function response(err, req, res) {
		let redirectUrl = req.session.redirectUrl ? new URL(req.session.redirectUrl) : new URL(FALLBACK_URL);

		if (req.session.connectSocialPages) {
			if (!err) {
				redirectUrl = new URL(`${FALLBACK_URL}/${req.session.connectSocialPages.projectId}/social-pages`);

				redirectUrl.searchParams.append('from', req.session.connectSocialPages.provider);
			} else {
				redirectUrl = new URL(`${FALLBACK_URL}/${req.session.connectSocialPages.projectId}/settings`);
			}

			req.session.connectSocialPages = undefined;
		}

		/**
		 * display - toast | popup | page
		 * type - success | error
		 */
		if (err || (req.authInfo && req.authInfo.msgDisplay && req.authInfo.msgText)) {
			let display = req.authInfo && req.authInfo.msgDisplay ? req.authInfo.msgDisplay : 'toast';
			let message = req.authInfo && req.authInfo.msgText ? req.authInfo.msgText : err.message;

			redirectUrl.searchParams.append('msgType', 'error');
			redirectUrl.searchParams.append('msgDisplay', display);
			redirectUrl.searchParams.append('msgText', message);
		}
		// redirectUrl.searchParams.append('authed', 'true');

		// Delete the redirectURL from the session again so we don't redirect
		// to the old URL the next time around
		req.session.redirectUrl = undefined;

		if (!err) {
			res.cookie('_now_no_cache', '1', {
				maxAge: 315569260000, // 10 years
				sameSite: 'lax',
				secure: false,
			});
		}

		if (strategyOptions.jsonResponse) return res.json(redirectUrl.pathname + redirectUrl.search);

		res.redirect(redirectUrl.href);
	}

	return {
		// The main route takes care of storing the redirect URL in the session
		// and passing the right options
		main: (req, ...rest) => {
			let url = FALLBACK_URL;
			if (typeof req.query.r === 'string' && isPosterdateUrl(req.query.r)) {
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
			(req, res) => response(null, req, res),
			(err, req, res, next) => response(err, req, res),
		],
	};
};
