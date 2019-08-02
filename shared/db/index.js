import bluebird from 'bluebird';
import mongoose from 'mongoose';

import logger from 'shared/logger';

const debug = require('debug')('shared:mongodb');

/**
 * Настройка базы данных выполняется здесь
 */
const IS_PROD = process.env.NODE_ENV === 'production';

const uri_dev = 'mongodb://localhost:27017/bliksidetest';
const uri_prod = 'mongodb://localhost:27017/blikside';
//mongodb://user1:741310PTppl#@rc1c-x6d91n4izpase64t.mdb.yandexcloud.net:27018/db1

mongoose.Promise = bluebird;

const options = {
	useNewUrlParser: true,
	useCreateIndex: true,
	autoIndex: !IS_PROD,
	useFindAndModify: false,
	// ssl: true,
	// sslCA: fs.readFileSync('/usr/local/share/ca-certificates/Yandex/YandexInternalRootCA.crt'),
	// replicaSet: 'rs01'
};

mongoose.connect(IS_PROD ? uri_prod : uri_dev, options);

const connectDB = mongoose.connection;

connectDB
	.on('error', console.info)
	.on('disconnected', () => {
		debug('Disconnected DB');
		logger.warn('Disconnected DB');

		connectDB();
	})
	.once('open', () => {
		debug('Connection DB');
		logger.warn('Connection DB');
	});

export default connectDB;
