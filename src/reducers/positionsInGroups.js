const positionsInGroups = (
	state = {
		isFetching: false,
		data: null,
	},
	action
) => {
	switch (action.type) {
		case 'REQUEST_POSITIONS_IN_GROUPS': {
			return {
				...state,
				isFetching: true,
			};
		}
		case 'RECEIVE_POSITIONS_IN_GROUPS': {
			return {
				...state,
				isFetching: false,
				data: action.payload,
			};
		}
		case 'CREATE_POSITION': {
			let stateData = { ...state }.data;

			stateData.push(action.payload);

			return {
				...state,
				isFetching: false,
				data: stateData,
			};
		}
		case 'EDIT_POSITION': {
			let stateData = { ...state }.data;

			if (!action.payload.position.positionGroup) {
				const positionIndex = stateData.findIndex(position => position._id === action.payload.positionId);

				stateData[positionIndex] = action.payload.position;
			} else {
				const positionGroupIndex = stateData.findIndex(positionGroup => positionGroup._id === action.payload.position.positionGroup);
				const positionIndex = stateData[positionGroupIndex].positions.findIndex(position => position._id === action.payload.positionId);

				stateData[positionGroupIndex].positions[positionIndex] = action.payload.position;
			}

			return {
				...state,
				isFetching: false,
				data: stateData,
			};
		}
		case 'ARCHIVE_POSITION': {
			let stateData = { ...state }.data;

			if (action.payload.positionGroupId) {
				const positionGroupIndex = stateData.findIndex(positionGroup => positionGroup._id === action.payload.positionGroupId);

				if (stateData[positionGroupIndex].positions.length > 2) {
					const positionIndex = stateData[positionGroupIndex].positions.findIndex(position => position._id === action.payload.positionId);

					stateData[positionGroupIndex].positions.splice(positionIndex, 1);
				} else {
					const remainingPosition = stateData[positionGroupIndex].positions.find(
						positionInGroup => positionInGroup._id !== action.payload.positionId
					);

					remainingPosition.divided = true;
					delete remainingPosition.positionGroup;

					stateData.splice(positionGroupIndex, 1);
					stateData.push(remainingPosition);
				}
			} else {
				const positionIndex = stateData.findIndex(position => position._id === action.payload.positionId);

				stateData.splice(positionIndex, 1);
			}

			return {
				...state,
				isFetching: false,
				data: stateData,
			};
		}
		case 'CREATE_POSITION_GROUP': {
			let stateData = { ...state }.data;

			stateData = stateData.filter(position => !action.payload.positions.some(positionInGroup => position._id === positionInGroup._id));

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

			stateData = stateData.filter(position => !action.payload.positionsAdded.some(positionAddedId => position._id === positionAddedId));

			const positionGroupIndex = stateData.findIndex(positionGroup => positionGroup._id === action.payload.positionGroupId);

			stateData[positionGroupIndex] = action.payload.positionGroup;

			return {
				...state,
				isFetching: false,
				data: stateData,
			};
		}
		case 'REMOVE_POSITION_FROM_GROUP': {
			let stateData = { ...state }.data;

			const positionGroupIndex = stateData.findIndex(positionGroup => positionGroup._id === action.payload.positionGroupId);

			const position = stateData[positionGroupIndex].positions.find(position => position._id === action.payload.positionId);

			position.divided = true;
			delete position.positionGroup;

			stateData.push(position);

			if (stateData[positionGroupIndex].positions.length > 2) {
				const positionIndex = stateData[positionGroupIndex].positions.findIndex(position => position._id === action.payload.positionId);

				stateData[positionGroupIndex].positions.splice(positionIndex, 1);
			} else {
				const remainingPosition = stateData[positionGroupIndex].positions.find(
					positionInGroup => positionInGroup._id === action.payload.remainingPositionId
				);

				remainingPosition.divided = true;
				delete remainingPosition.positionGroup;

				stateData.splice(positionGroupIndex, 1);
				stateData.push(remainingPosition);
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

export default positionsInGroups;
