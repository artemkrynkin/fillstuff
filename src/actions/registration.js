import axios from 'axios';

export const registration = async ({ data }) => {
	return await axios
		.post('/api/registration', data)
		.then(() => {
			return Promise.resolve({ status: 'success' });
		})
		.catch(error => {
			if (error.response) {
				return Promise.resolve({ status: 'error', data: error.response.data });
			} else {
				console.error(error);

				return Promise.resolve({ status: 'error' });
			}
		});
};
