const user = (
	state = {
		isFetching: false,
		data: null,
		error: null,
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
		case 'ERROR_USER': {
			return {
				...state,
				isFetching: false,
				error: action.payload,
			};
		}
		default:
			return state;
	}
};

export default user;
