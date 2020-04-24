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
			let stateData;

			if (state.data) {
				stateData = { ...state }.data;
				const positionIndex = stateData.findIndex(position => position._id === action.payload.positionId);

				stateData[positionIndex] = action.payload.position;
			}

			return {
				...state,
				isFetching: false,
				data: stateData,
			};
		}
		case 'ARCHIVE_POSITION': {
			let stateData;

			if (state.data) {
				stateData = { ...state }.data;
				const positionIndex = stateData.findIndex(position => position._id === action.payload.positionId);

				stateData[positionIndex] = {
					...stateData[positionIndex],
					isArchived: true,
				};
			}

			return {
				...state,
				isFetching: false,
				data: stateData,
			};
		}
		case 'CREATE_POSITION_GROUP': {
			let stateData = { ...state }.data;

			stateData.forEach(position => {
				if (action.payload.positions.some(positionInGroup => position._id === positionInGroup._id)) {
					position.positionGroup = action.payload._id;
				}
			});

			return {
				...state,
				isFetching: false,
				data: stateData,
			};
		}
		case 'ADD_POSITION_IN_GROUP': {
			let stateData = { ...state }.data;

			stateData.forEach(position => {
				if (action.payload.positionsAdded.some(positionAddedId => position._id === positionAddedId)) {
					position.positionGroup = action.payload.positionGroupId;
				}
			});

			return {
				...state,
				isFetching: false,
				data: stateData,
			};
		}
		case 'REMOVE_POSITION_FROM_GROUP': {
			let stateData;

			if (state.data) {
				stateData = { ...state }.data;

				stateData.forEach(position => {
					if (position._id === action.payload.positionId) {
						delete position.positionGroup;
					}
				});
			}

			return {
				...state,
				isFetching: false,
				data: stateData,
			};
		}
		case 'CREATE_RECEIPT': {
			let stateData;

			if (state.data) {
				stateData = { ...state }.data;
				const positionIndex = stateData.findIndex(position => position._id === action.payload.receipt.position);

				stateData[positionIndex] = {
					...stateData[positionIndex],
					activeReceipt: action.payload.receipt,
					hasReceipts: true,
					receipts: [action.payload.receipt],
				};
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

export default positions;
