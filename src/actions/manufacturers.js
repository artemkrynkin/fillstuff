import axios from 'axios';

export const getManufacturers = stockId => {
	return dispatch => {
		dispatch({ type: 'REQUEST_MANUFACTURERS' });

		axios
			.get('/api/manufacturers', {
				params: {
					stockId,
				},
			})
			.then(response => {
				dispatch({
					type: 'RECEIVE_MANUFACTURERS',
					payload: response.data,
				});
			})
			.catch(error => {
				if (error) console.error(error.response);
			});
	};
};

export const createManufacturer = values => {
	return dispatch => {
		dispatch({ type: 'REQUEST_MANUFACTURERS' });

		return axios
			.post(`/api/manufacturers`, values)
			.then(response => {
				const manufacturer = response.data;

				dispatch({
					type: 'CREATE_MANUFACTURER',
					payload: manufacturer,
				});

				return Promise.resolve({ status: 'success', data: manufacturer });
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
