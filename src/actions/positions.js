import axios from 'axios';

export const getPositionsInGroups = stockId => {
	return async dispatch => {
		dispatch({ type: 'REQUEST_POSITIONS' });

		return await axios
			.get('/api/positions/positions-in-groups', {
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

export const createPosition = (stockId, position, receipt) => {
	return async dispatch => {
		return await axios
			.post(
				`/api/positions`,
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

export const editPosition = (positionId, position, receipt) => {
	return async dispatch => {
		return await axios
			.put(`/api/positions/${positionId}`, {
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

export const addQuantityPosition = (stockId, positionId, addition) => {
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

export const removeFromGroupPosition = (stockId, positionId, positionGroupId) => {
	return async dispatch => {
		return await axios
			.get(`/api/positions/${positionId}/remove-from-group`, {
				params: {
					stockId,
				},
			})
			.then(response => {
				if (!response.data.code) {
					dispatch({
						type: 'REMOVE_FROM_GROUP_POSITION',
						payload: {
							positionGroupId,
							positionId,
						},
					});

					return Promise.resolve({ status: 'success' });
				} else {
					return Promise.resolve({ status: 'error' });
				}
			})
			.catch(error => {
				console.error(error);

				return Promise.resolve({ status: 'error' });
			});
	};
};

export const archivePosition = (stockId, positionId, positionGroupId) => {
	return async dispatch => {
		return await axios
			.get(`/api/positions/${positionId}/archive`, {
				params: {
					stockId,
				},
			})
			.then(response => {
				if (!response.data.code) {
					dispatch({
						type: 'ARCHIVE_POSITION',
						payload: {
							positionGroupId,
							positionId,
						},
					});

					return Promise.resolve({ status: 'success' });
				} else {
					return Promise.resolve({ status: 'error' });
				}
			})
			.catch(error => {
				console.error(error);

				return Promise.resolve({ status: 'error' });
			});
	};
};
