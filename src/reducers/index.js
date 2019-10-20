import { combineReducers } from 'redux';

import user from './user';
import stocks from './stocks';
import positionsInGroups from './positionsInGroups';
import positions from './positions';
import characteristics from './characteristics';
import writeOffs from './writeOffs';
import purchases from './purchases';

const getReducers = () => {
	return combineReducers({
		user,
		stocks,
		positionsInGroups,
		positions,
		characteristics,
		writeOffs,
		purchases,
	});
};

export default getReducers;
