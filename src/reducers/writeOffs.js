const writeOffs = (
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

export default writeOffs;
