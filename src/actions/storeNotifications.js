import { axiosFillstuff } from 'src/api/constants';

import { sleep } from 'shared/utils';

export const getStoreNotifications = () => {
	return async (dispatch, getState) => {
		const {
			user: { data: currentUser },
		} = getState();
		const studioId = currentUser.settings.studio;
		const memberId = currentUser.settings.member._id;

		dispatch({ type: 'REQUEST_STORE_NOTIFICATIONS' });

		return await axiosFillstuff
			.post('/api/getStoreNotifications', {
				studioId,
				memberId,
			})
			.then(response => {
				dispatch({
					type: 'RECEIVE_STORE_NOTIFICATIONS',
					payload: response.data,
				});

				return Promise.resolve({ status: 'success' });
			})
			.catch(error => {
				console.error(error.response);

				return Promise.resolve({ status: 'error' });
			});
	};
};

export const getStoreNotification = ({ params }) => {
	return async (dispatch, getState) => {
		const {
			user: { data: currentUser },
		} = getState();
		const studioId = currentUser.settings.studio;
		const memberId = currentUser.settings.member._id;

		return await axiosFillstuff
			.post('/api/getStoreNotification', {
				studioId,
				memberId,
				params,
			})
			.then(response => {
				const { data: storeNotification } = response;

				return Promise.resolve({ status: 'success', data: storeNotification });
			})
			.catch(error => {
				console.error(error.response);

				return Promise.resolve({ status: 'error' });
			});
	};
};

export const editStatusDeliveryIsExpected = ({ data: storeNotification }) => {
	return async dispatch => {
		await sleep(250);

		dispatch({
			type: 'EDIT_STORE_NOTIFICATION',
			payload: {
				...storeNotification,
				actionStatus: 'new',
			},
		});

		await sleep(250);

		const storeNotificationEdited = storeNotification;

		delete storeNotificationEdited.actionStatus;

		dispatch({
			type: 'EDIT_STORE_NOTIFICATION',
			payload: storeNotificationEdited,
		});
	};
};

export const storeNotificationEvents = () => {
	return async (dispatch, getState, socket) => {
		socket
			.on('newStoreNotification', async storeNotification => {
				dispatch({
					type: 'NEW_STORE_NOTIFICATION',
					payload: {
						...storeNotification,
						actionStatus: 'new',
					},
				});

				await sleep(250);

				dispatch({
					type: 'EDIT_STORE_NOTIFICATION',
					payload: storeNotification,
				});
			})
			.on('editStoreNotification', async storeNotification => {
				dispatch({
					type: 'EDIT_STATUS_STORE_NOTIFICATION',
					payload: {
						_id: storeNotification._id,
						actionStatus: 'deleting',
					},
				});

				await sleep(250);

				dispatch({
					type: 'EDIT_STORE_NOTIFICATION',
					payload: {
						...storeNotification,
						actionStatus: 'new',
					},
				});

				await sleep(250);

				dispatch({
					type: 'EDIT_STORE_NOTIFICATION',
					payload: storeNotification,
				});
			})
			.on('deleteStoreNotification', async storeNotification => {
				dispatch({
					type: 'EDIT_STATUS_STORE_NOTIFICATION',
					payload: {
						_id: storeNotification._id,
						actionStatus: 'deleting',
					},
				});

				await sleep(250);

				dispatch({
					type: 'DELETE_STORE_NOTIFICATION',
					payload: storeNotification,
				});
			});
	};
};
