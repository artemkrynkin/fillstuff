import axios from 'axios';
/**
 *
 * @param params
 * @param query
 * @param data
 * @param showRequest
 * @returns {function(*, *): {status: string} | {status: string}}
 */

export const getProcurements = ({ query, showRequest } = { showRequest: true }) => {
	return async (dispatch, getState) => {
		const studioId = getState().studio.data._id;
		const memberId = getState().member.data._id;

		if (showRequest) dispatch({ type: 'REQUEST_PROCUREMENTS' });

		return await axios
			.post('/api/getProcurements', {
				studioId,
				memberId,
				query,
			})
			.then(response => {
				dispatch({
					type: 'RECEIVE_PROCUREMENTS',
					payload: response.data,
				});

				return Promise.resolve({ status: 'success' });
			})
			.catch(error => {
				console.error(error.response);

				return Promise.resolve({ status: 'error' });
			});
	};
};

export const getProcurement = ({ params }) => {
	return async (dispatch, getState) => {
		const studioId = getState().studio.data._id;
		const memberId = getState().member.data._id;

		return await axios
			.post('/api/getProcurement', {
				studioId,
				memberId,
				params,
			})
			.then(response => {
				const { data: procurement } = response;

				return Promise.resolve({ status: 'success', data: procurement });
			})
			.catch(error => {
				console.error(error.response);

				return Promise.resolve({ status: 'error' });
			});
	};
};

export const createProcurement = ({ data }) => {
	return async (dispatch, getState) => {
		const studioId = getState().studio.data._id;
		const memberId = getState().member.data._id;

		return await axios
			.post('/api/createProcurement', {
				studioId,
				memberId,
				data,
			})
			.then(response => {
				const { data: procurement } = response;

				dispatch({
					type: 'CREATE_PROCUREMENT',
					payload: procurement,
				});

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
};
