import axios from 'axios';

export const getUser = () => {
	return async dispatch => {
		dispatch({ type: 'REQUEST_USER' });

		return await axios
			.get('/api/users/me')
			.then(response => {
				dispatch({
					type: 'RECEIVE_USER',
					payload: response.data,
				});

				return Promise.resolve({ status: 'success' });
			})
			.catch(error => {
				if (error.response && error.response.status === 401) {
					dispatch({
						type: 'UNAUTHORIZED_USER',
						payload: error.response.data,
					});

					return Promise.resolve({ status: 'error' });
				} else {
					console.error(error.response);
				}
			});
	};
};

export const editUser = values => {
	return async dispatch => {
		dispatch({ type: 'REQUEST_USER' });

		return await axios
			.put('/api/users/me', values)
			.then(response => {
				dispatch({
					type: 'RECEIVE_USER',
					payload: response.data,
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

export const changeActiveStock = stockId => {
	return async dispatch => {
		dispatch({ type: 'REQUEST_USER_ACTIVE_STOCK' });

		return await axios
			.put('/api/users/me/active-stock', {
				activeStockId: stockId,
			})
			.then(() => {
				dispatch({
					type: 'RECEIVE_USER_ACTIVE_STOCK',
					payload: {
						stockId,
					},
				});

				return Promise.resolve();
			})
			.catch(error => {
				console.error(error);
			});
	};
};
