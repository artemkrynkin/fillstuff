const writeOffs = (
	state = {
		isFetching: false,
		data: null,
		error: null,
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
		case 'EMPTY_WRITE_OFFS': {
			return {
				...state,
				data: null,
			};
		}
		case 'RECEIVE_WRITE_OFFS': {
			return {
				...state,
				isFetching: false,
				data: action.payload,
			};
		}
		case 'RECEIVE_MERGE_WRITE_OFFS': {
			let stateData = { ...state }.data;

			stateData.data = [...stateData.data, ...action.payload.data];
			stateData.paging = action.payload.paging;

			return {
				...state,
				isFetching: false,
				data: stateData,
			};
		}
		case 'ERROR_WRITE_OFFS': {
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

export default writeOffs;
