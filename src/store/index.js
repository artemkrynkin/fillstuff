import { createStore, compose, applyMiddleware } from 'redux';
import loggerMiddleware from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

import getReducers from 'src/reducers';

// this enables the chrome devtools for redux only in development
// prettier-ignore
// eslint-disable-next-line
const composeEnhancers = (process.env.NODE_ENV !== 'production' &&
	typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
	compose;

// init the store with the thunkMiddleware which allows us to make async actions play nicely with the store
// Allow dependency injection of extra reducers and middleware, we need this for SSR
export const initStore = initialState => {
	// prettier-ignore
	// eslint-disable-next-line
	let middleware = process.env.NODE_ENV === 'development'
	                 ? applyMiddleware(thunkMiddleware, loggerMiddleware)
	                 : applyMiddleware(thunkMiddleware);

	return createStore(getReducers(), initialState || {}, composeEnhancers(middleware));
};
