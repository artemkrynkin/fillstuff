const products = (
	state = {
		isFetching: false,
		data: null,
	},
	action
) => {
	switch (action.type) {
		case 'REQUEST_WRITE_OFFS': {
			return {
				...state,
				isFetching: true,
			};
		}
		case 'RECEIVE_WRITE_OFFS': {
			return {
				...state,
				data: action.payload,
				isFetching: false,
			};
		}
		case 'CREATE_WRITE_OFF': {
			state.data.unshift(action.payload);

			return {
				...state,
				isFetching: false,
			};
		}
		case 'DELETE_WRITE_OFF': {
			const writeOffIndex = state.data.findIndex(writeOff => writeOff._id === action.payload.writeOffId);

			state.data.splice(writeOffIndex, 1);

			return {
				...state,
				isFetching: false,
			};
		}
		// case 'EDIT_PRODUCT': {
		// 	const productIndex = state.data.findIndex(product => product._id === action.payload.productId);
		//
		// 	state.data[productIndex] = {
		// 		...state.data[productIndex],
		// 		...action.payload.newValues,
		// 	};
		//
		// 	return {
		// 		...state,
		// 		isFetching: false,
		// 	};
		// }
		// case 'DELETE_PRODUCT': {
		// 	const productIndex = state.data.findIndex(product => product._id === action.payload.productId);
		//
		// 	state.data.splice(productIndex, 1);
		//
		// 	return {
		// 		...state,
		// 		isFetching: false,
		// 	};
		// }
		case 'UNAUTHORIZED_USER': {
			return {
				...state,
				data: action.payload,
				isFetching: false,
				error: 'unauthorized',
			};
		}
		default:
			return state;
	}
};

export default products;
