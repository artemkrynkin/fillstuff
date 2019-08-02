import axios from 'axios';

export const archiveMarker = (stockId, productId, markerId) => {
	return dispatch => {
		return axios
			.get(`/api/markers/${markerId}/archive`, {
				params: {
					stockId,
				},
			})
			.then(() => {
				dispatch({
					type: 'ARCHIVE_MARKER',
					payload: {
						productId,
						markerId,
					},
				});

				return Promise.resolve({ status: 'success' });
			})
			.catch(error => {
				console.error(error);
			});
	};
};
