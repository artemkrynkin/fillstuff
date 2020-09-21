import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import moment from 'moment';
import 'moment/locale/ru';

import { StylesProvider } from '@material-ui/core/styles';

import { SERVER_URL } from 'src/api/constants';
import history from 'src/helpers/history';
import { initStore } from 'src/store';

import Routes from 'src/routes';

import 'src/helpers/fontAwesomeIcons';
import 'src/helpers/yupLocale';
import 'src/styles/common.css';

const store = initStore(window.__DATA__ || {});

moment.locale('ru');
moment().format();

const axios = require('axios').defaults;
// In development for cross-domain requests to api
axios.baseURL = SERVER_URL;

if (process.env.NODE_ENV === 'development') {
	axios.withCredentials = true;
}

const App = () => {
	return (
		<StylesProvider injectFirst>
			<Provider store={store}>
				<HelmetProvider>
					<Router history={history}>
						<Routes />
					</Router>
				</HelmetProvider>
			</Provider>
		</StylesProvider>
	);
};

render(<App />, document.querySelector('#root'));
