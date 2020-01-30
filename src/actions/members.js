import axios from 'axios';

export const getMembers = () => {
	return async (dispatch, getState) => {
		const studioId = getState().studio.data._id;
		const memberId = getState().member.data._id;

		dispatch({ type: 'REQUEST_MEMBERS' });

		return await axios
			.post('/api/getMembers', {
				studioId,
				memberId,
			})
			.then(response => {
				dispatch({
					type: 'RECEIVE_MEMBERS',
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
