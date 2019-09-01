import axios from 'axios';

import { history } from 'src/helpers/history';
import { changeStockCurrentUrl } from 'src/helpers/utils';

import { changeActiveStock } from './user';

export const getStocks = () => {
	return async dispatch => {
		dispatch({ type: 'REQUEST_STOCKS' });

		return await axios
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

				return Promise.resolve({ status: 'error' });
			});
	};
};

export const getStockStatus = stockId => {
	return async dispatch => {
		dispatch({ type: 'REQUEST_STOCKS' });

		return await axios
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

export const editStock = (stockId, newValues) => {
	return async dispatch => {
		dispatch({ type: 'REQUEST_STOCKS' });

		return await axios
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

					return Promise.resolve({ status: 'error' });
				}
			});
	};
};

export const memberInvitation = stockId => {
	return async dispatch => {
		dispatch({ type: 'REQUEST_MEMBERS' });

		return await axios
			.get(`/api/stocks/${stockId}/member-invitation`)
			.then(response => {
				return Promise.resolve({ status: 'success', data: response.data });
			})
			.catch(error => {
				console.error(error);

				return Promise.resolve({ status: 'error' });
			});
	};
};

export const editMember = (stockId, memberId, newValues) => {
	return async dispatch => {
		dispatch({ type: 'REQUEST_MEMBERS' });

		return await axios
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
					return Promise.resolve({ status: 'error', data: error.response.data });
				} else {
					console.error(error);

					return Promise.resolve({ status: 'error' });
				}
			});
	};
};

export const deleteMember = (stockId, memberId, memberUserId, currentUserId) => {
	return async (dispatch, getState) => {
		dispatch({ type: 'REQUEST_MEMBERS' });

		return await axios
			.delete(`/api/stocks/${stockId}/members/${memberId}`)
			.then(async () => {
				if (memberUserId === currentUserId) {
					let {
						stocks: { data: stocks },
						newStocks = stocks.filter(stock => stock._id !== stockId).sort((stockA, stockB) => stockB.createdAt - stockA.createdAt),
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

				return Promise.resolve({ status: 'error' });
			});
	};
};
