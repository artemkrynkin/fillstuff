import { combineReducers } from 'redux';

import user from './user';
import stocks from './stocks';
import products from './products';

const getReducers = () => {
	return combineReducers({
		user,
		stocks,
		products,
	});
};

export default getReducers;
