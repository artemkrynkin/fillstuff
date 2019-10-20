import axios from 'axios';

export const getPositions = stockId => {
	return async dispatch => {
		dispatch({ type: 'REQUEST_POSITIONS' });

		return await axios
			.get('/api/positions', {
				params: {
					stockId,
				},
			})
			.then(response => {
				dispatch({
					type: 'RECEIVE_POSITIONS',
					payload: response.data,
				});
			})
			.catch(error => {
				console.error(error.response);

				return Promise.resolve({ status: 'error' });
			});
	};
};

export const createPosition = (stockId, position) => {
	return async dispatch => {
		return await axios
			.post(
				`/api/positions`,
				{
					position,
				},
				{
					params: {
						stockId,
					},
				}
			)
			.then(response => {
				const { data: position } = response;

				dispatch({
					type: 'CREATE_POSITION',
					payload: position,
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

export const createPositionReceipt = (stockId, position, receipt) => {
	return async dispatch => {
		return await axios
			.post(
				`/api/positions/position-and-receipt`,
				{
					position,
					receipt,
				},
				{
					params: {
						stockId,
					},
				}
			)
			.then(response => {
				const { data: position } = response;

				dispatch({
					type: 'CREATE_POSITION',
					payload: position,
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

export const editPosition = (positionId, position) => {
	return async dispatch => {
		return await axios
			.put(`/api/positions/${positionId}`, {
				stock: position.stock,
				position,
			})
			.then(response => {
				const position = response.data;

				dispatch({
					type: 'EDIT_POSITION',
					payload: {
						positionId,
						position,
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

export const editPositionReceipt = (positionId, position, receipt) => {
	return async dispatch => {
		return await axios
			.put(`/api/positions/position-and-receipt/${positionId}`, {
				stock: position.stock,
				position,
				receipt,
			})
			.then(response => {
				const position = response.data;

				dispatch({
					type: 'EDIT_POSITION',
					payload: {
						positionId,
						position,
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

export const addQuantityInPosition = (stockId, positionId, addition) => {
	return async dispatch => {
		return await axios
			.post(`/api/positions/${positionId}/add-quantity`, addition, {
				params: {
					stockId,
				},
			})
			.then(response => {
				const position = response.data;

				dispatch({
					type: 'EDIT_POSITION',
					payload: {
						positionId,
						position,
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
