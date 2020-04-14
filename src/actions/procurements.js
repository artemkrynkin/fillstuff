import axios from 'axios';

export const getProcurementsReceived = ({ query, showRequest = true, mergeData = false } = { showRequest: true, mergeData: false }) => {
	return async (dispatch, getState) => {
		const studioId = getState().studio.data._id;
		const memberId = getState().member.data._id;

		if (showRequest) dispatch({ type: 'REQUEST_PROCUREMENTS_RECEIVED' });

		return await axios
			.post('/api/getProcurementsReceived', {
				studioId,
				memberId,
				query,
			})
			.then(response => {
				if (!mergeData) {
					dispatch({
						type: 'RECEIVE_PROCUREMENTS_RECEIVED',
						payload: response.data,
					});
				} else {
					dispatch({
						type: 'RECEIVE_MERGE_PROCUREMENTS_RECEIVED',
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

export const getProcurementReceived = ({ params }) => {
	return async (dispatch, getState) => {
		const studioId = getState().studio.data._id;
		const memberId = getState().member.data._id;

		return await axios
			.post('/api/getProcurementReceived', {
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

export const createProcurementReceived = ({ data }) => {
	return async (dispatch, getState) => {
		const studioId = getState().studio.data._id;
		const memberId = getState().member.data._id;

		return await axios
			.post('/api/createProcurementReceived', {
				studioId,
				memberId,
				data,
			})
			.then(response => {
				const { data: procurement } = response;

				dispatch({
					type: 'CREATE_PROCUREMENT_RECEIVED',
					payload: procurement,
				});

				return Promise.resolve({ status: 'success' });
			})
			.catch(error => {
				if (error.response) {
					return Promise.resolve({ status: 'error', message: error.response.data.message, data: error.response.data });
				} else {
					console.error(error);

					return Promise.resolve({ status: 'error', message: error.message, ...error });
				}
			});
	};
};
