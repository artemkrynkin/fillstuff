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
			state.data.paging.totalCount += 1;

			return {
				...state,
				isFetching: false,
			};
		}
		case 'EDIT_PROCUREMENT': {
			if (state.data) {
				const procurementIndex = state.data.data.findIndex(procurement => procurement._id === action.payload.procurementId);

				if (!!~procurementIndex) state.data.data[procurementIndex] = action.payload.procurement;
			}

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
