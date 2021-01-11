import { axiosFillstuff } from 'src/api/constants';

export const getShops = () => {
	return async (dispatch, getState) => {
		const {
			user: { data: currentUser },
		} = getState();
		const studioId = currentUser.settings.studio;
		const memberId = currentUser.settings.member._id;

		dispatch({ type: 'REQUEST_SHOPS' });

		return await axiosFillstuff
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

				return Promise.resolve({ status: 'success', data: shops });
			})
			.catch(error => {
				console.error(error);

				return Promise.resolve({ status: 'error' });
			});
	};
};

export const createShop = ({ data }) => {
	return async (dispatch, getState) => {
		const {
			user: { data: currentUser },
		} = getState();
		const studioId = currentUser.settings.studio;
		const memberId = currentUser.settings.member._id;

		dispatch({ type: 'REQUEST_SHOPS' });

		return await axiosFillstuff
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
