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
			const positionGroupIndex = stateData.findIndex(positionGroup => positionGroup._id === action.payload._id);

			stateData[positionGroupIndex] = action.payload;

			return {
				...state,
				isFetching: false,
				data: stateData,
			};
		}
		case 'ADD_POSITION_IN_GROUP': {
			let stateData = { ...state }.data;
			const positionGroupIndex = stateData.findIndex(positionGroup => positionGroup._id === action.payload._id);

			stateData[positionGroupIndex].positions.push(...action.payload.positions);

			return {
				...state,
				isFetching: false,
				data: stateData,
			};
		}
		case 'REMOVE_POSITION_FROM_GROUP':
		case 'ARCHIVE_POSITION': {
			let stateData;

			if (state.data) {
				stateData = { ...state }.data;

				const positionNumbers = action.type === 'REMOVE_POSITION_FROM_GROUP' ? action.payload.positions.length : 1;
				const positionGroupIndex = stateData.findIndex(positionGroup => positionGroup._id === action.payload._id);
				const positionGroup = stateData[positionGroupIndex];

				if (positionGroup.positions.length > positionNumbers) {
					if (action.type === 'REMOVE_POSITION_FROM_GROUP') {
						action.payload.positions.forEach(positionId => {
							const positionIndex = positionGroup.positions.findIndex(positionIdInGroup => positionIdInGroup === positionId);

							positionGroup.positions.splice(positionIndex, 1);
						});
					} else {
						const positionIndex = positionGroup.positions.findIndex(positionIdInGroup => positionIdInGroup === action.payload.positionId);

						positionGroup.positions.splice(positionIndex, 1);
					}
				} else {
					stateData.splice(positionGroupIndex, 1);
				}
			}

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
