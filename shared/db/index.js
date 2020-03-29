import fs from 'fs';
import bluebird from 'bluebird';
import mongoose from 'mongoose';

import logger from 'shared/logger';

const debug = require('debug')('shared:mongodb');

/**
 * Настройка базы данных выполняется здесь
 */
const IS_PROD = process.env.NODE_ENV === 'production';

const uri_dev = 'mongodb://localhost:27017/bliksidetest';
const uri_prod = 'mongodb://artem:741310PTppl#@rc1c-r70mh0q5hyyvlo3i.mdb.yandexcloud.net:27018/blikside-alpha';

mongoose.Promise = bluebird;

const options = {
	useNewUrlParser: true,
	useFindAndModify: false,
	useCreateIndex: true,
	useUnifiedTopology: true,
	autoIndex: !IS_PROD,
};

if (IS_PROD) {
	options.ssl = true;
	options.sslCA = fs.readFileSync('/usr/local/share/ca-certificates/Yandex/YandexInternalRootCA.crt');
	options.replicaSet = 'rs01';
}

const DBConnection = mongoose.connection;

DBConnection.once('connecting', () => {
	debug('Connecting to MongoDB...');
	logger.warn('Connecting to MongoDB...');
})
	.on('error', error => {
		console.error('Error in MongoDB connection: ' + error);
		logger.warn('Error in MongoDB connection: ' + error);
		mongoose.disconnect();
	})
	.once('connected', () => {
		debug('Connected MongoDB');
		logger.warn('Connected MongoDB');
	})
	.on('reconnected', () => {
		debug('Reconnected MongoDB');
		logger.warn('Reconnected MongoDB');
	})
	.on('disconnected', () => {
		debug('Disconnected MongoDB');
		logger.warn('Disconnected MongoDB');
		mongoose.connect(IS_PROD ? uri_prod : uri_dev, options);
	});

mongoose.connect(IS_PROD ? uri_prod : uri_dev, options);

export default DBConnection;
