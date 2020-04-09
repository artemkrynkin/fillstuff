import axios from 'axios';

export const getShops = () => {
	return async (dispatch, getState) => {
		const studioId = getState().studio.data._id;
		const memberId = getState().member.data._id;

		dispatch({ type: 'REQUEST_SHOPS' });

		return await axios
			.post('/api/getShops', {
				studioId,
				memberId,
			})
			.then(response => {
				const { data: shops } = response;

				dispatch({
					type: 'RECEIVE_SHOPS',
					payload: shops,
				});

				return Promise.resolve({ status: 'success' });
			})
			.catch(error => {
				console.error(error);

				return Promise.resolve({ status: 'error' });
			});
	};
};

export const createShop = ({ data }) => {
	return async (dispatch, getState) => {
		const studioId = getState().studio.data._id;
		const memberId = getState().member.data._id;

		dispatch({ type: 'REQUEST_SHOPS' });

		return await axios
			.post('/api/createShop', {
				studioId,
				memberId,
				data,
			})
			.then(response => {
				const { data: shop } = response;

				dispatch({
					type: 'CREATE_SHOP',
					payload: shop,
				});

				return Promise.resolve({ status: 'success', data: shop });
			})
			.catch(error => {
				console.error(error);

				return Promise.resolve({ status: 'error', message: error.message, ...error });
			});
	};
};
