import axios from 'axios';

export const activeReceiptAddQuantity = ({ params, data }) => {
	return async (dispatch, getState) => {
		const studioId = getState().studio.data._id;
		const memberId = getState().member.data._id;
		const { positionId } = params;

		return await axios
			.post('/api/activeReceiptAddQuantity', {
				studioId,
				memberId,
				params,
				data,
			})
			.then(response => {
				dispatch({
					type: 'EDIT_POSITION',
					payload: {
						positionId,
						position: response.data,
					},
				});

				return Promise.resolve({ status: 'success' });
			})
			.catch(error => {
				if (error.response) {
					return Promise.resolve({ status: 'error', data: error.response.data });
				} else {
					console.error(error);

					return Promise.resolve({ status: 'error' });
				}
			});
	};
};
