import { combineReducers } from 'redux';

import user from './user';
import studio from './studio';
import member from './member';
import members from './members';
import positionGroups from './positionGroups';
import positions from './positions';
import characteristics from './characteristics';
import shops from './shops';
import writeOffs from './writeOffs';
import procurements from './procurements';
import invoices from './invoices';

import snackbars from './snackbars';

const getReducers = () => {
	return combineReducers({
		user,
		studio,
		member,
		members,
		positionGroups,
		positions,
		characteristics,
		shops,
		writeOffs,
		procurements,
		invoices,

		snackbars,
	});
};

export default getReducers;
