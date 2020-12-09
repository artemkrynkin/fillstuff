import axios from 'axios';

export const getInvoices = (
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

		if (showRequest) dispatch({ type: 'REQUEST_INVOICES' });
		if (emptyData) dispatch({ type: 'EMPTY_INVOICES' });

		return await axios
			.post('/api/getInvoices', {
				studioId,
				memberId,
				query,
			})
			.then(response => {
				if (!mergeData) {
					dispatch({
						type: 'RECEIVE_INVOICES',
						payload: response.data,
					});
				} else {
					dispatch({
						type: 'RECEIVE_MERGE_INVOICES',
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

export const getInvoice = ({ params }) => {
	return async (dispatch, getState) => {
		const {
			user: { data: currentUser },
		} = getState();
		const studioId = currentUser.settings.studio;
		const memberId = currentUser.settings.member._id;

		return await axios
			.post('/api/getInvoice', {
				studioId,
				memberId,
				params,
			})
			.then(response => {
				const { data: invoice } = response;

				return Promise.resolve({ status: 'success', data: invoice });
			})
			.catch(error => {
				console.error(error.response);

				return Promise.resolve({ status: 'error' });
			});
	};
};

export const getMemberInvoices = ({ params }) => {
	return async (dispatch, getState) => {
		const {
			user: { data: currentUser },
		} = getState();
		const studioId = currentUser.settings.studio;
		const memberId = currentUser.settings.member._id;

		return await axios
			.post('/api/getMemberInvoices', {
				studioId,
				memberId,
				params,
			})
			.then(response => {
				const { data: invoices } = response;

				return Promise.resolve({ status: 'success', data: invoices });
			})
			.catch(error => {
				console.error(error.response);

				return Promise.resolve({ status: 'error' });
			});
	};
};

export const createInvoice = ({ params }) => {
	return async (dispatch, getState) => {
		const {
			user: { data: currentUser },
		} = getState();
		const studioId = currentUser.settings.studio;
		const memberId = currentUser.settings.member._id;

		return await axios
			.post('/api/createInvoice', {
				studioId,
				memberId,
				params,
			})
			.then(response => {
				if (!response.data.code) {
					return Promise.resolve({ status: 'success', data: response.data });
				} else {
					return Promise.resolve({ status: 'error', ...response.data });
				}
			})
			.catch(error => {
				console.error(error);

				return Promise.resolve({ status: 'error', message: error.message, ...error });
			});
	};
};

export const createInvoicePayment = ({ params, data }) => {
	return async (dispatch, getState) => {
		const {
			user: { data: currentUser },
		} = getState();
		const studioId = currentUser.settings.studio;
		const memberId = currentUser.settings.member._id;
		const { invoiceId } = params;

		return await axios
			.post('/api/createInvoicePayment', {
				studioId,
				memberId,
				params,
				data,
			})
			.then(response => {
				if (!response.data.code) {
					dispatch({
						type: 'EDIT_INVOICE',
						payload: {
							invoiceId,
							invoice: response.data,
						},
					});

					return Promise.resolve({ status: 'success' });
				} else {
					return Promise.resolve({ status: 'error', ...response.data });
				}
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
