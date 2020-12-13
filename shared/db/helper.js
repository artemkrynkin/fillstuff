import fs from 'fs';
import mongoose from 'mongoose';
import bluebird from 'bluebird';

import logger from 'shared/logger';

const debug = require('debug')('shared:mongodb');

const IS_PROD = process.env.NODE_ENV === 'production';

mongoose.Promise = bluebird;

const options = {
	useNewUrlParser: true,
	useFindAndModify: false,
	useCreateIndex: true,
	useUnifiedTopology: true,
	autoIndex: !IS_PROD,
	keepAlive: true,
};

let ca;

try {
	ca = fs.readFileSync('/usr/local/share/ca-certificates/Yandex/YandexInternalRootCA.crt');
} catch (err) {}

if (!ca && IS_PROD) {
	throw new Error(
		'Please provide the SSL certificate to connect to the production database in a file called `YandexInternalRootCA.crt` in the `usr/local/share/ca-certificates/Yandex` directory.'
	);
}

if (IS_PROD) {
	options.ssl = true;
	options.sslCA = ca;
	options.replicaSet = 'rs01';
}

const instanceEventListeners = ({ dbName, connection }) => {
	connection.on('connected', () => {
		debug(`Database ${dbName} - Connection status: connected`);
		logger.warn(`Database ${dbName} - Connection status: connected`);
	});
	connection.on('disconnected', () => {
		debug(`Database ${dbName} - Connection status: disconnected`);
		logger.warn(`Database ${dbName} - Connection status: disconnected`);
	});
	connection.on('reconnected', () => {
		debug(`Database ${dbName} - Connection status: reconnected`);
		logger.warn(`Database ${dbName} - Connection status: reconnected`);
	});
	connection.on('close', () => {
		debug(`Database ${dbName} - Connection status: close`);
		logger.warn(`Database ${dbName} - Connection status: close`);
	});
	connection.on('error', err => {
		debug(`Database ${dbName} - Connection status: error`);
		logger.error(`Database ${dbName} - Connection status: error`, err);
	});
};

export const initDatabase = ({ dbUri, dbName }) => {
	const mongoInstance = mongoose.createConnection(`${dbUri}/${dbName}`, options);

	instanceEventListeners({ dbName, connection: mongoInstance });

	return mongoInstance;
};
