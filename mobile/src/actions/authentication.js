import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

import { removeItem } from 'mobile/src/helpers/storage';

import { ACCOUNT_SERVER_URL } from 'mobile/src/api/constants';

export const getAccessToken = ({ code, codeVerifier, redirectUri }) => {
	return async () => {
		await axios
			.post(`${ACCOUNT_SERVER_URL}/auth/getAccessToken`, {
				code,
				codeVerifier,
				redirectUri,
			})
			.then(async response => {
				const authData = response.data;

				await SecureStore.setItemAsync('authData', JSON.stringify(authData));

				return Promise.resolve({ status: 'success', data: authData });
			})
			.catch(error => {
				console.error(error);

				return Promise.reject({ status: 'error' });
			});
	};
};

export const logout = () => {
	return async dispatch => {
		await SecureStore.deleteItemAsync('authData');

		dispatch({
			type: 'RECEIVE_USER',
			payload: null,
		});
		dispatch({
			type: 'RECEIVE_STUDIOS',
			payload: null,
		});
	};
};
