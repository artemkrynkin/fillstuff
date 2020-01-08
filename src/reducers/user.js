const user = (
	state = {
		isFetching: false,
		data: null,
	},
	action
) => {
	switch (action.type) {
		case 'REQUEST_USER':
			return {
				...state,
				isFetching: true,
			};
		case 'RECEIVE_USER':
			return {
				...state,
				isFetching: false,
				data: action.payload,
			};
		case 'UNAUTHORIZED_USER':
			return {
				...state,
				isFetching: false,
				error: 'unauthorized',
				data: action.payload,
			};
		default:
			return state;
	}
};

export default user;
