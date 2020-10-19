import axios from 'axios';

export const signup = ({ data }) => {
	return async () => {
		return await axios
			.post('/api/signup', data)
			.then(() => {
				return Promise.resolve({ status: 'success' });
			})
			.catch(error => {
				console.error(error.response);

				return Promise.resolve({ status: 'error', data: error.response.data });
			});
	};
};
