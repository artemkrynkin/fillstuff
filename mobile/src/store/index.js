import { createStore, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import getReducers from '../reducers';

// this enables the chrome devtools for redux only in development
// prettier-ignore
// eslint-disable-next-line

// init the store with the thunkMiddleware which allows us to make async actions play nicely with the store
// Allow dependency injection of extra reducers and middleware, we need this for SSR
export const initStore = initialState => {
	// prettier-ignore
	// eslint-disable-next-line
	let middleware = applyMiddleware(thunkMiddleware);

	return createStore(getReducers(), initialState || {}, compose(middleware));
};
