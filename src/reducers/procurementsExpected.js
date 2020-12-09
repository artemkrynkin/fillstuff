const procurementsExpected = (
	state = {
		isFetching: false,
		data: null,
		error: null,
	},
	action
) => {
	switch (action.type) {
		case 'REQUEST_PROCUREMENTS_EXPECTED': {
			return {
				...state,
				isFetching: true,
			};
		}
		case 'EMPTY_PROCUREMENTS_EXPECTED': {
			return {
				...state,
				data: null,
			};
		}
		case 'RECEIVE_PROCUREMENTS_EXPECTED': {
			return {
				...state,
				isFetching: false,
				data: action.payload,
			};
		}
		case 'CREATE_PROCUREMENT_EXPECTED': {
			let stateData = { ...state }.data;

			if (!stateData) {
				stateData = {
					data: [],
					paging: {
						totalCount: 0,
					},
				};
			}

			stateData.data.unshift(action.payload);
			stateData.paging.totalCount += 1;

			return {
				...state,
				isFetching: false,
				data: stateData,
			};
		}
		case 'EDIT_PROCUREMENT_EXPECTED': {
			let stateData;

			if (state.data) {
				stateData = { ...state }.data;
				const procurementIndex = stateData.data.findIndex(procurement => procurement._id === action.payload.procurementId);

				stateData.data[procurementIndex] = action.payload.procurement;
			}

			return {
				...state,
				isFetching: false,
				data: stateData,
			};
		}
		case 'CANCEL_PROCUREMENT_EXPECTED': {
			let stateData;

			if (state.data) {
				stateData = { ...state }.data;
				const procurementIndex = stateData.data.findIndex(procurement => procurement._id === action.payload.procurementId);

				stateData.data.splice(procurementIndex, 1);
				stateData.paging.totalCount -= 1;
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

export default procurementsExpected;
