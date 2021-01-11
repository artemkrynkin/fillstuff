import axios from 'axios';

import { SERVER_URL } from 'mobile/src/api/constants';

export const getUserWriteOffs = (
	{ query, showRequest = true, mergeData = false, emptyData = false } = {
		query: {},
		showRequest: true,
		mergeData: false,
		emptyData: false,
	}
) => {
	return async (dispatch, getState) => {
		const {
			user: { data: currentUser },
		} = getState();
		const studioId = currentUser.settings.studio;
		const memberId = currentUser.settings.member._id;

		if (showRequest) dispatch({ type: 'REQUEST_WRITE_OFFS' });
		if (emptyData) dispatch({ type: 'EMPTY_WRITE_OFFS' });

		return await axios
			.post(`${SERVER_URL}/api/getUserWriteOffs`, {
				studioId,
				memberId,
				query,
			})
			.then(response => {
				if (!mergeData) {
					dispatch({
						type: 'RECEIVE_WRITE_OFFS',
						payload: response.data,
					});
				} else {
					dispatch({
						type: 'RECEIVE_MERGE_WRITE_OFFS',
						payload: response.data,
					});
				}

				return Promise.resolve({ status: 'success' });
			})
			.catch(error => {
				console.error(error.response);

				dispatch({
					type: 'ERROR_WRITE_OFFS',
					payload: error,
				});

				return Promise.reject({ status: 'error' });
			});
	};
};

export const createWriteOff = ({ params, data }) => {
	return async (dispatch, getState) => {
		const {
			user: { data: currentUser },
		} = getState();
		const studioId = currentUser.settings.studio;
		const memberId = currentUser.settings.member._id;

		return await axios
			.post(`${SERVER_URL}/api/createWriteOff`, {
				studioId,
				memberId,
				params,
				data,
			})
			.then(response => {
				if (!response.data.code) {
					return Promise.resolve({ status: 'success' });
				} else {
					console.error(response);

					return Promise.reject({ status: 'error' });
				}
			})
			.catch(error => {
				console.error(error);

				return Promise.reject({ status: 'error' });
			});
	};
};
