import axios from 'axios';

export const getMembers = ({ query, showRequest = true } = { showRequest: true }) => {
	return async (dispatch, getState) => {
		const studioId = getState().studio.data._id;
		const memberId = getState().member.data._id;

		if (showRequest) dispatch({ type: 'REQUEST_MEMBERS' });

		return await axios
			.post('/api/getMembers', {
				studioId,
				memberId,
				query,
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

export const getMember = ({ params }) => {
	return async (dispatch, getState) => {
		const studioId = getState().studio.data._id;
		const memberId = getState().member.data._id;

		return await axios
			.post('/api/getMember', {
				studioId,
				memberId,
				params,
			})
			.then(response => {
				const { data: member } = response;

				return Promise.resolve({ status: 'success', data: member });
			})
			.catch(error => {
				console.error(error.response);

				return Promise.resolve({ status: 'error' });
			});
	};
};

export const invitationMember = () => {
	return async (dispatch, getState) => {
		const studioId = getState().studio.data._id;
		const memberId = getState().member.data._id;

		return await axios
			.post('/api/invitationMember', {
				studioId,
				memberId,
			})
			.then(response => {
				const { data: member } = response;

				return Promise.resolve({ status: 'success', data: member });
			})
			.catch(error => {
				console.error(error);

				return Promise.resolve({ status: 'error' });
			});
	};
};

export const editMember = ({ params, data }) => {
	return async (dispatch, getState) => {
		const studioId = getState().studio.data._id;
		const memberId = getState().member.data._id;
		const { memberId: memberIdEdited } = params;

		dispatch({ type: 'REQUEST_MEMBERS' });

		return await axios
			.post('/api/editMember', {
				studioId,
				memberId,
				params,
				data,
			})
			.then(response => {
				const { data: member } = response;

				dispatch({
					type: 'EDIT_MEMBER',
					payload: {
						memberIdEdited,
						member,
					},
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
