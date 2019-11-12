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
				data: action.payload,
				isFetching: false,
			};
		}
		case 'CREATE_PROCUREMENT': {
			state.data.data.unshift(action.payload);

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
