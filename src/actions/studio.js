import axios from 'axios';

// import history from 'src/helpers/history';
// import { changeStudioCurrentUrl } from 'src/helpers/utils';

// import { changeActiveStudio } from './user';

export const getStudio = (userId, studioId) => {
	return async dispatch => {
		dispatch({ type: 'REQUEST_STUDIO' });

		return await axios
			.post('/api/getStudio', {
				studioId,
				userId,
			})
			.then(response => {
				dispatch({
					type: 'RECEIVE_STUDIO',
					payload: response.data,
				});
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

export const getStudioStore = () => {
	return async (dispatch, getState) => {
		const studioId = getState().studio.data._id;

		dispatch({ type: 'REQUEST_STUDIO' });

		return await axios
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

export const editStudio = ({ data }) => {
	return async (dispatch, getState) => {
		const studioId = getState().studio.data._id;
		const memberId = getState().member.data._id;

		dispatch({ type: 'REQUEST_STUDIOS' });

		return await axios
			.post('/api/editStudio', {
				studioId,
				memberId,
				data,
			})
			.then(() => {
				dispatch({
					type: 'EDIT_STUDIO',
					payload: data,
				});

				return Promise.resolve({ status: 'success' });
			})
			.catch(error => {
				if (error.response) {
					return Promise.resolve({ status: 'error', message: error.response.data.message, data: error.response.data });
				} else {
					console.error(error);

					return Promise.resolve({ status: 'error', message: error.message, ...error });
				}
			});
	};
};

export const joinStudio = () => {
	return async (dispatch, getState, socket) => {
		const studioId = getState().studio.data._id;

		socket.emit('joinStudio', studioId);

		socket.on('connect', () => {
			socket.emit('joinStudio', studioId);
		});
	};
};
