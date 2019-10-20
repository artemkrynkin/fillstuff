import axios from 'axios';

export const scraping = url => {
	return async dispatch => {
		return await axios
			.get('/api/scraping', {
				params: {
					url,
				},
			})
			.then(response => {})
			.catch(error => {
				console.error(error);

				return Promise.resolve({ status: 'error' });
			});
	};
};
