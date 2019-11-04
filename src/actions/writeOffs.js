import axios from 'axios';

export const getWriteOffs = (stockId, params) => {
	return async dispatch => {
		dispatch({ type: 'REQUEST_WRITE_OFFS' });

		const requestParams = { stockId, ...params };

		return await axios
			.get('/api/write-offs', {
				params: requestParams,
			})
			.then(response => {
				dispatch({
					type: 'RECEIVE_WRITE_OFFS',
					payload: response.data,
				});
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

export const deleteWriteOff = (stockId, writeOffId) => {
	return async dispatch => {
		return await axios
			.delete(`/api/write-offs/${writeOffId}`, {
				params: {
					stockId,
				},
			})
			.then(response => {
				dispatch({
					type: 'DELETE_WRITE_OFF',
					payload: {
						writeOffId,
					},
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
