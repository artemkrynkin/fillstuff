const positions = (
	state = {
		isFetching: false,
		data: null,
		error: null,
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
				data: action.payload.positions,
			};
		}
		case 'CREATE_POSITION': {
			let stateData = { ...state }.data;

			stateData.push(action.payload.position);
			stateData.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

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
		case 'DETACH_POSITION': {
			let stateData;

			if (state.data) {
				stateData = { ...state }.data;
				const positionIndex = stateData.findIndex(position => position._id === action.payload.positionId);

				stateData[positionIndex] = action.payload.position;

				stateData.forEach(position => {
					if ((position.childPosition || position.parentPosition) === action.payload.positionId) {
						if (position.parentPosition) delete position.archivedAfterEnded;
						delete position[position.childPosition ? 'childPosition' : 'parentPosition'];
					}
				});
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
				const archivedPosition = stateData.find(position => position._id === action.payload.positionId);

				archivedPosition.isArchived = true;

				delete archivedPosition.archivedAfterEnded;
				delete archivedPosition.childPosition;
				delete archivedPosition.parentPosition;
				delete archivedPosition.positionGroup;

				stateData.forEach(position => {
					if ((position.childPosition || position.parentPosition) === action.payload.positionId) {
						delete position[position.childPosition ? 'childPosition' : 'parentPosition'];
					}
				});
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
					if (action.payload.positionGroup.positions.some(positionIdInGroup => positionIdInGroup === position._id)) {
						if (/^(CREATE_POSITION_GROUP|ADD_POSITION_IN_GROUP)$/.test(action.type)) {
							position.positionGroup = action.payload.positionGroup._id;
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
