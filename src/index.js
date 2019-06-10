import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import { create } from 'jss';
import JssProvider from 'react-jss/lib/JssProvider';
import Loadable from 'react-loadable';
import moment from 'moment';
import 'moment/locale/ru';

import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';

import { history } from 'src/helpers/history';
import { initStore } from 'src/store';

import Routes from 'src/routes';

import 'src/helpers/fontAwesomeIcons';
import 'src/styles/common.styl';

const store = initStore(window.__DATA__ || {});

moment.locale('ru');
moment().format();

if (process.env.NODE_ENV === 'development') {
	const axios = require('axios').defaults;
	// In development for cross-domain requests to api
	axios.baseURL = 'http://localhost:3001';
	axios.withCredentials = true;
}

const generateClassName = createGenerateClassName();
const jss = create({
	...jssPreset(),
	// We define a custom insertion point that JSS will look for injecting the styles in the DOM.
	insertionPoint: document.getElementById('jss-insertion-point'),
});

const App = () => {
	return (
		<JssProvider jss={jss} generateClassName={generateClassName}>
			<Provider store={store}>
				<HelmetProvider>
					<Router history={history}>
						<Routes />
					</Router>
				</HelmetProvider>
			</Provider>
		</JssProvider>
	);
};

Loadable.preloadReady()
	.then(render(<App />, document.querySelector('#root')))
	.catch(err => {
		console.error(err);
	});
