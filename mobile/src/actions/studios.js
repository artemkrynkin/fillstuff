import axios from 'axios';

import { ACCOUNT_SERVER_URL } from 'mobile/src/api/constants';

export const getStudios = (
	{ query, showRequest } = {
		query: {},
		showRequest: true,
	}
) => {
	return async dispatch => {
		if (showRequest) dispatch({ type: 'REQUEST_STUDIOS' });

		return await axios
			.post(`${ACCOUNT_SERVER_URL}/api/getStudios`, {
				query,
			})
			.then(response => {
				dispatch({
					type: 'RECEIVE_STUDIOS',
					payload: response.data,
				});

				return Promise.resolve({ status: 'success' });
			})
			.catch(error => {
				console.error(error);

				dispatch({
					type: 'ERROR_STUDIOS',
					payload: error,
				});

				return Promise.reject({ status: 'error' });
			});
	};
};
