const characteristics = (
	state = {
		isFetching: false,
		data: null,
		error: null,
	},
	action
) => {
	switch (action.type) {
		case 'REQUEST_CHARACTERISTICS': {
			return {
				...state,
				isFetching: true,
			};
		}
		case 'RECEIVE_CHARACTERISTICS': {
			return {
				...state,
				isFetching: false,
				data: action.payload,
			};
		}
		case 'CREATE_CHARACTERISTIC': {
			let stateData = { ...state }.data;

			stateData.push(action.payload);

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

export default characteristics;
