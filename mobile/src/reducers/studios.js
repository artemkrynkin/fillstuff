const studios = (
	state = {
		isFetching: false,
		data: null,
		error: null,
	},
	action
) => {
	switch (action.type) {
		case 'REQUEST_STUDIOS': {
			return {
				...state,
				isFetching: true,
			};
		}
		case 'RECEIVE_STUDIOS': {
			return {
				...state,
				isFetching: false,
				data: action.payload,
			};
		}
		case 'ERROR_STUDIOS': {
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

export default studios;
