const storeNotifications = (
	state = {
		isFetching: false,
		data: null,
	},
	action
) => {
	switch (action.type) {
		case 'REQUEST_STORE_NOTIFICATIONS': {
			return {
				...state,
				isFetching: true,
			};
		}
		case 'RECEIVE_STORE_NOTIFICATIONS': {
			return {
				...state,
				isFetching: false,
				data: action.payload,
			};
		}
		case 'NEW_STORE_NOTIFICATION': {
			let stateData = { ...state }.data;

			stateData.unshift(action.payload);

			return {
				...state,
				isFetching: false,
				data: stateData,
			};
		}
		case 'EDIT_STATUS_STORE_NOTIFICATION': {
			let stateData = { ...state }.data;

			if (state.data) {
				stateData = { ...state }.data;
				const storeNotificationIndex = stateData.findIndex(storeNotification => storeNotification._id === action.payload._id);

				stateData[storeNotificationIndex] = {
					...stateData[storeNotificationIndex],
					...action.payload,
				};
			}

			return {
				...state,
				isFetching: false,
				data: stateData,
			};
		}
		case 'EDIT_STORE_NOTIFICATION': {
			let stateData = { ...state }.data;

			if (state.data) {
				stateData = { ...state }.data;
				const storeNotificationIndex = stateData.findIndex(storeNotification => storeNotification._id === action.payload._id);

				stateData[storeNotificationIndex] = action.payload;
			}

			return {
				...state,
				isFetching: false,
				data: stateData,
			};
		}
		case 'DELETE_STORE_NOTIFICATION': {
			let stateData = { ...state }.data;

			if (state.data) {
				stateData = { ...state }.data;
				const storeNotificationIndex = stateData.findIndex(storeNotification => storeNotification._id === action.payload._id);

				stateData.splice(storeNotificationIndex, 1);
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

export default storeNotifications;
