import axios from 'axios';

export const getCharacteristics = stockId => {
	return async dispatch => {
		dispatch({ type: 'REQUEST_SPECIFICATIONS' });

		return await axios
			.get('/api/characteristics', {
				params: {
					stockId,
				},
			})
			.then(response => {
				dispatch({
					type: 'RECEIVE_SPECIFICATIONS',
					payload: response.data,
				});
			})
			.catch(error => {
				if (error) console.error(error.response);
			});
	};
};

export const createCharacteristic = values => {
	return async dispatch => {
		dispatch({ type: 'REQUEST_SPECIFICATIONS' });

		return await axios
			.post(`/api/characteristics`, values)
			.then(response => {
				const characteristic = response.data;

				dispatch({
					type: 'CREATE_SPECIFICATION',
					payload: characteristic,
				});

				return Promise.resolve({ status: 'success', data: characteristic });
			})
			.catch(error => {
				if (error.response) {
					return Promise.resolve({ status: 'error' });
				} else {
					console.error(error);
				}
			});
	};
};
