// import session from 'cookie-session';
import expressSession from 'express-session';
import connectMongo from 'connect-mongo';

import DBConnection from 'shared/db';

const MongoStore = connectMongo(expressSession);

const ONE_WEEK = 604800000;

// Create session middleware
// export default session({
// 	keys: cookieKeygrip,
// 	name: 'session',
// 	// TODO: расскоментировать это и проверить после переноса на прод
// 	// secure: process.env.NODE_ENV === 'production',
// 	// This is refresh everytime a user does a request
// 	// @see api/routes/middleware/index.js
// 	maxAge: ONE_WEEK,
// 	signed: true,
// 	sameSite: 'lax',
// });

export const sessionStore = new MongoStore({ mongooseConnection: DBConnection });

export const session = expressSession({
	secret: 'secrettest',
	name: 'session',
	sameSite: 'lax',
	cookie: {
		// TODO: расскоментировать это и проверить после переноса на прод
		// secure: process.env.NODE_ENV === 'production',
		maxAge: ONE_WEEK,
	},
	store: sessionStore,
	unset: 'destroy',
	saveUninitialized: false,
	resave: true,
});
