const user = (
	state = {
		isFetching: false,
		data: null,
		error: null,
	},
	action
) => {
	switch (action.type) {
		case 'REQUEST_USER': {
			return {
				...state,
				isFetching: true,
			};
		}
		case 'RECEIVE_USER': {
			let stateData = action.payload;

			console.log(1);

			if (stateData && ~stateData.picture.indexOf('localhost') && __DEV__) {
				stateData.picture = stateData.picture.replace('localhost', '192.168.0.144');
			}

			return {
				...state,
				isFetching: false,
				data: stateData,
			};
		}
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
