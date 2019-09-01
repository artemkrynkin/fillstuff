// import { cloneDeep } from 'lodash';

const positions = (
	state = {
		isFetching: false,
		data: null,
	},
	action
) => {
	switch (action.type) {
		case 'REQUEST_POSITIONS': {
			return {
				...state,
				isFetching: true,
			};
		}
		case 'RECEIVE_POSITIONS': {
			return {
				...state,
				data: action.payload,
				isFetching: false,
			};
		}
		case 'CREATE_POSITION': {
			state.data.push(action.payload);

			return {
				...state,
				isFetching: false,
			};
		}
		case 'EDIT_POSITION': {
			if (!action.payload.position.positionGroup) {
				const positionIndex = state.data.findIndex(position => position._id === action.payload.positionId);

				state.data[positionIndex] = action.payload.position;
			} else {
				const positionGroupIndex = state.data.findIndex(positionGroup => positionGroup._id === action.payload.positionGroupId);
				const positionIndex = state.data[positionGroupIndex].positions.findIndex(position => position._id === action.payload.positionId);

				state.data[positionGroupIndex].positions[positionIndex] = action.payload.position;
			}

			return {
				...state,
				isFetching: false,
			};
		}
		case 'REMOVE_FROM_GROUP_POSITION': {
			const positionGroupIndex = state.data.findIndex(positionGroup => positionGroup._id === action.payload.positionGroupId);

			const position = state.data[positionGroupIndex].positions.find(position => position._id === action.payload.positionId);

			position.divided = true;
			delete position.positionGroup;

			state.data.push(position);

			if (state.data[positionGroupIndex].positions.length > 2) {
				const positionIndex = state.data[positionGroupIndex].positions.findIndex(position => position._id === action.payload.positionId);

				state.data[positionGroupIndex].positions.splice(positionIndex, 1);
			} else {
				const remainingPosition = state.data[positionGroupIndex].positions.find(
					positionInGroup => positionInGroup._id !== action.payload.positionId
				);

				remainingPosition.divided = true;
				delete remainingPosition.positionGroup;

				state.data.splice(positionGroupIndex, 1);
				state.data.push(remainingPosition);
			}

			return {
				...state,
				isFetching: false,
			};
		}
		case 'ARCHIVE_POSITION': {
			if (action.payload.positionGroupId) {
				const positionGroupIndex = state.data.findIndex(positionGroup => positionGroup._id === action.payload.positionGroupId);

				if (state.data[positionGroupIndex].positions.length > 2) {
					const positionIndex = state.data[positionGroupIndex].positions.findIndex(position => position._id === action.payload.positionId);

					state.data[positionGroupIndex].positions.splice(positionIndex, 1);
				} else {
					const remainingPosition = state.data[positionGroupIndex].positions.find(
						positionInGroup => positionInGroup._id !== action.payload.positionId
					);

					remainingPosition.divided = true;
					delete remainingPosition.positionGroup;

					state.data.splice(positionGroupIndex, 1);
					state.data.push(remainingPosition);
				}
			} else {
				const positionIndex = state.data.findIndex(position => position._id === action.payload.positionId);

				state.data.splice(positionIndex, 1);
			}

			return {
				...state,
				isFetching: false,
			};
		}
		case 'CREATE_POSITION_GROUP': {
			state.data = state.data.filter(position => !action.payload.positions.some(positionInGroup => position._id === positionInGroup._id));

			state.data.push(action.payload);

			return {
				...state,
				isFetching: false,
			};
		}
		case 'EDIT_POSITION_GROUP': {
			const positionGroupIndex = state.data.findIndex(positionGroup => positionGroup._id === action.payload.positionGroupId);

			state.data[positionGroupIndex] = action.payload.positionGroup;

			return {
				...state,
				isFetching: false,
			};
		}
		case 'ADD_POSITION_IN_POSITION_GROUP': {
			state.data = state.data.filter(position => !action.payload.positionsAdded.some(positionAddedId => position._id === positionAddedId));

			const positionGroupIndex = state.data.findIndex(positionGroup => positionGroup._id === action.payload.positionGroupId);

			state.data[positionGroupIndex] = action.payload.positionGroup;

			return {
				...state,
				isFetching: false,
			};
		}
		// case 'EDIT_POSITION_GROUP': {
		// 	const productIndex = state.data.findIndex(product => product._id === action.payload.productId);
		// 	const markerIndex = state.data[productIndex].markers.findIndex(marker => marker._id === action.payload.markerId);
		//
		// 	state.data[productIndex].markers[markerIndex] = action.payload.marker;
		// 	state.data[productIndex].markers = cloneDeep(state.data[productIndex].markers);
		//
		// 	if (!state.data[productIndex].dividedMarkers) {
		// 		state.data[productIndex].quantity = state.data[productIndex].markers.reduce((sum, marker) => sum + marker.quantity, 0);
		// 	}
		//
		// 	return {
		// 		...state,
		// 		isFetching: false,
		// 	};
		// }
		// case 'ARCHIVE_MARKER': {
		// 	const productIndex = state.data.findIndex(product => product._id === action.payload.productId);
		// 	const markerIndex = state.data[productIndex].markers.findIndex(marker => marker._id === action.payload.markerId);
		//
		// 	state.data[productIndex].markers.splice(markerIndex, 1);
		// 	state.data[productIndex].markers = cloneDeep(state.data[productIndex].markers);
		//
		// 	if (!state.data[productIndex].dividedMarkers) {
		// 		state.data[productIndex].quantity = state.data[productIndex].markers.reduce((sum, marker) => sum + marker.quantity, 0);
		// 	}
		//
		// 	return {
		// 		...state,
		// 		isFetching: false,
		// 	};
		// }
		case 'UNAUTHORIZED_USER': {
			return {
				...state,
				data: action.payload,
				isFetching: false,
				error: 'unauthorized',
			};
		}
		default:
			return state;
	}
};

export default positions;
