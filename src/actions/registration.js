import axios from 'axios';

import { CLIENT_URL } from 'src/api/constants';

export const registration = (values, actions) => {
	axios
		.post('/api/registration', values)
		.then(() => {
			if (actions) actions.setSubmitting(false);

			window.location.href = `${CLIENT_URL}/stocks`;
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
