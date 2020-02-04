import axios from 'axios';

export const getPosition = (studioId, positionId) => {
	return async dispatch => {
		return await axios
			.post('/getPosition', {
				params: {
					positionId,
				},
			})
			.then(response => {
				const position = response.data;

				if (position) return Promise.resolve({ status: 'success', data: position });
				else return Promise.resolve({ status: 'error' });
			})
			.catch(error => {
				console.error(error);

				return Promise.resolve({ status: 'error' });
			});
	};
};

export const getPositionGroup = (studioId, positionGroupId) => {
	return async dispatch => {
		return await axios
			.post('/getPositionGroup', {
				params: {
					positionGroupId,
				},
			})
			.then(response => {
				const positionGroup = response.data;

				if (positionGroup) return Promise.resolve({ status: 'success', data: positionGroup });
				else return Promise.resolve({ status: 'error' });
			})
			.catch(error => {
				console.error(error);

				return Promise.resolve({ status: 'error' });
			});
	};
};

export const createWriteOff = (studioId, memberId, positionId, quantity) => {
	return async dispatch => {
		return await axios
			.post('/createWriteOff', {
				studioId,
				memberId,
				params: { positionId },
				data: { quantity },
			})
			.then(response => {
				return Promise.resolve({ status: 'success', data: response.data });
			})
			.catch(error => {
				console.error(error);

				return Promise.resolve({ status: 'error' });
			});
	};
};
