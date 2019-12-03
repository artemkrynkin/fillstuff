import axios from 'axios';

export const getProcurements = (stockId, params = {}, showRequest = true) => {
	return async dispatch => {
		if (showRequest) dispatch({ type: 'REQUEST_PROCUREMENTS' });

		return await axios
			.get('/api/procurements', {
				params: {
					stockId,
					...params,
				},
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

export const getProcurement = (stockId, procurementId) => {
	return async dispatch => {
		return await axios
			.get(`/api/procurements/${procurementId}`, {
				params: {
					stockId,
				},
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

export const createProcurement = (stockId, procurement) => {
	return async dispatch => {
		return await axios
			.post(
				'/api/procurements',
				{
					procurement,
				},
				{
					params: {
						stockId,
					},
				}
			)
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
