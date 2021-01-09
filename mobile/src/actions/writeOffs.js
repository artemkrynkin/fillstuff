import axios from 'axios';

import { SERVER_URL } from 'mobile/src/api/constants';

export const createWriteOff = ({ params, data }) => {
	return async (dispatch, getState) => {
		const {
			user: { data: currentUser },
		} = getState();
		const studioId = currentUser.settings.studio;
		const memberId = currentUser.settings.member._id;

		return await axios
			.post(`${SERVER_URL}/api/createWriteOff`, {
				studioId,
				memberId,
				params,
				data,
			})
			.then(response => {
				if (!response.data.code) {
					return Promise.resolve({ status: 'success' });
				} else {
					console.error(response);

					return Promise.reject({ status: 'error' });
				}
			})
			.catch(error => {
				console.error(error);

				return Promise.reject({ status: 'error' });
			});
	};
};
