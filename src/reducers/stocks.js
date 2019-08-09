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
		case 'REQUEST_MEMBERS': {
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
		case 'EDIT_MEMBER': {
			const stockIndex = state.data.findIndex(stock => stock._id === action.payload.stockId);
			const memberIndex = state.data[stockIndex].members.findIndex(member => member._id === action.payload.memberId);

			state.data[stockIndex].members[memberIndex].role = action.payload.newValues.role;
			state.data[stockIndex].members[memberIndex].user.name = action.payload.newValues.user.name;
			state.data[stockIndex].members[memberIndex].user.email = action.payload.newValues.user.email;
			state.data[stockIndex].members = cloneDeep(state.data[stockIndex].members);

			return {
				...state,
				isFetching: false,
			};
		}
		case 'DELETE_MEMBER': {
			const stockIndex = state.data.findIndex(stock => stock._id === action.payload.stockId);
			const memberIndex = state.data[stockIndex].members.findIndex(member => member._id === action.payload.memberId);

			state.data[stockIndex].members.splice(memberIndex, 1);
			state.data[stockIndex].members = cloneDeep(state.data[stockIndex].members);

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
