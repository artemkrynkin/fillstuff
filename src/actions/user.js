import { axiosAccount } from 'src/api/constants';

export const getMyAccount = () => {
	return async dispatch => {
		dispatch({ type: 'REQUEST_USER' });

		return await axiosAccount
			.post('/api/getMyAccount')
			.then(response => {
				dispatch({
					type: 'RECEIVE_USER',
					payload: response.data,
				});

				return Promise.resolve({ status: 'success' });
			})
			.catch(error => {
				console.error(error);

				dispatch({
					type: 'ERROR_USER',
					payload: error,
				});

				return Promise.reject({ status: 'error' });
			});
	};
};

export const switchStudio = ({ data }) => {
	return async dispatch => {
		return await axiosAccount
			.post('/api/switchStudio', {
				data,
			})
			.then(response => {
				dispatch({
					type: 'RECEIVE_USER',
					payload: response.data,
				});

				return Promise.resolve({ status: 'success' });
			})
			.catch(error => {
				console.error(error);

				dispatch({
					type: 'ERROR_USER',
					payload: error,
				});

				return Promise.reject({ status: 'error' });
			});
	};
};
