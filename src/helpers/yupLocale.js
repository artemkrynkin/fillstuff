import { setLocale } from 'yup';

setLocale({
	mixed: {
		required: 'Обязательное поле',
		oneOf: 'Значение отсутствует в списке доступных значений',
	},
	string: {
		required: 'Обязательное поле',
		// eslint-disable-next-line
		min: 'Не может быть короче ${min} символов',
		// eslint-disable-next-line
		max: 'Не может превышать ${max} символов',
		email: 'Некорректный Email',
	},
	number: {
		// eslint-disable-next-line
		min: 'Не может быть меньше ${min}',
		// eslint-disable-next-line
		max: 'Не может быть больше ${min}',
	},
});
