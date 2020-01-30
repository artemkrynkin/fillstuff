import axios from 'axios';

export const getPositionsAndGroups = () => {
	return async (dispatch, getState) => {
		const studioId = getState().studio.data._id;
		const memberId = getState().member.data._id;

		dispatch({ type: 'REQUEST_POSITIONS_AND_GROUPS' });

		return await axios
			.post('/api/getPositionsAndGroups', {
				studioId,
				memberId,
			})
			.then(response => {
				dispatch({
					type: 'RECEIVE_POSITIONS_AND_GROUPS',
					payload: response.data,
				});
			})
			.catch(error => {
				console.error(error.response);

				return Promise.resolve({ status: 'error' });
			});
	};
};

export const removePositionFromGroup = ({ params, data }) => {
	return async (dispatch, getState) => {
		const studioId = getState().studio.data._id;
		const memberId = getState().member.data._id;
		const { positionId } = params;
		const { positionGroupId } = data;

		return await axios
			.post('/api/removePositionFromGroup', {
				studioId,
				memberId,
				params,
			})
			.then(response => {
				if (!response.data.code) {
					dispatch({
						type: 'REMOVE_POSITION_FROM_GROUP',
						payload: {
							positionGroupId,
							positionId,
							remainingPositionId: response.data,
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

export const archivePositionInGroup = ({ params, data }) => {
	return async (dispatch, getState) => {
		const studioId = getState().studio.data._id;
		const memberId = getState().member.data._id;
		const { positionId } = params;
		const { positionGroupId } = data;

		return await axios
			.post('/api/archivePosition', {
				studioId,
				memberId,
				params,
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
