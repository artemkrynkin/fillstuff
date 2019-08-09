import axios from 'axios';

export const editMarker = (productId, markerId, newValues) => {
	return async dispatch => {
		return await axios
			.put(`/api/markers/${markerId}`, newValues)
			.then(response => {
				const marker = response.data;

				dispatch({
					type: 'EDIT_MARKER',
					payload: {
						productId,
						markerId,
						marker,
					},
				});

				return Promise.resolve({ status: 'success' });
			})
			.catch(error => {
				if (error.response) {
					return Promise.resolve({ status: 'error', data: error.response.data });
				} else {
					console.error(error);
				}
			});
	};
};

export const archiveMarker = (stockId, productId, markerId) => {
	return async dispatch => {
		return await axios
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
