const positionGroups = (
	state = {
		isFetching: false,
		data: null,
	},
	action
) => {
	switch (action.type) {
		case 'REQUEST_POSITION_GROUPS': {
			return {
				...state,
				isFetching: true,
			};
		}
		case 'EMPTY_POSITION_GROUPS': {
			return {
				...state,
				data: null,
			};
		}
		case 'RECEIVE_POSITION_GROUPS': {
			return {
				...state,
				isFetching: false,
				data: action.payload,
			};
		}
		case 'CREATE_POSITION_GROUP': {
			let stateData = { ...state }.data;

			stateData.push(action.payload);

			return {
				...state,
				isFetching: false,
				data: stateData,
			};
		}
		case 'EDIT_POSITION_GROUP': {
			let stateData = { ...state }.data;
			const positionGroupIndex = stateData.findIndex(positionGroup => positionGroup._id === action.payload.positionGroupId);

			stateData[positionGroupIndex] = action.payload.positionGroup;

			return {
				...state,
				isFetching: false,
				data: stateData,
			};
		}
		case 'ADD_POSITION_IN_GROUP': {
			let stateData = { ...state }.data;
			const positionGroupIndex = stateData.findIndex(positionGroup => positionGroup._id === action.payload.positionGroupId);

			stateData[positionGroupIndex].positions = action.payload.positionGroup.positions;

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

export default positionGroups;
