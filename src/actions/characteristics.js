import { axiosFillstuff } from 'src/api/constants';

export const getCharacteristics = ({ params }) => {
	return async (dispatch, getState) => {
		const {
			user: { data: currentUser },
		} = getState();
		const studioId = currentUser.settings.studio;
		const memberId = currentUser.settings.member._id;

		dispatch({ type: 'REQUEST_CHARACTERISTICS' });

		return await axiosFillstuff
			.post('/api/getCharacteristics', {
				studioId,
				memberId,
				params,
			})
			.then(response => {
				dispatch({
					type: 'RECEIVE_CHARACTERISTICS',
					payload: response.data,
				});

				return Promise.resolve({ status: 'success' });
			})
			.catch(error => {
				console.error(error);

				return Promise.resolve({ status: 'error' });
			});
	};
};

export const createCharacteristic = ({ data }) => {
	return async (dispatch, getState) => {
		const {
			user: { data: currentUser },
		} = getState();
		const studioId = currentUser.settings.studio;
		const memberId = currentUser.settings.member._id;

		dispatch({ type: 'REQUEST_CHARACTERISTICS' });

		return await axiosFillstuff
			.post('/api/createCharacteristic', {
				studioId,
				memberId,
				data,
			})
			.then(response => {
				const characteristic = response.data;

				dispatch({
					type: 'CREATE_CHARACTERISTIC',
					payload: characteristic,
				});

				return Promise.resolve({ status: 'success', data: characteristic });
			})
			.catch(error => {
				console.error(error);

				return Promise.resolve({ status: 'error', message: error.message, ...error });
			});
	};
};
