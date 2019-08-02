import { cloneDeep } from 'lodash';

const products = (
	state = {
		isFetching: false,
		data: null,
	},
	action
) => {
	switch (action.type) {
		case 'REQUEST_PRODUCTS': {
			return {
				...state,
				isFetching: true,
			};
		}
		case 'RECEIVE_PRODUCTS': {
			return {
				...state,
				data: action.payload,
				isFetching: false,
			};
		}
		case 'CREATE_PRODUCT': {
			state.data.push(action.payload);

			return {
				...state,
				isFetching: false,
			};
		}
		case 'EDIT_PRODUCT': {
			const productIndex = state.data.findIndex(product => product._id === action.payload.productId);

			state.data[productIndex] = action.payload.product;

			return {
				...state,
				isFetching: false,
			};
		}
		case 'ARCHIVE_PRODUCT': {
			const productIndex = state.data.findIndex(product => product._id === action.payload.productId);

			state.data.splice(productIndex, 1);

			return {
				...state,
				isFetching: false,
			};
		}
		case 'EDIT_MARKER': {
			const productIndex = state.data.findIndex(product => product._id === action.payload.productId);
			const markerIndex = state.data[productIndex].markers.findIndex(marker => marker._id === action.payload.markerId);

			state.data[productIndex].markers[markerIndex] = action.payload.marker;
			state.data[productIndex].markers = cloneDeep(state.data[productIndex].markers);

			if (!state.data[productIndex].dividedMarkers) {
				state.data[productIndex].quantity = state.data[productIndex].markers.reduce((sum, marker) => sum + marker.quantity, 0);
			}

			return {
				...state,
				isFetching: false,
			};
		}
		case 'ARCHIVE_MARKER': {
			const productIndex = state.data.findIndex(product => product._id === action.payload.productId);
			const markerIndex = state.data[productIndex].markers.findIndex(marker => marker._id === action.payload.markerId);

			state.data[productIndex].markers.splice(markerIndex, 1);
			state.data[productIndex].markers = cloneDeep(state.data[productIndex].markers);

			if (!state.data[productIndex].dividedMarkers) {
				state.data[productIndex].quantity = state.data[productIndex].markers.reduce((sum, marker) => sum + marker.quantity, 0);
			}

			return {
				...state,
				isFetching: false,
			};
		}
		case 'UNAUTHORIZED_USER': {
			return {
				...state,
				data: action.payload,
				isFetching: false,
				error: 'unauthorized',
			};
		}
		default:
			return state;
	}
};

export default products;
