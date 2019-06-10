const user = (
	state = {
		isFetching: false,
		data: null,
	},
	action
) => {
	switch (action.type) {
		case 'REQUEST_USER':
		case 'REQUEST_USER_NOTIFICATIONS':
		case 'REQUEST_USER_ACTIVE_PROJECT':
			return {
				...state,
				isFetching: true,
			};
		case 'RECEIVE_USER':
			return {
				...state,
				data: action.payload,
				isFetching: false,
			};
		case 'RECEIVE_USER_NOTIFICATIONS':
			state.data.notifications = action.payload;

			return {
				...state,
				isFetching: false,
			};
		case 'UNAUTHORIZED_USER':
			return {
				...state,
				data: action.payload,
				isFetching: false,
				error: 'unauthorized',
			};
		case 'RECEIVE_USER_ACTIVE_PROJECT':
			return {
				...state,
				data: {
					...state.data,
					activeProjectId: action.payload.projectId,
				},
				isFetching: false,
			};
		default:
			return state;
	}
};

export default user;
