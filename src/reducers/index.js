import { combineReducers } from 'redux';

import user from './user';
import stocks from './stocks';
import positionsInGroups from './positionsInGroups';
import positions from './positions';
import characteristics from './characteristics';
import writeOffs from './writeOffs';
import procurements from './procurements';

const getReducers = () => {
	return combineReducers({
		user,
		stocks,
		positionsInGroups,
		positions,
		characteristics,
		writeOffs,
		procurements,
	});
};

export default getReducers;
