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
		case 'CREATE_STUDIO': {
			let stateData = { ...state }.data;

			stateData.data.push(action.payload.studio);

			stateData.paging.total += 1;

			return {
				...state,
				isFetching: false,
				data: stateData,
			};
		}
		case 'EDIT_STUDIO': {
			let stateData;

			if (state.data) {
				stateData = { ...state }.data;
				const studioIndex = stateData.data.findIndex(studio => studio._id === action.payload.studioId);

				stateData.data[studioIndex] = action.payload.studio;
			}

			return {
				...state,
				isFetching: false,
				data: stateData,
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
