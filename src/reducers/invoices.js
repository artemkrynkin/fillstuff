const invoices = (
	state = {
		isFetching: false,
		data: null,
	},
	action
) => {
	switch (action.type) {
		case 'REQUEST_INVOICES': {
			return {
				...state,
				isFetching: true,
			};
		}
		case 'RECEIVE_INVOICES': {
			return {
				...state,
				isFetching: false,
				data: action.payload,
			};
		}
		case 'RECEIVE_MERGE_INVOICES': {
			let stateData = { ...state }.data;

			stateData.data = [...stateData.data, ...action.payload.data];
			stateData.paging = action.payload.paging;

			return {
				...state,
				isFetching: false,
				data: stateData,
			};
		}
		case 'EDIT_INVOICE': {
			let stateData;

			if (state.data) {
				stateData = { ...state }.data;

				if (stateData.data.length) {
					const invoiceIndex = stateData.data.findIndex(invoice => invoice._id === action.payload.invoiceId);

					stateData.data[invoiceIndex] = action.payload.invoice;
				}
			}

			return {
				...state,
				isFetching: false,
				data: stateData,
			};
		}
		case 'UNAUTHORIZED_USER': {
			return {
				...state,
				isFetching: false,
				error: 'unauthorized',
				data: action.payload,
			};
		}
		default:
			return state;
	}
};

export default invoices;
