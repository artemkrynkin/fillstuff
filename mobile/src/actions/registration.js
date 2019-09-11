import axios from 'axios';

export const registrationViaInvitation = memberId => {
	return dispatch => {
		return axios
			.get('/stocks/member-invitation-qr', {
				params: {
					memberId,
				},
			})
			.then(response => {
				return Promise.resolve({ status: 'success', data: response.data });
			})
			.catch(error => {
				console.error(error);

				return Promise.resolve({ status: 'error' });
			});
	};
};
