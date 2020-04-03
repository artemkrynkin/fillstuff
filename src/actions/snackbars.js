export const enqueueSnackbar = snackbar => {
	return async dispatch => {
		const key = snackbar.options && snackbar.options.key;

		return dispatch({
			type: 'ENQUEUE_SNACKBAR',
			payload: {
				...snackbar,
				key: key || new Date().getTime() + Math.random(),
			},
		});
	};
};

export const closeSnackbar = key => {
	return async dispatch => {
		return dispatch({
			type: 'CLOSE_SNACKBAR',
			payload: {
				dismissAll: !key,
				key,
			},
		});
	};
};

export const removeSnackbar = key => {
	return async dispatch => {
		return dispatch({
			type: 'REMOVE_SNACKBAR',
			payload: {
				key,
			},
		});
	};
};
