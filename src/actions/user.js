import axios from 'axios';

export const getUser = () => {
	return dispatch => {
		dispatch({ type: 'REQUEST_USER' });

		return axios
			.get('/api/users/me')
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

					return Promise.resolve({ status: 'error' });
				} else {
					console.error(error.response);
				}
			});
	};
};

export const editUser = values => {
	return dispatch => {
		dispatch({ type: 'REQUEST_USER' });

		return axios
			.put('/api/users/me', values)
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
				}
			});
	};
};

export const changeChannelOption = values => {
	return dispatch => {
		dispatch({ type: 'REQUEST_USER_NOTIFICATIONS' });

		return axios
			.post('/api/users/me/notifications', values)
			.then(response => {
				dispatch({
					type: 'RECEIVE_USER_NOTIFICATIONS',
					payload: response.data,
				});
			})
			.catch(error => {
				console.error(error);
			});
	};
};

export const changeActiveProject = projectId => {
	return async dispatch => {
		dispatch({ type: 'REQUEST_USER_ACTIVE_PROJECT' });

		return await axios
			.put('/api/users/me/active-project', {
				activeProjectId: projectId,
			})
			.then(() => {
				dispatch({
					type: 'RECEIVE_USER_ACTIVE_PROJECT',
					payload: {
						projectId,
					},
				});

				return Promise.resolve();
			})
			.catch(error => {
				console.error(error);
			});
	};
};
