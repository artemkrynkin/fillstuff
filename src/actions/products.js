import axios from 'axios';

export const getProducts = stockId => {
	return async dispatch => {
		dispatch({ type: 'REQUEST_PRODUCTS' });

		return await axios
			.get('/api/products', {
				params: {
					stockId,
				},
			})
			.then(response => {
				dispatch({
					type: 'RECEIVE_PRODUCTS',
					payload: response.data,
				});
			})
			.catch(error => {
				if (error.response && error.response.status === 401) {
					dispatch({
						type: 'UNAUTHORIZED_USER',
						payload: error.response.data,
					});
				} else {
					console.error(error.response);
				}
			});
	};
};

export const createProductAndMarkers = (stockId, product, markers) => {
	return async dispatch => {
		return await axios
			.post(
				`/api/products/product-markers`,
				{
					product,
					markers,
				},
				{
					params: {
						stockId,
					},
				}
			)
			.then(async response => {
				const { data: product } = response;

				await dispatch({
					type: 'CREATE_PRODUCT',
					payload: product,
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

export const editProduct = (productId, newValues) => {
	return async dispatch => {
		return await axios
			.put(`/api/products/${productId}`, newValues)
			.then(response => {
				const product = response.data;

				dispatch({
					type: 'EDIT_PRODUCT',
					payload: {
						productId,
						product,
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

export const archiveProduct = (stockId, productId) => {
	return async dispatch => {
		return await axios
			.get(`/api/products/${productId}/archive`, {
				params: {
					stockId,
				},
			})
			.then(() => {
				dispatch({
					type: 'ARCHIVE_PRODUCT',
					payload: {
						productId,
					},
				});

				return Promise.resolve({ status: 'success' });
			})
			.catch(error => {
				console.error(error);
			});
	};
};
