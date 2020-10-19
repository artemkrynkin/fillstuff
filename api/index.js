const debug = require('debug')('api');
debug('Server starting...');
debug('logging with debug enabled!');

import express from 'express';
import compression from 'compression';
import http from 'http';
import socketIo from 'socket.io';

import DBConnection from 'shared/db';
import csrf from 'shared/middlewares/csrf';
import errorHandler from 'shared/middlewares/error-handler';
import i18n from 'shared/middlewares/i18n';
import addSecurityMiddleware from 'shared/middlewares/security';
import toobusy from 'shared/middlewares/toobusy';

import router from './routes';
import socket from './socket';
import middlewares from './routes/middlewares';
import { isAuthedResolverSocket } from 'api/utils/permissions';
import './cron';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
	path: '/websocket',
	cookie: 'websocket:session',
	pingTimeout: 30000,
});

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
app.set('io', io);
io.use(isAuthedResolverSocket);

socket(io);
router(app);

// Redirect a request to the root path to the main app
app.use('/', (req, res) => {
	res.redirect(process.env.NODE_ENV === 'production' ? 'https://blikside.com' : 'http://localhost:3000');
});

app.use(errorHandler);

DBConnection.once('open', () => {
	server.listen(PORT, err => {
		if (err) return debug('Oops, something went wrong!', err);

		debug(`API running at http://localhost:${PORT}/api`);
	});
});
