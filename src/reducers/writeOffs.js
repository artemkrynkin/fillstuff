const products = (
	state = {
		isFetching: false,
		data: null,
	},
	action
) => {
	switch (action.type) {
		case 'REQUEST_WRITE_OFFS': {
			return {
				...state,
				isFetching: true,
			};
		}
		case 'RECEIVE_WRITE_OFFS': {
			return {
				...state,
				isFetching: false,
				data: action.payload,
			};
		}
		case 'CREATE_WRITE_OFF': {
			let stateData = { ...state }.data;

			stateData.unshift(action.payload);
			stateData.paging.totalCount += 1;

			return {
				...state,
				isFetching: false,
				data: stateData,
			};
		}
		case 'CANCEL_WRITE_OFF': {
			let stateData = { ...state }.data;
			const writeOffIndex = stateData.data.findIndex(writeOff => writeOff._id === action.payload.writeOffId);

			stateData.data[writeOffIndex] = action.payload.writeOff;

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

export default products;
