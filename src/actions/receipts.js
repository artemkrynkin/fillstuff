import axios from 'axios';

export const getReceiptsPosition = ({ params }) => {
	return async (dispatch, getState) => {
		const studioId = getState().studio.data._id;
		const memberId = getState().member.data._id;

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
				if (error.response) {
					return Promise.resolve({ status: 'error', data: error.response.data });
				} else {
					console.error(error);

					return Promise.resolve({ status: 'error' });
				}
			});
	};
};

export const createReceipt = ({ data }) => {
	return async (dispatch, getState) => {
		const studioId = getState().studio.data._id;
		const memberId = getState().member.data._id;

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
					return Promise.resolve({ status: 'error', data: error.response.data });
				} else {
					console.error(error);

					return Promise.resolve({ status: 'error' });
				}
			});
	};
};

export const changeReceipt = ({ params, data }) => {
	return async (dispatch, getState) => {
		const studioId = getState().studio.data._id;
		const memberId = getState().member.data._id;

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
					return Promise.resolve({ status: 'error', data: error.response.data });
				} else {
					console.error(error);

					return Promise.resolve({ status: 'error' });
				}
			});
	};
};

export const activeReceiptAddQuantity = ({ params, data }) => {
	return async (dispatch, getState) => {
		const studioId = getState().studio.data._id;
		const memberId = getState().member.data._id;
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
					return Promise.resolve({ status: 'error', data: error.response.data });
				} else {
					console.error(error);

					return Promise.resolve({ status: 'error' });
				}
			});
	};
};
