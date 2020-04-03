import axios from 'axios';

export const getCharacteristics = () => {
	return async (dispatch, getState) => {
		const studioId = getState().studio.data._id;
		const memberId = getState().member.data._id;

		dispatch({ type: 'REQUEST_SPECIFICATIONS' });

		return await axios
			.post('/api/getCharacteristics', {
				studioId,
				memberId,
			})
			.then(response => {
				dispatch({
					type: 'RECEIVE_SPECIFICATIONS',
					payload: response.data,
				});
			})
			.catch(error => {
				console.error(error);

				return Promise.resolve({ status: 'error' });
			});
	};
};

export const createCharacteristic = ({ data }) => {
	return async (dispatch, getState) => {
		const studioId = getState().studio.data._id;
		const memberId = getState().member.data._id;

		dispatch({ type: 'REQUEST_SPECIFICATIONS' });

		return await axios
			.post(`/api/createCharacteristics`, {
				studioId,
				memberId,
				data,
			})
			.then(response => {
				const characteristic = response.data;

				dispatch({
					type: 'CREATE_SPECIFICATION',
					payload: characteristic,
				});

				return Promise.resolve({ status: 'success', data: characteristic });
			})
			.catch(error => {
				console.error(error);

				return Promise.resolve({ status: 'error', message: error.message, ...error });
			});
	};
};
