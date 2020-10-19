import { webAuth } from 'src/api/auth';
import { SERVER_URL } from 'src/api/constants';

export const login = ({ data }) => {
	return async () => {
		const loginResponse = await new Promise(resolve => {
			webAuth.login(
				{
					username: data.email,
					password: data.password,
					realm: 'Username-Password-Authentication',
				},
				error => {
					if (error) resolve(error);
				}
			);
		});

		return Promise.resolve({ status: 'error', data: loginResponse?.original });
	};
};

export const logout = () => (window.location.href = `${SERVER_URL}/auth/logout`);

export const logoutListener = () => {
	return async (dispatch, getState, socket) => {
		socket.on('logout', () => {
			window.location.href = '/login';
		});
	};
};
