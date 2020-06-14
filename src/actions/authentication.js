import axios from 'axios';

import { SERVER_URL } from 'src/api/constants';

export const login = async ({ data }) => {
	return await axios
		.post('/auth/local', data)
		.then(response => {
			return Promise.resolve({ status: 'success', data: response.data });
		})
		.catch(error => {
			if (error.response) {
				return Promise.resolve({ status: 'error', data: error.response.data });
			} else {
				console.error(error);

				return Promise.resolve({ status: 'error', message: error.message, ...error });
			}
		});
};

export const logout = () => (window.location.href = `${SERVER_URL}/auth/logout`);

export const logoutListener = () => {
	return async (dispatch, getState, socket) => {
		socket.on('logout', () => {
			window.location.href = '/login';
		});
	};
};
