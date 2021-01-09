import { combineReducers } from 'redux';

import user from './user';
import studios from './studios';

const getReducers = () => {
	return combineReducers({
		user,
		studios,
	});
};

export default getReducers;
