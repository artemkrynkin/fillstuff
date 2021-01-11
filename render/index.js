const debug = require('debug')('render');
debug('Render starting...');
debug('logging with debug enabled!');

import express from 'express';

import path from 'path';
import toobusy from 'shared/middlewares/toobusy';
import i18n from 'shared/middlewares/i18n';
import addSecurityMiddleware from 'shared/middlewares/security';

import { JSDOM } from 'jsdom';

import User from 'api/models/user';

const PORT = process.env.PORT || 3006;
const ONE_HOUR = 3600;

const app = express();

// Trust the now proxy
app.set('trust proxy', true);
app.use(toobusy);

// Security middleware.
addSecurityMiddleware(app, { enableNonce: true, enableCSP: process.env.NODE_ENV === 'production' });

// Locale init
app.use(i18n.init);

// Serve static files from the build folder
app.use(
	express.static(process.env.NODE_ENV === 'production' ? './build' : path.join(__dirname, '../build/'), {
		index: false,
		setHeaders: (res, path) => {
			// Don't cache the serviceworker in the browser
			if (path.indexOf('sw.js') > -1) {
				res.setHeader('Cache-Control', 'no-store, no-cache');
				return;
			}

			if (path.endsWith('.js')) {
				// Cache static files in now CDN for seven days
				// (the filename changes if the file content changes, so we can cache these forever)
				res.setHeader('Cache-Control', `s-maxage=${ONE_HOUR}`);
			}
		},
	})
);

// In dev the static files from the root public folder aren't moved to the build folder by create-react-app
// so we just tell Express to serve those too
if (process.env.NODE_ENV === 'development') {
	app.use(express.static(path.resolve(__dirname, '..', 'public'), { index: false }));
}

import bodyParser from 'body-parser';
app.use(bodyParser.json());

// Cross origin request support
import cors from 'shared/middlewares/cors';
app.use(cors);

// Redirect requests to /api and /auth to the production API
// This allows deploy previews to work, as this route would only be called
// if there's no path alias in Now for hyperionurl.com/api, which would only
// happen on deploy previews
app.use('/api', (req, res) => {
	const redirectUrl = `${req.baseUrl}${req.path}`;
	res.redirect(
		req.method === 'POST' || req.xhr ? 307 : 301,
		process.env.NODE_ENV === 'production' ? `https://fillstuff.keeberink.com${redirectUrl}` : `http://localhost:3001${redirectUrl}`
	);
});

app.use('/auth', (req, res) => {
	const redirectUrl = `${req.baseUrl}${req.path}`;
	res.redirect(
		req.method === 'POST' || req.xhr ? 307 : 301,
		process.env.NODE_ENV === 'production' ? `https://fillstuff.keeberink.com${redirectUrl}` : `http://localhost:3001${redirectUrl}`
	);
});

// In development the Webpack HMR server requests /sockjs-node constantly,
// so let's patch that through to it!
if (process.env.NODE_ENV === 'development') {
	app.use('/sockjs-node', (req, res) => {
		res.redirect(301, `http://localhost:3000${req.path}`);
	});
}

import cookieParser from 'cookie-parser';
app.use(cookieParser());

import session from 'shared/middlewares/session';
app.use(session);

import passport from 'passport';
// Setup use serialization
passport.serializeUser((user, done) => {
	done(null, user._id);
});

// NOTE(@mxstbr): `data` used to be just the userID, but is now the full user data
// to avoid having to go to the db on every single request. We have to handle both
// cases here, as more and more users use Spectrum again we go to the db less and less
passport.deserializeUser((userId, done) => {
	// // Fast path: try to JSON.parse the data if it works, we got the user data, yay!
	// try {
	//   const user = JSON.parse(data);
	//   // Make sure more than the user ID is in the data by checking any other required
	//   // field for existance
	//   if (user.id && user.createdAt) {
	//     return done(null, user);
	//   }
	//   // Ignore JSON parsing errors
	// } catch (err) {}

	// Slow path: data is just the userID (legacy), so we have to go to the db to get the full data
	return User.findById(userId, { salt: false, hashedPassword: false })
		.then(user => done(null, user))
		.catch(err => done(err));
});
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res, next) => {
	return JSDOM.fromFile(path.resolve(__dirname, '../build/index.html'), {}).then(dom => {
		res.send(dom.serialize());
	});
});

app.listen(PORT);
debug(`Render, the server-side renderer, running at http://localhost:${PORT}`);
