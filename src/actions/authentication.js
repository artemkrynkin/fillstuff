import axios from 'axios';

import { SERVER_URL } from 'src/api/constants';

export const login = (values, actions, redirect) => {
	axios
		.post('/auth/local', values)
		.then(response => {
			if (actions) actions.setSubmitting(false);

			window.location.href = redirect || response.data;
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

export const logout = () => (window.location.href = `${SERVER_URL}/auth/logout`);
