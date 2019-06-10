import i18n from 'i18n';

import logger from 'shared/logger';

export default (err, req, res, next) => {
	if (err) {
		if (!err.code) {
			console.error(err);
			logger.error(err);
			res.status(500).send('Oops, something went wrong! Our engineers have been alerted and will fix this asap.');
		} else {
			sendErrorsResponse(req, res, next, err);
		}
	} else {
		return next();
	}
};

/**
 * ERROR CODE NUMBERS:
 * 1 - Произошла неизвестная ошибка
 *     Попробуйте повторить запрос позже
 *
 * 2 - Произошла внутренняя ошибка сервера
 *     Попробуйте повторить запрос позже
 *
 * 3 - Доступ запрещён
 *
 * 4 - Нет прав для выполнения этого действия
 *
 * 5 - Ошибка валидации (только для форм)
 *     --можно указать customErr для пользовательских ошибок
 *
 * 6 - Один из необходимых параметров был не передан или неверен
 *     --можно указать message
 *
 * 7 - Неверный запрос (Например размер файла превышает допустимый размер)
 *     Проверьте список используемых параметров запроса
 *     --можно указать message
 *
 *
 * @error = {
 *   code: ERROR_CODE_NUMBERS, Код ошибки, если указан, будет вызват метод ниже, иначе сервер выдаст 500 ошибку
 *   message: String, // Описание ошибки
 *   err: Object, // Если возможны ошибки валидации сервера, то передавать `err`, иначе null
 *   customErr: Array // Пользовательские ошибки вида [{ field: String, message: String }]
 * }
 */
const sendErrorsResponse = (req, res, next, error) => {
	const { code, message, customErr } = error;
	let { err } = error;
	let responseSend = { code: code };

	err = error.err ? error.err : { errors: {} };

	switch (code) {
		case 1: {
			console.error(err);
			logger.error(err);

			responseSend.message = i18n.__('Unknown error occurred');

			return res.status(520).json(responseSend);
		}
		case 2: {
			console.error(err);
			logger.error(err);

			responseSend.message = i18n.__('Internal server error');

			return res.status(500).json(responseSend);
		}
		case 3: {
			responseSend.message = i18n.__('Access denied');

			return res.status(401).json(responseSend);
		}
		case 4: {
			responseSend.message = i18n.__('Permission to perform this action is denied');

			return res.status(403).json(responseSend);
		}
		case 5: {
			const formErrors = [];

			if (customErr && customErr.length) {
				customErr.forEach(error => (err.errors[error.field] = error));
			}

			Object.keys(err.errors).forEach(key => {
				formErrors.push({
					field: key,
					message: err.errors[key].message,
				});
			});

			responseSend.message = i18n.__('Validation error');
			responseSend.formErrors = formErrors;

			return res.status(400).json(responseSend);
		}
		case 6: {
			responseSend.message = message || i18n.__('One of the parameters specified was missing or invalid');

			return res.status(400).json(responseSend);
		}
		case 7: {
			responseSend.message = message || i18n.__('Invalid request');

			return res.status(400).json(responseSend);
		}
		default: {
			return next(err);
		}
	}
};
