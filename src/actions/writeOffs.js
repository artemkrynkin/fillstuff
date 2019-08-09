import axios from 'axios';

export const getWriteOffs = (stockId, productId, userId) => {
	return async dispatch => {
		dispatch({ type: 'REQUEST_WRITE_OFFS' });

		const requestParams = { stockId };

		if (productId) requestParams.productId = productId;
		if (userId) requestParams.userId = userId;

		return await axios
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

export const createWriteOff = (stockId, markerId, userId, values) => {
	return async dispatch => {
		return await axios
			.post('/api/write-offs/marker', {
				stockId,
				markerId,
				userId,
				...values,
			})
			.then(async response => {
				// const { data: writeOff } = response;

				// await dispatch({
				//   type: 'CREATE_WRITE_OFF',
				//   payload: writeOff,
				// });
				const marker = response.data;

				dispatch({
					type: 'EDIT_MARKER',
					payload: {
						productId: marker.product,
						markerId,
						marker,
					},
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
