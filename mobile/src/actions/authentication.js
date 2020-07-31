import { setItemObject, removeItem } from '../helpers/storage';

export const authentication = user => {
	return async dispatch => {
		dispatch({ type: 'REQUEST_USER' });

		await setItemObject('user', user);

		dispatch({
			type: 'USER_LOGIN',
			payload: user,
		});

		return Promise.resolve({ status: 'success', data: user });
	};
};

export const logout = () => {
	return async dispatch => {
		await removeItem('user');

		dispatch({ type: 'USER_LOGOUT' });
	};
};

export const restore = user => {
	return async dispatch => {
		await setItemObject('user', user);

		dispatch({
			type: 'USER_RESTORE',
			payload: user,
		});
	};
};
