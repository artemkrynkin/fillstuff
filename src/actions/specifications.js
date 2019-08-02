import axios from 'axios';

export const getSpecifications = stockId => {
	return dispatch => {
		dispatch({ type: 'REQUEST_SPECIFICATIONS' });

		axios
			.get('/api/specifications', {
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

export const createSpecification = values => {
	return dispatch => {
		dispatch({ type: 'REQUEST_SPECIFICATIONS' });

		return axios
			.post(`/api/specifications`, values)
			.then(response => {
				const specification = response.data;

				dispatch({
					type: 'CREATE_SPECIFICATION',
					payload: specification,
				});

				return Promise.resolve({ status: 'success', data: specification });
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
