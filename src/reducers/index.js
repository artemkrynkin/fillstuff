import { combineReducers } from 'redux';

import user from './user';
import stocks from './stocks';
import products from './products';
import manufacturers from './manufacturers';
import specifications from './specifications';
import writeOffs from './writeOffs';

const getReducers = () => {
	return combineReducers({
		user,
		stocks,
		products,
		manufacturers,
		specifications,
		writeOffs,
	});
};

export default getReducers;
