import fs from 'fs';
import i18n from 'i18n';
import multer from 'multer';
import logger from 'shared/logger';

const debug = require('debug')('api:multerUpload');

const rootFolder = process.env.NODE_ENV === 'production' ? 'build' : 'public';

const uploadProfilePhotoDS = multer.diskStorage({
	destination: (req, file, cb) => {
		let path = `${rootFolder}/uploads/u${String(req.user._id)}`;

		fs.mkdir(path, { recursive: true }, err => {
			if (err) {
				debug('upload error (uploadProfilePhoto)');
				logger.warn('upload error (uploadProfilePhoto)');
				throw err;
			}

			cb(null, path + '/');
		});
	},
});
export const uploadProfilePhoto = multer({
	storage: uploadProfilePhotoDS,
	limits: {
		fileSize: 10 * 1024 * 1024, //10mb
		files: 1,
	},
	fileFilter: (req, file, cb) => {
		const typeArray = file.mimetype.split('/');

		if (typeArray[0] === 'image' && (typeArray[1] === 'jpeg' || typeArray[1] === 'jpg' || typeArray[1] === 'png')) {
			cb(null, true);
		} else {
			cb(null, false, new Error(i18n.__('Неподдерживаемый формат файла')));
		}
	},
});
