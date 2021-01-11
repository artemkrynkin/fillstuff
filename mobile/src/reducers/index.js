import { combineReducers } from 'redux';

import user from './user';
import studios from './studios';
import writeOffs from './writeOffs';

const getReducers = () => {
	return combineReducers({
		user,
		studios,
		writeOffs,
	});
};

export default getReducers;
