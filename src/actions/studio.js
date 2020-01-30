import axios from 'axios';

import { history } from 'src/helpers/history';
import { changeStudioCurrentUrl } from 'src/helpers/utils';

import { changeActiveStudio } from './user';

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

export const getStudioStock = () => {
	return async (dispatch, getState) => {
		const studioId = getState().studio.data._id;

		dispatch({ type: 'REQUEST_STUDIO' });

		return await axios
			.post('/api/getStudioStock', {
				studioId,
			})
			.then(response => {
				dispatch({
					type: 'GET_STUDIO_STOCK',
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
					return Promise.resolve({ status: 'error', data: error.response.data });
				} else {
					console.error(error);

					return Promise.resolve({ status: 'error' });
				}
			});
	};
};

// export const memberInvitation = studioId => {
// 	return async dispatch => {
// 		dispatch({ type: 'REQUEST_MEMBERS' });
//
// 		return await axios
// 			.get(`/api/studio/${studioId}/member-invitation`)
// 			.then(response => {
// 				return Promise.resolve({ status: 'success', data: response.data });
// 			})
// 			.catch(error => {
// 				console.error(error);
//
// 				return Promise.resolve({ status: 'error' });
// 			});
// 	};
// };
//
// export const editMember = (studioId, memberId, newValues) => {
// 	return async dispatch => {
// 		dispatch({ type: 'REQUEST_MEMBERS' });
//
// 		return await axios
// 			.put(`/api/studio/${studioId}/members/${memberId}`, newValues)
// 			.then(() => {
// 				dispatch({
// 					type: 'EDIT_MEMBER',
// 					payload: {
//             studioId,
// 						memberId,
// 						newValues,
// 					},
// 				});
//
// 				return Promise.resolve({ status: 'success' });
// 			})
// 			.catch(error => {
// 				if (error.response) {
// 					return Promise.resolve({ status: 'error', data: error.response.data });
// 				} else {
// 					console.error(error);
//
// 					return Promise.resolve({ status: 'error' });
// 				}
// 			});
// 	};
// };
//
// export const deleteMember = (studioId, memberId, memberUserId, currentUserId) => {
// 	return async (dispatch, getState) => {
// 		dispatch({ type: 'REQUEST_MEMBERS' });
//
// 		return await axios
// 			.delete(`/api/studio/${studioId}/members/${memberId}`)
// 			.then(async () => {
// 				if (memberUserId === currentUserId) {
// 					let {
//             studios: { data: studios },
// 						newStudios = studios.filter(studio => studio._id !== studioId).sort((studioA, studioB) => studioB.createdAt - studioA.createdAt),
// 						nextStudioId = newStudios.length ? newStudios[0]._id : null,
// 					} = getState();
//
// 					await dispatch(changeActiveStudio(nextStudioId)).then(() => {
// 						history.push({ pathname: nextStudioId ? changeStudioCurrentUrl(nextStudioId) : '/studios' });
// 					});
//
// 					dispatch({
// 						type: 'DELETE_STUDIO',
// 						payload: {
//               studioId,
// 						},
// 					});
//
// 					return Promise.resolve({ status: 'success', data: nextStudioId });
// 				}
//
// 				dispatch({
// 					type: 'DELETE_MEMBER',
// 					payload: {
//             studioId,
// 						memberId,
// 					},
// 				});
//
// 				return Promise.resolve();
// 			})
// 			.catch(error => {
// 				console.error(error);
//
// 				return Promise.resolve({ status: 'error' });
// 			});
// 	};
// };
