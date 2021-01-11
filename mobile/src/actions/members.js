import axios from 'axios';

import { ACCOUNT_SERVER_URL } from 'mobile/src/api/constants';

export const linkUserAndStudio = ({ data }) => {
	return async dispatch => {
		return await axios
			.post(`${ACCOUNT_SERVER_URL}/api/linkUserAndStudio`, {
				data,
			})
			.then(() => {
				return Promise.resolve({ status: 'success' });
			})
			.catch(error => {
				console.error(error);

				return Promise.reject({ status: 'error' });
			});
	};
};
