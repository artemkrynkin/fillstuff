import axios from 'axios';

export const getMembers = (
	{ query = {}, showRequest = true, emptyData = false } = {
		query: {},
		showRequest: true,
		emptyData: false,
	}
) => {
	return async (dispatch, getState) => {
		const studioId = getState().studio.data._id;
		const memberId = getState().member.data._id;

		if (showRequest) dispatch({ type: 'REQUEST_MEMBERS' });
		if (emptyData) dispatch({ type: 'EMPTY_MEMBERS' });

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
				console.error(error.response);

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

				return Promise.resolve({ status: 'error', message: error.message, ...error });
			});
	};
};

export const editMember = ({ params, data }) => {
	return async (dispatch, getState) => {
		const studioId = getState().studio.data._id;
		const memberId = getState().member.data._id;

		return await axios
			.post('/api/editMember', {
				studioId,
				memberId,
				params,
				data,
			})
			.then(response => {
				const { data: member } = response;

				return Promise.resolve({ status: 'success', data: member });
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
