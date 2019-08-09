import { combineReducers } from 'redux';

import user from './user';
import stocks from './stocks';
import products from './products';
import characteristics from './characteristics';
import writeOffs from './writeOffs';

const getReducers = () => {
	return combineReducers({
		user,
		stocks,
		products,
		characteristics,
		writeOffs,
	});
};

export default getReducers;
