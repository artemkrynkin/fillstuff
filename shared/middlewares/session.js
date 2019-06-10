import session from 'cookie-session';

import { cookieKeygrip } from '../cookie-utils';

const ONE_WEEK = 604800000;

// Create session middleware
export default session({
	keys: cookieKeygrip,
	name: 'session',
	// TODO: расскоментировать это и проверить после переноса на https://zeit.co/now
	// secure: process.env.NODE_ENV === 'production',
	// This is refresh everytime a user does a request
	// @see api/routes/middleware/index.js
	maxAge: ONE_WEEK,
	signed: true,
	sameSite: 'lax',
});
