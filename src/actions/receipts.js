import axios from 'axios';

export const getReceiptsPosition = ({ params }) => {
	return async (dispatch, getState) => {
		const {
			user: { data: currentUser },
		} = getState();
		const studioId = currentUser.settings.studio;
		const memberId = currentUser.settings.member._id;

		return await axios
			.post('/api/getReceiptsPosition', {
				studioId,
				memberId,
				params,
			})
			.then(response => {
				const { data: receipts } = response;

				return Promise.resolve({ status: 'success', data: receipts });
			})
			.catch(error => {
				console.error(error);

				return Promise.resolve({ status: 'error' });
			});
	};
};

export const createReceipt = ({ data }) => {
	return async (dispatch, getState) => {
		const {
			user: { data: currentUser },
		} = getState();
		const studioId = currentUser.settings.studio;
		const memberId = currentUser.settings.member._id;

		return await axios
			.post('/api/createReceipt', {
				studioId,
				memberId,
				data,
			})
			.then(response => {
				const { data: receipt } = response;

				dispatch({
					type: 'CREATE_RECEIPT',
					payload: {
						receipt,
					},
				});

				return Promise.resolve({ status: 'success', data: receipt });
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

export const changeReceipt = ({ params, data }) => {
	return async (dispatch, getState) => {
		const {
			user: { data: currentUser },
		} = getState();
		const studioId = currentUser.settings.studio;
		const memberId = currentUser.settings.member._id;

		return await axios
			.post('/api/changeReceipt', {
				studioId,
				memberId,
				params,
				data,
			})
			.then(response => {
				const { data: receipt } = response;

				return Promise.resolve({ status: 'success', data: receipt });
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

export const activeReceiptAddQuantity = ({ params, data }) => {
	return async (dispatch, getState) => {
		const {
			user: { data: currentUser },
		} = getState();
		const studioId = currentUser.settings.studio;
		const memberId = currentUser.settings.member._id;
		const { positionId } = params;

		return await axios
			.post('/api/activeReceiptAddQuantity', {
				studioId,
				memberId,
				params,
				data,
			})
			.then(response => {
				const { data: position } = response;

				dispatch({
					type: 'EDIT_POSITION',
					payload: {
						positionId,
						position,
					},
				});

				return Promise.resolve({ status: 'success' });
			})
			.catch(error => {
				if (error.response) {
					return Promise.resolve({ status: 'error', message: error.response.data.message, data: error.response.data });
				} else {
					console.error(error);

					return Promise.resolve({ status: 'error' });
				}
			});
	};
};
