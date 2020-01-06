import axios from 'axios';

export const getWriteOffs = (stockId, params = {}, showRequest = true) => {
	return async dispatch => {
		if (showRequest) dispatch({ type: 'REQUEST_WRITE_OFFS' });

		return await axios
			.get('/api/write-offs', {
				params: {
					stockId,
					...params,
				},
			})
			.then(response => {
				dispatch({
					type: 'RECEIVE_WRITE_OFFS',
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

export const createWriteOff = (stockId, userId, positionId, values) => {
	return async dispatch => {
		return await axios
			.post('/api/write-offs', {
				stockId,
				userId,
				positionId,
				...values,
			})
			.then(response => {
				if (!response.data.code) {
					const position = response.data;

					dispatch({
						type: 'EDIT_POSITION',
						payload: {
							positionId,
							position,
						},
					});

					return Promise.resolve({ status: 'success' });
				} else {
					return Promise.resolve({ status: 'error', message: response.data.message });
				}
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

export const cancelWriteOff = (stockId, writeOffId) => {
	return async dispatch => {
		return await axios
			.get(`/api/write-offs/cancel/${writeOffId}`, {
				params: {
					stockId,
				},
			})
			.then(response => {
				if (!response.data.code) {
					const writeOff = response.data;

					dispatch({
						type: 'CANCEL_WRITE_OFF',
						payload: {
							writeOffId,
							writeOff,
						},
					});

					return Promise.resolve({ status: 'success' });
				} else {
					return Promise.resolve({ status: 'error', message: response.data.message });
				}
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
