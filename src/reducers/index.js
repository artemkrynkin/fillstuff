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
import procurementsExpected from './procurementsExpected';
import procurementsReceived from './procurementsReceived';
import invoices from './invoices';
import storeNotifications from './storeNotifications';

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
		procurementsExpected,
		procurementsReceived,
		invoices,
		storeNotifications,

		snackbars,
	});
};

export default getReducers;
