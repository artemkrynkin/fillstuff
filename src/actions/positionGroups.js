import axios from 'axios';

export const createPositionGroup = (stockId, positionGroup) => {
	return async dispatch => {
		return await axios
			.post(
				`/api/position-groups`,
				{
					...positionGroup,
				},
				{
					params: {
						stockId,
					},
				}
			)
			.then(async response => {
				const { data: positionGroup } = response;

				await dispatch({
					type: 'CREATE_POSITION_GROUP',
					payload: positionGroup,
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

export const editPositionGroup = (positionGroupId, newValues) => {
	return async dispatch => {
		return await axios
			.put(`/api/position-groups/${positionGroupId}`, newValues)
			.then(response => {
				const positionGroup = response.data;

				dispatch({
					type: 'EDIT_POSITION_GROUP',
					payload: {
						positionGroupId,
						positionGroup,
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

export const addPositionsInPositionGroup = (positionGroupId, newValues) => {
	return async dispatch => {
		return await axios
			.post(`/api/position-groups/${positionGroupId}/add-positions`, newValues)
			.then(response => {
				const positionGroup = response.data;

				dispatch({
					type: 'ADD_POSITION_IN_POSITION_GROUP',
					payload: {
						positionGroupId,
						positionGroup,
						positionsAdded: newValues.positions,
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
