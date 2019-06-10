import bluebird from 'bluebird';
import mongoose from 'mongoose';

import logger from 'shared/logger';

const debug = require('debug')('shared:mongodb');

/**
 * Настройка базы данных выполняется здесь
 */
const IS_PROD = process.env.NODE_ENV === 'production';

const uri_dev = 'mongodb://localhost:27017/posterdatetest';
const uri_prod = 'mongodb://localhost:27017/posterdate';
//mongodb://user1:741310PTppl#@rc1c-x6d91n4izpase64t.mdb.yandexcloud.net:27018/db1

const connectDb = () => {
	mongoose.Promise = bluebird;

	const options = {
		useNewUrlParser: true,
		useCreateIndex: true,
		autoIndex: !IS_PROD,
		// ssl: true,
		// sslCA: fs.readFileSync('/usr/local/share/ca-certificates/Yandex/YandexInternalRootCA.crt'),
		// replicaSet: 'rs01'
	};

	mongoose.connect(
		IS_PROD ? uri_prod : uri_dev,
		options
	);

	return mongoose.connection;
};

connectDb()
	.on('error', console.info)
	.on('disconnected', () => {
		debug('Disconnected DB');
		logger.warn('Disconnected DB');

		connectDb();
	})
	.once('open', () => {
		debug('Connection DB');
		logger.warn('Connection DB');
	});

export { connectDb };
