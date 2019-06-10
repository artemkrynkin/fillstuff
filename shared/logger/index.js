import fs from 'fs';
import winston, { format } from 'winston';

const transportOptions = {
	maxsize: 1048576, //1mb
	maxFiles: 2,
	tailable: true,
};

const noErrorWarn = format(info => (!~info.level.search(/error|warn/) ? info : false));

if (process.env.NODE_ENV === 'production' && !fs.existsSync('logs')) {
	fs.mkdirSync('logs');
}

const logger = winston.createLogger({
	/**
	 * error: 0, (Ошибка)
	 * warn: 1, (Предупреждение)
	 * info: 2, (Информация)
	 */
	level: 'info',
	format: format.combine(format.timestamp(), format.json()),
	transports: [
		new winston.transports.File({
			filename: 'logs/error.log',
			level: 'error',
			...transportOptions,
		}),
		new winston.transports.File({
			filename: 'logs/warn.log',
			level: 'warn',
			...transportOptions,
		}),
		new winston.transports.File({
			format: noErrorWarn(),
			filename: 'logs/combined.log',
			...transportOptions,
		}),
	],
	exceptionHandlers: [
		new winston.transports.File({
			filename: 'logs/exceptions.log',
			...transportOptions,
		}),
	],
	silent: process.env.NODE_ENV !== 'production',
});

export default logger;
