import { axiosAccount } from 'src/api/constants';

export const getStudios = (
	{ query = {}, showRequest = true } = {
		query: {},
		showRequest: true,
	}
) => {
	return async dispatch => {
		if (showRequest) dispatch({ type: 'REQUEST_STUDIOS' });

		return await axiosAccount
			.post('/api/getStudios', {
				query,
			})
			.then(response => {
				dispatch({
					type: 'RECEIVE_STUDIOS',
					payload: response.data,
				});

				return Promise.resolve({ status: 'success' });
			})
			.catch(error => {
				console.error(error);

				dispatch({
					type: 'ERROR_STUDIOS',
					payload: error,
				});

				return Promise.reject({ status: 'error' });
			});
	};
};

export const createStudio = ({ data }) => {
	return async dispatch => {
		return await axiosAccount
			.post('/api/createStudio', {
				data,
			})
			.then(response => {
				const { user, studio } = response.data;

				dispatch({
					type: 'CREATE_STUDIO',
					payload: {
						studio,
					},
				});

				dispatch({
					type: 'RECEIVE_USER',
					payload: user,
				});

				return Promise.resolve({ status: 'success', data: response.data });
			})
			.catch(error => {
				console.error(error);

				dispatch({
					type: 'ERROR_STUDIOS',
					payload: error,
				});

				return Promise.reject({ status: 'error' });
			});
	};
};

export const editStudio = ({ studioId, memberId, data }) => {
	return async dispatch => {
		return await axiosAccount
			.post('/api/editStudio', {
				studioId,
				memberId,
				data,
			})
			.then(response => {
				const studio = response.data;

				dispatch({
					type: 'EDIT_STUDIO',
					payload: {
						studioId,
						studio,
					},
				});

				return Promise.resolve({ status: 'success', data: response.data });
			})
			.catch(error => {
				console.error(error);

				dispatch({
					type: 'ERROR_STUDIOS',
					payload: error,
				});

				return Promise.reject({ status: 'error' });
			});
	};
};

export const getStudioStore = () => {
	return async (dispatch, getState) => {
		const {
			user: { data: currentUser },
		} = getState();
		const studioId = currentUser.settings.studio;

		dispatch({ type: 'REQUEST_STUDIO' });

		return await axiosAccount
			.post('/api/getStudioStore', {
				studioId,
			})
			.then(response => {
				dispatch({
					type: 'GET_STUDIO_STORE',
					payload: response.data,
				});
			})
			.catch(error => {
				console.error(error);
			});
	};
};

export const joinStudio = () => {
	return async (dispatch, getState, socket) => {
		const {
			user: { data: currentUser },
		} = getState();
		const studioId = currentUser.settings.studio;

		socket.emit('joinStudio', studioId);

		socket.on('connect', () => {
			socket.emit('joinStudio', studioId);
		});
	};
};
