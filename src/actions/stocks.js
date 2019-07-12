import axios from 'axios';

import { history } from 'src/helpers/history';
import { changeStockCurrentUrl } from 'src/helpers/utils';

import { changeActiveStock } from './user';

export const getStocks = () => {
	return dispatch => {
		dispatch({ type: 'REQUEST_STOCKS' });

		axios
			.get('/api/stocks')
			.then(response => {
				dispatch({
					type: 'RECEIVE_STOCKS',
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

export const getStockStatus = stockId => {
	return dispatch => {
		dispatch({ type: 'REQUEST_STOCKS' });

		axios
			.get(`/api/stocks/${stockId}/status`)
			.then(response => {
				dispatch({
					type: 'GET_STOCK_STATUS',
					payload: {
						stockId,
						status: response.data,
					},
				});
			})
			.catch(error => {
				console.error(error);
			});
	};
};

// export const createStock = values => {
// 	return dispatch => {
// 		dispatch({ type: 'REQUEST_STOCKS' });
//
// 		return axios
// 			.post('/api/stocks', values)
// 			.then(async response => {
// 				const { data: stock } = response;
//
// 				await dispatch({
// 					type: 'CREATE_STOCK',
// 					payload: stock,
// 				});
//
// 				dispatch(changeActiveStock(stock._id)).then(() => {
// 					history.push({ pathname: `/stocks/${stock._id}/dashboard` });
// 				});
//
// 				return Promise.resolve({ status: 'success' });
// 			})
// 			.catch(error => {
// 				if (error.response) {
// 					return Promise.resolve({ status: 'error', data: error.response.data });
// 				} else {
// 					console.error(error);
// 				}
// 			});
// 	};
// };

export const editStock = (stockId, newValues) => {
	return dispatch => {
		dispatch({ type: 'REQUEST_STOCKS' });

		return axios
			.put(`/api/stocks/${stockId}`, newValues)
			.then(() => {
				dispatch({
					type: 'EDIT_STOCK',
					payload: {
						stockId,
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

// export const deleteStock = stockId => {
// 	return dispatch => {
// 		dispatch({ type: 'REQUEST_STOCKS' });
//
// 		return axios
// 			.delete(`/api/stocks/${stockId}`)
// 			.then(async response => {
// 				const { data: nextStockId } = response;
//
// 				await dispatch(changeActiveStock(nextStockId)).then(() => {
// 					history.push({ pathname: nextStockId ? changeStockCurrentUrl(nextStockId) : '/stocks' });
// 				});
//
// 				dispatch({
// 					type: 'DELETE_STOCK',
// 					payload: {
// 						stockId,
// 					},
// 				});
//
// 				return Promise.resolve({ status: 'success', data: nextStockId });
// 			})
// 			.catch(error => {
// 				console.error(error);
// 			});
// 	};
// };

export const memberInvitation = stockId => {
	return dispatch => {
		dispatch({ type: 'REQUEST_MEMBERS' });

		return axios
			.get(`/api/stocks/${stockId}/member-invitation`)
			.then(response => {
				return Promise.resolve({ status: 'success', data: response.data });
			})
			.catch(error => {
				console.error(error);
			});
	};
};

export const editMember = (stockId, memberId, newValues) => {
	return dispatch => {
		dispatch({ type: 'REQUEST_MEMBERS' });

		return axios
			.put(`/api/stocks/${stockId}/members/${memberId}`, newValues)
			.then(() => {
				dispatch({
					type: 'EDIT_MEMBER',
					payload: {
						stockId,
						memberId,
						newValues,
					},
				});

				return Promise.resolve({ status: 'success' });
			})
			.catch(error => {
				if (error.response) {
					return Promise.resolve({ status: 'error' });
				} else {
					console.error(error);
				}
			});
	};
};

export const deleteMember = (stockId, memberId, memberUserId, currentUserId) => {
	return (dispatch, getState) => {
		dispatch({ type: 'REQUEST_MEMBERS' });

		return axios
			.delete(`/api/stocks/${stockId}/members/${memberId}`)
			.then(async () => {
				if (memberUserId === currentUserId) {
					let {
						stocks: { data: stocks },
						newStocks = stocks
							.filter(stock => stock._id !== stockId)
							.sort((stockA, stockB) => stockB.createdAt - stockA.createdAt),
						nextStockId = newStocks.length ? newStocks[0]._id : null,
					} = getState();

					await dispatch(changeActiveStock(nextStockId)).then(() => {
						history.push({ pathname: nextStockId ? changeStockCurrentUrl(nextStockId) : '/stocks' });
					});

					dispatch({
						type: 'DELETE_STOCK',
						payload: {
							stockId,
						},
					});

					return Promise.resolve({ status: 'success', data: nextStockId });
				}

				dispatch({
					type: 'DELETE_MEMBER',
					payload: {
						stockId,
						memberId,
					},
				});

				return Promise.resolve();
			})
			.catch(error => {
				console.error(error);
			});
	};
};

export const createProductShop = (stockId, values) => {
	return dispatch => {
		dispatch({ type: 'REQUEST_PRODUCT_SHOPS' });

		return axios
			.post(`/api/stocks/${stockId}/product-shops`, values)
			.then(response => {
				dispatch({
					type: 'CREATE_PRODUCT_SHOP',
					payload: {
						stockId,
						shop: response.data,
					},
				});

				return Promise.resolve({ status: 'success', data: response.data });
			})
			.catch(error => {
				if (error.response) {
					return Promise.resolve({ status: 'error' });
				} else {
					console.error(error);
				}
			});
	};
};

export const createProductSpecification = (stockId, schemaName, values) => {
	return dispatch => {
		dispatch({ type: 'REQUEST_PRODUCT_SPECIFICATIONS' });

		return axios
			.post(`/api/stocks/${stockId}/product-specifications/${schemaName}`, values)
			.then(response => {
				dispatch({
					type: 'CREATE_PRODUCT_SPECIFICATION',
					payload: {
						stockId,
						schemaName,
						specification: response.data,
					},
				});

				return Promise.resolve({ status: 'success', data: response.data });
			})
			.catch(error => {
				if (error.response) {
					return Promise.resolve({ status: 'error' });
				} else {
					console.error(error);
				}
			});
	};
};
