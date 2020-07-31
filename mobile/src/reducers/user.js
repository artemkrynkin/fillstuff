const user = (
	state = {
		isFetching: false,
		data: null,
		isAuthorized: false,
	},
	action
) => {
	switch (action.type) {
		case 'REQUEST_USER':
			return {
				...state,
				isFetching: true,
			};
		case 'USER_LOGIN':
			return {
				...state,
				isFetching: false,
				data: action.payload,
				isAuthorized: true,
			};
		case 'USER_LOGOUT':
			return {
				...state,
				isFetching: false,
				data: null,
				isAuthorized: false,
			};
		case 'USER_RESTORE':
			return {
				...state,
				isFetching: false,
				data: action.payload,
			};
		default:
			return state;
	}
};

export default user;
