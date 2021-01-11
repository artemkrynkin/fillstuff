import { axiosFillstuff } from 'src/api/constants';

export const getProcurementsExpected = (
	{ showRequest = true, mergeData = false, emptyData = false } = {
		showRequest: true,
		mergeData: false,
		emptyData: false,
	}
) => {
	return async (dispatch, getState) => {
		const {
			user: { data: currentUser },
		} = getState();
		const studioId = currentUser.settings.studio;
		const memberId = currentUser.settings.member._id;

		if (showRequest) dispatch({ type: 'REQUEST_PROCUREMENTS_EXPECTED' });
		if (emptyData) dispatch({ type: 'EMPTY_PROCUREMENTS_EXPECTED' });

		return await axiosFillstuff
			.post('/api/getProcurementsExpected', {
				studioId,
				memberId,
			})
			.then(response => {
				if (!mergeData) {
					dispatch({
						type: 'RECEIVE_PROCUREMENTS_EXPECTED',
						payload: response.data,
					});
				} else {
					dispatch({
						type: 'RECEIVE_MERGE_PROCUREMENTS_EXPECTED',
						payload: response.data,
					});
				}

				return Promise.resolve({ status: 'success' });
			})
			.catch(error => {
				console.error(error.response);

				return Promise.resolve({ status: 'error' });
			});
	};
};

export const getProcurementExpected = ({ params }) => {
	return async (dispatch, getState) => {
		const {
			user: { data: currentUser },
		} = getState();
		const studioId = currentUser.settings.studio;
		const memberId = currentUser.settings.member._id;

		return await axiosFillstuff
			.post('/api/getProcurementExpected', {
				studioId,
				memberId,
				params,
			})
			.then(response => {
				const { data: procurement } = response;

				return Promise.resolve({ status: 'success', data: procurement });
			})
			.catch(error => {
				console.error(error.response);

				return Promise.resolve({ status: 'error' });
			});
	};
};

export const createProcurementExpected = ({ data }) => {
	return async (dispatch, getState) => {
		const {
			user: { data: currentUser },
		} = getState();
		const studioId = currentUser.settings.studio;
		const memberId = currentUser.settings.member._id;

		return await axiosFillstuff
			.post('/api/createProcurementExpected', {
				studioId,
				memberId,
				data,
			})
			.then(response => {
				const { data: procurement } = response;

				dispatch({
					type: 'CREATE_PROCUREMENT_EXPECTED',
					payload: procurement,
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

export const editProcurementExpected = ({ params, data }) => {
	return async (dispatch, getState) => {
		const {
			user: { data: currentUser },
		} = getState();
		const studioId = currentUser.settings.studio;
		const memberId = currentUser.settings.member._id;
		const { procurementId } = params;

		return await axiosFillstuff
			.post('/api/editProcurementExpected', {
				studioId,
				memberId,
				params,
				data,
			})
			.then(response => {
				const procurement = response.data;

				dispatch({
					type: 'EDIT_PROCUREMENT_EXPECTED',
					payload: {
						procurementId,
						procurement,
					},
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

export const cancelProcurementExpected = ({ params }) => {
	return async (dispatch, getState) => {
		const {
			user: { data: currentUser },
		} = getState();
		const studioId = currentUser.settings.studio;
		const memberId = currentUser.settings.member._id;
		const { procurementId } = params;

		return await axiosFillstuff
			.post('/api/cancelProcurementExpected', {
				studioId,
				memberId,
				params,
			})
			.then(() => {
				dispatch({
					type: 'CANCEL_PROCUREMENT_EXPECTED',
					payload: {
						procurementId,
					},
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

export const getProcurementsReceived = (
	{ query, showRequest = true, mergeData = false, emptyData = false } = {
		showRequest: true,
		mergeData: false,
		emptyData: false,
	}
) => {
	return async (dispatch, getState) => {
		const {
			user: { data: currentUser },
		} = getState();
		const studioId = currentUser.settings.studio;
		const memberId = currentUser.settings.member._id;

		if (showRequest) dispatch({ type: 'REQUEST_PROCUREMENTS_RECEIVED' });
		if (emptyData) dispatch({ type: 'EMPTY_PROCUREMENTS_RECEIVED' });

		return await axiosFillstuff
			.post('/api/getProcurementsReceived', {
				studioId,
				memberId,
				query,
			})
			.then(response => {
				if (!mergeData) {
					dispatch({
						type: 'RECEIVE_PROCUREMENTS_RECEIVED',
						payload: response.data,
					});
				} else {
					dispatch({
						type: 'RECEIVE_MERGE_PROCUREMENTS_RECEIVED',
						payload: response.data,
					});
				}

				return Promise.resolve({ status: 'success' });
			})
			.catch(error => {
				console.error(error.response);

				return Promise.resolve({ status: 'error' });
			});
	};
};

export const getProcurementReceived = ({ params }) => {
	return async (dispatch, getState) => {
		const {
			user: { data: currentUser },
		} = getState();
		const studioId = currentUser.settings.studio;
		const memberId = currentUser.settings.member._id;

		return await axiosFillstuff
			.post('/api/getProcurementReceived', {
				studioId,
				memberId,
				params,
			})
			.then(response => {
				const { data: procurement } = response;

				return Promise.resolve({ status: 'success', data: procurement });
			})
			.catch(error => {
				console.error(error.response);

				return Promise.resolve({ status: 'error' });
			});
	};
};

export const createProcurementReceived = ({ data }) => {
	return async (dispatch, getState) => {
		const {
			user: { data: currentUser },
		} = getState();
		const studioId = currentUser.settings.studio;
		const memberId = currentUser.settings.member._id;

		return await axiosFillstuff
			.post('/api/createProcurementReceived', {
				studioId,
				memberId,
				data,
			})
			.then(response => {
				const { data: procurement } = response;

				dispatch({
					type: 'CREATE_PROCUREMENT_RECEIVED',
					payload: procurement,
				});

				if (data.procurement.status === 'expected' && procurement.status === 'received') {
					dispatch({
						type: 'CANCEL_PROCUREMENT_EXPECTED',
						payload: {
							procurementId: procurement._id,
						},
					});
				}

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
