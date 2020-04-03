const snackbars = (
	state = {
		data: [],
	},
	action
) => {
	switch (action.type) {
		case 'ENQUEUE_SNACKBAR': {
			return {
				...state,
				data: [
					...state.data,
					{
						key: action.payload.key,
						...action.payload,
					},
				],
			};
		}
		case 'CLOSE_SNACKBAR': {
			return {
				...state,
				data: state.data.map(snackbar =>
					action.dismissAll || snackbar.key === action.payload.key ? { ...snackbar, dismissed: true } : { ...snackbar }
				),
			};
		}
		case 'REMOVE_SNACKBAR': {
			return {
				...state,
				data: state.data.filter(snackbar => snackbar.key !== action.payload.key),
			};
		}
		default:
			return state;
	}
};

export default snackbars;
