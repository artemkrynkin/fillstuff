import axios from 'axios';

export const getProcurements = ({ query, showRequest = true, mergeData = false } = { showRequest: true, mergeData: false }) => {
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
				if (!mergeData) {
					dispatch({
						type: 'RECEIVE_PROCUREMENTS',
						payload: response.data,
					});
				} else {
					dispatch({
						type: 'RECEIVE_MERGE_PROCUREMENTS',
						payload: response.data,
					});
				}

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
