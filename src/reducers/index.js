import { combineReducers } from 'redux';

import user from './user';
import projects from './projects';

const getReducers = () => {
	return combineReducers({
		user,
		projects,
	});
};

export default getReducers;
