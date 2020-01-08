// import { cloneDeep } from 'lodash';

const positions = (
	state = {
		isFetching: false,
		data: null,
	},
	action
) => {
	switch (action.type) {
		case 'REQUEST_PROCUREMENTS': {
			return {
				...state,
				isFetching: true,
			};
		}
		case 'RECEIVE_PROCUREMENTS': {
			return {
				...state,
				isFetching: false,
				data: action.payload,
			};
		}
		case 'CREATE_PROCUREMENT': {
			let stateData = { ...state }.data;

			stateData.data.unshift(action.payload);
			stateData.paging.totalCount += 1;

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
