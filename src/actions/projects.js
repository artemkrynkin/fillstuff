import axios from 'axios';

import { history } from 'src/helpers/history';
import { changeProjectCurrentUrl } from 'src/helpers/utils';

import { changeActiveProject } from './user';

export const getProjects = () => {
	return dispatch => {
		dispatch({ type: 'REQUEST_PROJECTS' });

		axios
			.get('/api/projects')
			.then(response => {
				dispatch({
					type: 'RECEIVE_PROJECTS',
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
			});
	};
};

export const createProject = values => {
	return dispatch => {
		dispatch({ type: 'REQUEST_PROJECTS' });

		return axios
			.post('/api/projects', values)
			.then(async response => {
				const { data: project } = response;

				await dispatch({
					type: 'CREATE_PROJECT',
					payload: project,
				});

				dispatch(changeActiveProject(project._id)).then(() => {
					history.push({ pathname: `/projects/${project._id}/feed` });
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

export const editProject = (projectId, newValues) => {
	return dispatch => {
		dispatch({ type: 'REQUEST_PROJECTS' });

		return axios
			.put(`/api/projects/${projectId}`, newValues)
			.then(() => {
				dispatch({
					type: 'EDIT_PROJECT',
					payload: {
						projectId,
						newValues,
					},
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

export const deleteProject = projectId => {
	return dispatch => {
		dispatch({ type: 'REQUEST_PROJECTS' });

		return axios
			.delete(`/api/projects/${projectId}`)
			.then(async response => {
				const { data: nextProjectId } = response;

				await dispatch(changeActiveProject(nextProjectId)).then(() => {
					history.push({ pathname: nextProjectId ? changeProjectCurrentUrl(nextProjectId) : '/projects' });
				});

				dispatch({
					type: 'DELETE_PROJECT',
					payload: {
						projectId,
					},
				});

				return Promise.resolve({ status: 'success', data: nextProjectId });
			})
			.catch(error => {
				console.error(error);
			});
	};
};

export const getSocialPagesFromNetwork = socialNetwork => {
	return axios
		.get(`/api/projects/social-pages`, {
			params: {
				socialNetwork,
			},
		})
		.then(response => {
			return Promise.resolve({ status: 'success', data: response.data });
		})
		.catch(error => {
			if (error.response) {
				return Promise.resolve({ status: 'error', data: error.response.data });
			} else {
				console.error(error);
			}
		});
};

export const connectSocialPages = (projectId, socialNetwork, socialPageIds) => {
	return dispatch => {
		dispatch({ type: 'REQUEST_SOCIAL_PAGES' });

		return axios
			.post(`/api/projects/${projectId}/social-pages`, {
				socialNetwork,
				socialPageIds,
			})
			.then(response => {
				dispatch({
					type: 'CONNECT_SOCIAL_PAGES',
					payload: {
						projectId,
						socialPages: response.data,
					},
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

export const updateSocialPage = (projectId, socialPageId) => {
	return dispatch => {
		dispatch({ type: 'REQUEST_SOCIAL_PAGES' });

		return axios
			.get(`/api/projects/${projectId}/social-pages/${socialPageId}/update`)
			.then(response => {
				dispatch({
					type: 'UPDATE_SOCIAL_PAGE',
					payload: {
						projectId,
						socialPageId,
						newValues: response.data,
					},
				});

				return Promise.resolve();
			})
			.catch(error => {
				console.error(error);

				return Promise.resolve();
			});
	};
};

export const disconnectSocialPage = (projectId, socialPageId) => {
	return dispatch => {
		dispatch({ type: 'REQUEST_SOCIAL_PAGES' });

		return axios
			.delete(`/api/projects/${projectId}/social-pages/${socialPageId}`)
			.then(() => {
				dispatch({
					type: 'DISCONNECT_SOCIAL_PAGE',
					payload: {
						projectId,
						socialPageId,
					},
				});

				return Promise.resolve();
			})
			.catch(error => {
				console.error(error);
			});
	};
};

export const memberInvitation = (projectId, values) => {
	return dispatch => {
		dispatch({ type: 'REQUEST_MEMBERS' });

		return axios
			.post(`/api/projects/${projectId}/members`, values)
			.then(response => {
				dispatch({
					type: 'MEMBER_INVITATION',
					payload: {
						projectId,
						members: response.data,
					},
				});

				return Promise.resolve({ status: 'success' });
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

export const editMember = (projectId, memberId, newValues) => {
	return dispatch => {
		dispatch({ type: 'REQUEST_MEMBERS' });

		return axios
			.put(`/api/projects/${projectId}/members/${memberId}`, newValues)
			.then(() => {
				dispatch({
					type: 'EDIT_MEMBER',
					payload: {
						projectId,
						memberId,
						newValues,
					},
				});

				return Promise.resolve({ status: 'success' });
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

export const deleteMember = (projectId, memberId, memberUserId, currentUserId) => {
	return (dispatch, getState) => {
		dispatch({ type: 'REQUEST_MEMBERS' });

		return axios
			.delete(`/api/projects/${projectId}/members/${memberId}`)
			.then(async () => {
				if (memberUserId === currentUserId) {
					let {
						projects: { data: projects },
						newProjects = projects
							.filter(project => project._id !== projectId)
							.sort((projectA, projectB) => projectB.createdAt - projectA.createdAt),
						nextProjectId = newProjects.length ? newProjects[0]._id : null,
					} = getState();

					await dispatch(changeActiveProject(nextProjectId)).then(() => {
						history.push({ pathname: nextProjectId ? changeProjectCurrentUrl(nextProjectId) : '/projects' });
					});

					dispatch({
						type: 'DELETE_PROJECT',
						payload: {
							projectId,
						},
					});

					return Promise.resolve({ status: 'success', data: nextProjectId });
				}

				dispatch({
					type: 'DELETE_MEMBER',
					payload: {
						projectId,
						memberId,
					},
				});

				return Promise.resolve();
			})
			.catch(error => {
				console.error(error);
			});
	};
};

export const createTopic = (projectId, values) => {
	return dispatch => {
		dispatch({ type: 'REQUEST_TOPICS' });

		return axios
			.post(`/api/projects/${projectId}/topics`, values)
			.then(response => {
				dispatch({
					type: 'CREATE_TOPIC',
					payload: {
						projectId,
						topics: response.data,
					},
				});

				return Promise.resolve({ status: 'success' });
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

export const editTopic = (projectId, topicId, newValues) => {
	return dispatch => {
		dispatch({ type: 'REQUEST_TOPICS' });

		return axios
			.put(`/api/projects/${projectId}/topics/${topicId}`, newValues)
			.then(() => {
				dispatch({
					type: 'EDIT_TOPIC',
					payload: {
						projectId,
						topicId,
						newValues,
					},
				});

				return Promise.resolve({ status: 'success' });
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

export const deleteTopic = (projectId, topicId) => {
	return dispatch => {
		dispatch({ type: 'REQUEST_TOPICS' });

		return axios
			.delete(`/api/projects/${projectId}/topics/${topicId}`)
			.then(() => {
				dispatch({
					type: 'DELETE_TOPIC',
					payload: {
						projectId,
						topicId,
					},
				});

				return Promise.resolve();
			})
			.catch(error => {
				console.error(error);
			});
	};
};
