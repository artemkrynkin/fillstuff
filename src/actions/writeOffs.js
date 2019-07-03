import axios from 'axios';

export const getWriteOffs = (stockId, productId, userId) => {
	return dispatch => {
		dispatch({ type: 'REQUEST_WRITE_OFFS' });

		const requestParams = { stockId };

		if (productId) requestParams.productId = productId;
		if (userId) requestParams.userId = userId;

		return axios
			.get('/api/write-offs', {
				params: requestParams,
			})
			.then(async response => {
				dispatch({
					type: 'RECEIVE_WRITE_OFFS',
					payload: response.data,
				});
			})
			.catch(error => {
				if (error.response && error.response.status === 401) {
					dispatch({
						type: 'UNAUTHORIZED_USER',
						payload: error.response.data,
					});
				} else {
					console.error(error.response);
				}
			});
	};
};

export const createWriteOff = (stockId, userId, values) => {
	return dispatch => {
		return axios
			.post('/api/write-offs/product', {
				stockId,
				userId,
				...values,
			})
			.then(async response => {
				const { data: writeOff } = response;

				await dispatch({
					type: 'CREATE_WRITE_OFF',
					payload: writeOff,
				});

				return Promise.resolve({ status: 'success' });
			})
			.catch(error => {
				if (error.response) {
					return Promise.resolve({ status: 'error', data: error.response.data });
				} else {
					console.error(error);
				}
			});
	};
};
