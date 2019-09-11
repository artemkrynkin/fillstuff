import { combineReducers } from 'redux';

import user from './user';

const getReducers = () => {
	return combineReducers({
		user,
	});
};

export default getReducers;
