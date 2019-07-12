import { cloneDeep } from 'lodash';

const stocks = (
	state = {
		isFetching: false,
		data: null,
	},
	action
) => {
	switch (action.type) {
		case 'REQUEST_STOCKS':
		case 'REQUEST_MEMBERS':
		case 'REQUEST_PRODUCT_SHOPS':
		case 'REQUEST_PRODUCT_SPECIFICATIONS': {
			return {
				...state,
				isFetching: true,
			};
		}
		case 'RECEIVE_STOCKS': {
			return {
				...state,
				data: action.payload,
				isFetching: false,
			};
		}
		case 'GET_STOCK_STATUS': {
			const stockIndex = state.data.findIndex(stock => stock._id === action.payload.stockId);

			state.data[stockIndex] = {
				...state.data[stockIndex],
				status: action.payload.status,
			};

			return {
				...state,
				isFetching: false,
			};
		}
		// case 'CREATE_STOCK': {
		// 	state.data.push(action.payload);
		//
		// 	return {
		// 		...state,
		// 		isFetching: false,
		// 	};
		// }
		case 'EDIT_STOCK': {
			const stockIndex = state.data.findIndex(stock => stock._id === action.payload.stockId);

			state.data[stockIndex] = {
				...state.data[stockIndex],
				...action.payload.newValues,
			};

			return {
				...state,
				isFetching: false,
			};
		}
		// case 'DELETE_STOCK': {
		// 	const stockIndex = state.data.findIndex(stock => stock._id === action.payload.stockId);
		//
		// 	state.data.splice(stockIndex, 1);
		//
		// 	return {
		// 		...state,
		// 		isFetching: false,
		// 	};
		// }
		case 'MEMBER_INVITATION': {
			const stockIndex = state.data.findIndex(stock => stock._id === action.payload.stockId);

			state.data[stockIndex].members = action.payload.members;
			state.data[stockIndex] = cloneDeep(state.data[stockIndex]);

			return {
				...state,
				isFetching: false,
			};
		}
		case 'EDIT_MEMBER': {
			const stockIndex = state.data.findIndex(stock => stock._id === action.payload.stockId);
			const memberIndex = state.data[stockIndex].members.findIndex(member => member._id === action.payload.memberId);

			state.data[stockIndex].members[memberIndex].role = action.payload.newValues.role;
			state.data[stockIndex] = cloneDeep(state.data[stockIndex]);

			return {
				...state,
				isFetching: false,
			};
		}
		case 'DELETE_MEMBER': {
			const stockIndex = state.data.findIndex(stock => stock._id === action.payload.stockId);
			const memberIndex = state.data[stockIndex].members.findIndex(member => member._id === action.payload.memberId);

			state.data[stockIndex].members.splice(memberIndex, 1);
			state.data[stockIndex] = cloneDeep(state.data[stockIndex]);

			return {
				...state,
				isFetching: false,
			};
		}
		case 'CREATE_PRODUCT_SHOP': {
			const stockIndex = state.data.findIndex(stock => stock._id === action.payload.stockId);

			state.data[stockIndex].productShops.push(action.payload.shop);
			state.data[stockIndex].productShops = cloneDeep(state.data[stockIndex].productShops);

			return {
				...state,
				isFetching: false,
			};
		}
		case 'CREATE_PRODUCT_SPECIFICATION': {
			const stockIndex = state.data.findIndex(stock => stock._id === action.payload.stockId);

			state.data[stockIndex].productSpecifications[action.payload.schemaName].push(action.payload.specification);
			state.data[stockIndex].productSpecifications = cloneDeep(state.data[stockIndex].productSpecifications);

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

export default stocks;
