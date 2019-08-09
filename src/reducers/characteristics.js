const characteristics = (
	state = {
		isFetching: false,
		data: null,
	},
	action
) => {
	switch (action.type) {
		case 'REQUEST_SPECIFICATIONS': {
			return {
				...state,
				isFetching: true,
			};
		}
		case 'RECEIVE_SPECIFICATIONS': {
			return {
				...state,
				data: action.payload,
				isFetching: false,
			};
		}
		case 'CREATE_SPECIFICATION': {
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

export default characteristics;
