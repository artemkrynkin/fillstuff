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
		case 'REQUEST_CATEGORIES': {
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
		case 'CREATE_CATEGORY': {
			const stockIndex = state.data.findIndex(stock => stock._id === action.payload.stockId);

			state.data[stockIndex].categories = action.payload.categories;
			state.data[stockIndex] = cloneDeep(state.data[stockIndex]);

			return {
				...state,
				isFetching: false,
			};
		}
		case 'EDIT_CATEGORY': {
			const stockIndex = state.data.findIndex(stock => stock._id === action.payload.stockId);
			const categoryIndex = state.data[stockIndex].categories.findIndex(category => category._id === action.payload.categoryId);

			state.data[stockIndex].categories[categoryIndex] = action.payload.newValues;
			state.data[stockIndex] = cloneDeep(state.data[stockIndex]);

			return {
				...state,
				isFetching: false,
			};
		}
		case 'DELETE_CATEGORY': {
			const stockIndex = state.data.findIndex(stock => stock._id === action.payload.stockId);
			const categoryIndex = state.data[stockIndex].categories.findIndex(category => category._id === action.payload.categoryId);

			state.data[stockIndex].categories.splice(categoryIndex, 1);
			state.data[stockIndex] = cloneDeep(state.data[stockIndex]);

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
