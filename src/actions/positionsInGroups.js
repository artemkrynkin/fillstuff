import axios from 'axios';

export const getPositionsInGroups = stockId => {
	return async dispatch => {
		dispatch({ type: 'REQUEST_POSITIONS_IN_GROUPS' });

		return await axios
			.get('/api/positions/positions-in-groups', {
				params: {
					stockId,
				},
			})
			.then(response => {
				dispatch({
					type: 'RECEIVE_POSITIONS_IN_GROUPS',
					payload: response.data,
				});
			})
			.catch(error => {
				console.error(error.response);

				return Promise.resolve({ status: 'error' });
			});
	};
};

export const removePositionFromGroup = (stockId, positionId, positionGroupId) => {
	return async dispatch => {
		return await axios
			.get(`/api/positions/${positionId}/remove-from-group`, {
				params: {
					stockId,
				},
			})
			.then(response => {
				if (!response.data.code) {
					const remainingPositionId = response.data.remainingPositionId;

					dispatch({
						type: 'REMOVE_POSITION_FROM_GROUP',
						payload: {
							positionGroupId,
							positionId,
							remainingPositionId,
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

export const archivePositionInGroup = (stockId, positionId, positionGroupId) => {
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
