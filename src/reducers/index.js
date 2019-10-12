import { combineReducers } from 'redux';

import user from './user';
import stocks from './stocks';
import positions from './positions';
import characteristics from './characteristics';
import writeOffs from './writeOffs';
import purchases from './purchases';

const getReducers = () => {
	return combineReducers({
		user,
		stocks,
		positions,
		characteristics,
		writeOffs,
		purchases,
	});
};

export default getReducers;
