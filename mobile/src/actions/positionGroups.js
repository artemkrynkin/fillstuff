import axios from 'axios';

import { SERVER_URL } from 'mobile/src/api/constants';

export const getPositionGroup = ({ params }) => {
	return async (dispatch, getState) => {
		const {
			user: { data: currentUser },
		} = getState();
		const studioId = currentUser.settings.studio;
		const memberId = currentUser.settings.member._id;

		return await axios
			.post(`${SERVER_URL}/api/getPositionGroup`, {
				studioId,
				memberId,
				params,
			})
			.then(response => {
				const positionGroup = response.data;

				return Promise.resolve({ status: 'success', data: positionGroup });
			})
			.catch(error => {
				console.error(error);

				return Promise.reject({ status: 'error' });
			});
	};
};
