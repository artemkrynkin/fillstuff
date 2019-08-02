const manufacturers = (
	state = {
		isFetching: false,
		data: null,
	},
	action
) => {
	switch (action.type) {
		case 'REQUEST_MANUFACTURERS': {
			return {
				...state,
				isFetching: true,
			};
		}
		case 'RECEIVE_MANUFACTURERS': {
			return {
				...state,
				data: action.payload,
				isFetching: false,
			};
		}
		case 'CREATE_MANUFACTURER': {
			state.data.push(action.payload);

			return {
				...state,
				isFetching: false,
			};
		}
		default:
			return state;
	}
};

export default manufacturers;
