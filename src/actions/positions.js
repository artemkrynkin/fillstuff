import axios from 'axios';

export const getPositions = ({ showRequest } = { showRequest: true }) => {
	return async (dispatch, getState) => {
		const studioId = getState().studio.data._id;
		const memberId = getState().member.data._id;

		if (showRequest) dispatch({ type: 'REQUEST_POSITIONS' });

		return await axios
			.post('/api/getPositions', {
				studioId,
				memberId,
			})
			.then(response => {
				dispatch({
					type: 'RECEIVE_POSITIONS',
					payload: response.data,
				});
			})
			.catch(error => {
				console.error(error.response);

				return Promise.resolve({ status: 'error' });
			});
	};
};

export const createPosition = ({ data }) => {
	return async (dispatch, getState) => {
		const studioId = getState().studio.data._id;
		const memberId = getState().member.data._id;

		return await axios
			.post('/api/createPosition', {
				studioId,
				memberId,
				data,
			})
			.then(response => {
				dispatch({
					type: 'CREATE_POSITION',
					payload: response.data,
				});

				return Promise.resolve({ status: 'success', data: response.data });
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

export const createPositionReceipt = ({ data }) => {
	return async (dispatch, getState) => {
		const studioId = getState().studio.data._id;
		const memberId = getState().member.data._id;

		return await axios
			.post('/api/createPositionWithReceipt', {
				studioId,
				memberId,
				data,
			})
			.then(response => {
				dispatch({
					type: 'CREATE_POSITION',
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

export const editPosition = ({ params, data }) => {
	return async (dispatch, getState) => {
		const studioId = getState().studio.data._id;
		const memberId = getState().member.data._id;
		const { positionId } = params;

		return await axios
			.post('/api/editPosition', {
				studioId,
				memberId,
				params,
				data,
			})
			.then(response => {
				dispatch({
					type: 'EDIT_POSITION',
					payload: {
						positionId,
						position: response.data,
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

export const editPositionReceipt = ({ params, data }) => {
	return async (dispatch, getState) => {
		const studioId = getState().studio.data._id;
		const memberId = getState().member.data._id;
		const { positionId } = params;

		return await axios
			.post('/api/editPositionWithReceipt', {
				studioId,
				memberId,
				params,
				data,
			})
			.then(response => {
				dispatch({
					type: 'EDIT_POSITION',
					payload: {
						positionId,
						position: response.data,
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

export const addQuantityInPosition = ({ params, data }) => {
	return async (dispatch, getState) => {
		const studioId = getState().studio.data._id;
		const memberId = getState().member.data._id;
		const { positionId } = params;

		return await axios
			.post('/api/positionReceiptAddQuantity', {
				studioId,
				memberId,
				params,
				data,
			})
			.then(response => {
				dispatch({
					type: 'EDIT_POSITION',
					payload: {
						positionId,
						position: response.data,
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
