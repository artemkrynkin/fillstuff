import axios from 'axios';

export const getMyAccount = () => {
	return async dispatch => {
		dispatch({ type: 'REQUEST_USER' });

		return await axios
			.post('/api/getMyAccount')
			.then(response => {
				dispatch({
					type: 'RECEIVE_USER',
					payload: response.data,
				});

				return Promise.resolve({ status: 'success' });
			})
			.catch(error => {
				if (error.response && error.response.status === 401) {
					dispatch({
						type: 'UNAUTHORIZED_USER',
						payload: error.response.data,
					});
				} else {
					console.error(error.response);
				}

				return Promise.resolve({ status: 'error' });
			});
	};
};

export const editMyAccount = ({ data }) => {
	return async dispatch => {
		dispatch({ type: 'REQUEST_USER' });

		return await axios
			.post('/api/editMyAccount', data)
			.then(response => {
				dispatch({
					type: 'RECEIVE_USER',
					payload: response.data,
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

export const getMyAccountMember = (userId, memberId) => {
	return async dispatch => {
		dispatch({ type: 'REQUEST_MEMBER' });

		return await axios
			.post('/api/getMyAccountMember', {
				userId,
				memberId,
			})
			.then(response => {
				dispatch({
					type: 'RECEIVE_MEMBER',
					payload: response.data,
				});

				return Promise.resolve({ status: 'success' });
			})
			.catch(error => {
				if (error.response && error.response.status === 401) {
					dispatch({
						type: 'UNAUTHORIZED_USER',
						payload: error.response.data,
					});
				} else {
					console.error(error.response);
				}

				return Promise.resolve({ status: 'error' });
			});
	};
};
