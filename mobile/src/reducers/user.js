const user = (
	state = {
		isFetching: false,
		data: null,
	},
	action
) => {
	switch (action.type) {
		case 'REQUEST_USER':
			// case 'REQUEST_USER_ACTIVE_STOCK':
			return {
				...state,
				isFetching: true,
			};
		case 'RECEIVE_USER':
			return {
				...state,
				data: action.payload,
				isFetching: false,
			};
		case 'UNAUTHORIZED_USER':
			return {
				...state,
				data: action.payload,
				isFetching: false,
				error: 'unauthorized',
			};
		// case 'RECEIVE_USER_ACTIVE_STOCK':
		// 	return {
		// 		...state,
		// 		data: {
		// 			...state.data,
		// 			activeStockId: action.payload.stockId,
		// 		},
		// 		isFetching: false,
		// 	};
		default:
			return state;
	}
};

export default user;
