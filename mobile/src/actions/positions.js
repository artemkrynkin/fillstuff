import axios from 'axios';

export const getPosition = (stockId, positionId) => {
	return async dispatch => {
		return await axios
			.get(`/positions/${positionId}`, {
				stockId,
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

export const getPositionGroup = (stockId, positionGroupId) => {
	return async dispatch => {
		return await axios
			.get(`/position-groups/${positionGroupId}`, {
				stockId,
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

export const createWriteOff = (stockId, userId, positionId, quantity) => {
	return async dispatch => {
		return await axios
			.post('/write-offs', {
				stockId,
				userId,
				positionId,
				quantity,
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
