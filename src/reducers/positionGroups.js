const positionGroups = (
	state = {
		isFetching: false,
		data: null,
		error: null,
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
				data: action.payload.positionGroups,
			};
		}
		case 'CREATE_POSITION_GROUP': {
			let stateData = { ...state }.data;

			stateData.push(action.payload.positionGroup);

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

			stateData[positionGroupIndex].positions.push(...action.payload.positionGroup.positions);

			return {
				...state,
				isFetching: false,
				data: stateData,
			};
		}
		case 'REMOVE_POSITION_FROM_GROUP':
		case 'ARCHIVE_POSITION': {
			let stateData = action.type === '';

			if (state.data) {
				stateData = { ...state }.data;

				if (action.payload.positionGroupId) {
					const positionNumbers = action.type === 'REMOVE_POSITION_FROM_GROUP' ? action.payload.positionGroup.positions.length : 1;
					const positionGroupIndex = stateData.findIndex(positionGroup => positionGroup._id === action.payload.positionGroupId);
					const positionGroup = stateData[positionGroupIndex];

					if (positionGroup.positions.length > positionNumbers) {
						if (action.type === 'REMOVE_POSITION_FROM_GROUP') {
							action.payload.positionGroup.positions.forEach(positionId => {
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
