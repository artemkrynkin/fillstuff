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
			const positionIndex = state.data.findIndex(position => position._id === action.payload.positionId);

			state.data[positionIndex] = action.payload.position;

			return {
				...state,
				isFetching: false,
			};
		}
		case 'ARCHIVE_POSITION': {
			const positionIndex = state.data.findIndex(position => position._id === action.payload.positionId);

			state.data.splice(positionIndex, 1);

			return {
				...state,
				isFetching: false,
			};
		}
		case 'CREATE_POSITION_GROUP': {
			state.data = state.data.map(position => {
				if (action.payload.positions.some(positionInGroup => position._id === positionInGroup._id)) {
					position.positionGroup = action.payload._id;
					position.divided = action.payload.divided;
				}

				return position;
			});

			return {
				...state,
				isFetching: false,
			};
		}
		case 'ADD_POSITION_IN_GROUP': {
			state.data = state.data.map(position => {
				if (action.payload.positionsAdded.some(positionAddedId => position._id === positionAddedId)) {
					position.positionGroup = action.payload.positionGroupId;
					position.divided = action.payload.positionGroup.divided;
				}

				return position;
			});

			return {
				...state,
				isFetching: false,
			};
		}
		case 'REMOVE_POSITION_FROM_GROUP': {
			state.data = state.data.map(position => {
				if (
					position._id === action.payload.positionId ||
					(action.payload.remainingPositionId && position._id === action.payload.remainingPositionId)
				) {
					position.divided = true;
					delete position.positionGroup;
				}

				return position;
			});

			return {
				...state,
				isFetching: false,
			};
		}
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
