import axios from 'axios';

export const getProducts = stockId => {
	return dispatch => {
		dispatch({ type: 'REQUEST_PRODUCTS' });

		return axios
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

export const createProduct = (stockId, values) => {
	return dispatch => {
		return axios
			.post(`/api/products?stockId=${stockId}`, values)
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
	return dispatch => {
		return axios
			.put(`/api/products/${productId}`, newValues, {
				params: {
					stockId: newValues.stock,
				},
			})
			.then(() => {
				dispatch({
					type: 'EDIT_PRODUCT',
					payload: {
						productId,
						newValues,
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

export const deleteProduct = (stockId, productId) => {
	return dispatch => {
		return axios
			.delete(`/api/products/${productId}`, {
				params: {
					stockId: stockId,
				},
			})
			.then(() => {
				dispatch({
					type: 'DELETE_PRODUCT',
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
