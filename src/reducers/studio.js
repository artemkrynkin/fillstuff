const studio = (
	state = {
		isFetching: false,
		data: null,
	},
	action
) => {
	switch (action.type) {
		case 'REQUEST_STUDIO': {
			return {
				...state,
				isFetching: true,
			};
		}
		case 'RECEIVE_STUDIO': {
			return {
				...state,
				isFetching: false,
				data: action.payload,
			};
		}
		case 'GET_STUDIO_STOCK': {
			let stateData = { ...state }.data;

			stateData.stock = action.payload;

			return {
				...state,
				isFetching: false,
				data: stateData,
			};
		}
		case 'EDIT_STUDIO': {
			let stateData = { ...state }.data;

			stateData = {
				...stateData,
				...action.payload,
			};

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

export default studio;
