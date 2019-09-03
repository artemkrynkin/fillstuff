const debug = require('debug')('api');
debug('Server starting...');
debug('logging with debug enabled!');

import express from 'express';
import compression from 'compression';

import connectDB from 'shared/db';
import csrf from 'shared/middlewares/csrf';
import errorHandler from 'shared/middlewares/error-handler';
import i18n from 'shared/middlewares/i18n';
import addSecurityMiddleware from 'shared/middlewares/security';
import toobusy from 'shared/middlewares/toobusy';

import { init as initPassport } from './authentication';
import router from './routes';
import middlewares from './routes/middlewares';
import './cron';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

initPassport();

const app = express();

// Trust the now proxy
app.set('trust proxy', true);
app.use(toobusy);

// Security middleware
addSecurityMiddleware(app, { enableNonce: false, enableCSP: false });
if (process.env.NODE_ENV === 'production') {
	app.use(csrf);
}

// All other middlewares
app.use(compression());
app.use(middlewares);

// Locale init
app.use(i18n.init);

// Routes
router(app);

// Redirect a request to the root path to the main app
app.use('/', (req, res) => {
	res.redirect(process.env.NODE_ENV === 'production' ? 'https://blikside.com' : 'http://localhost:3000');
});

app.use(errorHandler);

connectDB.once('open', () => {
	app.listen(PORT, err => {
		if (err) return debug('Oops, something went wrong!', err);

		debug(`API running at http://localhost:${PORT}/api`);
	});
});
