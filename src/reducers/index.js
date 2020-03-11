import { combineReducers } from 'redux';

import user from './user';
import studio from './studio';
import member from './member';
import members from './members';
import positionGroups from './positionGroups';
import positions from './positions';
import characteristics from './characteristics';
import writeOffs from './writeOffs';
import procurements from './procurements';
import invoices from './invoices';

const getReducers = () => {
	return combineReducers({
		user,
		studio,
		member,
		members,
		positionGroups,
		positions,
		characteristics,
		writeOffs,
		procurements,
		invoices,
	});
};

export default getReducers;
