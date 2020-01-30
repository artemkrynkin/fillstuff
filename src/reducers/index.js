import { combineReducers } from 'redux';

import user from './user';
import studio from './studio';
import member from './member';
import members from './members';
import positionsInGroups from './positionsInGroups';
import positions from './positions';
import characteristics from './characteristics';
import writeOffs from './writeOffs';
import procurements from './procurements';

const getReducers = () => {
	return combineReducers({
		user,
		studio,
		member,
		members,
		positionsInGroups,
		positions,
		characteristics,
		writeOffs,
		procurements,
	});
};

export default getReducers;
