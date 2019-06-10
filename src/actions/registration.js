import axios from 'axios';

import { CLIENT_URL } from 'src/api/constants';

import { login } from './authentication';

export const registration = (values, actions) => {
	axios
		.post('/api/registration', values)
		.then(response => {
			if (actions) actions.setSubmitting(false);

			login(values, null, `${CLIENT_URL}/projects`);
		})
		.catch(error => {
			if (error.response && actions) {
				let data = error.response.data;

				data.formErrors.forEach(error => {
					actions.setFieldError(error.field, error.message);
				});

				actions.setSubmitting(false);
			} else {
				console.error(error);
			}
		});
};
