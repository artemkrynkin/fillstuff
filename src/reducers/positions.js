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
		case 'EMPTY_POSITIONS': {
			return {
				...state,
				data: null,
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
				const childOrParentPositionId = action.payload.position.childPosition || action.payload.position.parentPosition;

				stateData[positionIndex] = action.payload.position;

				if (childOrParentPositionId) {
					const childOrParentPosition = stateData.find(position => position._id === childOrParentPositionId);

					childOrParentPosition.name = action.payload.position.name;
				}
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
		case 'ARCHIVE_POSITION_AFTER_ENDED': {
			let stateData;

			if (state.data) {
				stateData = { ...state }.data;
				const positionIndex = stateData.findIndex(position => position._id === action.payload.positionId);

				stateData[positionIndex] = action.payload.position;

				stateData.forEach(position => {
					if (position.childPosition === action.payload.positionId) {
						delete position.childPosition;
					}
				});
			}

			return {
				...state,
				isFetching: false,
				data: stateData,
			};
		}
		case 'CREATE_POSITION_GROUP':
		case 'ADD_POSITION_IN_GROUP':
		case 'REMOVE_POSITION_FROM_GROUP': {
			let stateData;

			if (state.data) {
				stateData = { ...state }.data;

				stateData.forEach(position => {
					if (action.payload.positions.some(positionIdInGroup => positionIdInGroup === position._id)) {
						if (/^(CREATE_POSITION_GROUP|ADD_POSITION_IN_GROUP)$/.test(action.type)) {
							position.positionGroup = action.payload._id;
						} else {
							delete position.positionGroup;
						}
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
