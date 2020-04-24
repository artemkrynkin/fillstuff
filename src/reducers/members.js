const members = (
	state = {
		isFetching: false,
		data: null,
	},
	action
) => {
	switch (action.type) {
		case 'REQUEST_MEMBERS':
			return {
				...state,
				isFetching: true,
			};
		case 'EMPTY_MEMBERS': {
			return {
				...state,
				data: null,
			};
		}
		case 'RECEIVE_MEMBERS':
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

export default members;
