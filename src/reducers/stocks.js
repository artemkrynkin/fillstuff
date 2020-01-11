const stocks = (
	state = {
		isFetching: false,
		data: null,
	},
	action
) => {
	switch (action.type) {
		case 'REQUEST_STOCKS': {
			return {
				...state,
				isFetching: true,
			};
		}
		case 'RECEIVE_STOCKS': {
			return {
				...state,
				isFetching: false,
				data: action.payload,
			};
		}
		case 'GET_STOCK_STATUS': {
			let stateData = { ...state }.data;

			const stockIndex = stateData.findIndex(stock => stock._id === action.payload.stockId);

			stateData[stockIndex] = {
				...stateData[stockIndex],
				status: action.payload.status,
			};

			return {
				...state,
				isFetching: false,
				data: stateData,
			};
		}
		case 'EDIT_STOCK': {
			let stateData = { ...state }.data;

			const stockIndex = stateData.findIndex(stock => stock._id === action.payload.stockId);

			stateData[stockIndex] = {
				...stateData[stockIndex],
				...action.payload.newValues,
			};

			return {
				...state,
				isFetching: false,
				data: stateData,
			};
		}
		// case 'EDIT_MEMBER': {
		// 	let stateData = { ...state }.data;
		//
		// 	const stockIndex = stateData.findIndex(stock => stock._id === action.payload.stockId);
		// 	const memberIndex = stateData[stockIndex].members.findIndex(member => member._id === action.payload.memberId);
		//
		// 	stateData[stockIndex].members[memberIndex] = action.payload.newValues;
		// 	stateData[stockIndex].members = cloneDeep(stateData[stockIndex].members);
		//
		// 	return {
		// 		...state,
		// 		isFetching: false,
		// 		data: stateData,
		// 	};
		// }
		// case 'DELETE_MEMBER': {
		// 	let stateData = { ...state }.data;
		//
		// 	const stockIndex = stateData.findIndex(stock => stock._id === action.payload.stockId);
		// 	const memberIndex = stateData[stockIndex].members.findIndex(member => member._id === action.payload.memberId);
		//
		// 	stateData[stockIndex].members.splice(memberIndex, 1);
		// 	stateData[stockIndex].members = cloneDeep(stateData[stockIndex].members);
		//
		// 	return {
		// 		...state,
		// 		isFetching: false,
		// 		data: stateData,
		// 	};
		// }
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

export default stocks;
