import React, { Component } from 'react';
import { compose } from 'redux';
import { Route, Switch, Redirect } from 'react-router';

import { ThemeProvider } from '@material-ui/core/styles';

import generateMetaInfo from 'shared/generate-meta-info';

import { CLIENT_URL } from './api/constants';

import { BliksideTheme } from 'src/helpers/MuiTheme';
import signedOutFallback from 'src/helpers/signed-out-fallback';

import AuthViewHandler from 'src/components/authViewHandler';
import Head from 'src/components/head';
import Layout from 'src/components/Layout';
import Sidebar from './components/Sidebar';
import { withCurrentUser } from 'src/components/withCurrentUser';

import Login from 'src/pages/Login';
import PageNotFound from 'src/pages/PageNotFound';
import PasswordRecovery from 'src/pages/PasswordRecovery';
import StockNotFound from 'src/pages/StockNotFound';
import StockDashboard from 'src/pages/StockDashboard';
import StockAvailability from 'src/pages/StockAvailability';
import StockWriteOffs from 'src/pages/StockWriteOffs';
import StockProcurements from 'src/pages/StockProcurements';
import StockProcurement from 'src/pages/StockProcurement';
import StockStatistics from 'src/pages/StockStatistics';
import StockSettings from 'src/pages/StockSettings';
import Registration from 'src/pages/Registration';
import UserSettings from 'src/pages/UserSettings';

import stylesPage from 'src/styles/page.module.css';

const LoginFallback = signedOutFallback(
	() => <Redirect to="/stocks" />,
	() => <Layout children={<Login />} />
);

const RegistrationFallback = signedOutFallback(
	() => <Redirect to="/stocks" />,
	() => <Layout children={<Registration />} />
);

const PasswordRecoveryFallback = signedOutFallback(
	() => <Redirect to="/stocks" />,
	() => <Layout children={<PasswordRecovery />} />
);

const StockNotFoundFallback = signedOutFallback(
	props => (
		<StockPageFallback {...props}>
			<StockNotFound stocks={props.stocks} currentStock={props.currentStock} />
		</StockPageFallback>
	),
	() => <Layout children={<Login redirectPath={`${CLIENT_URL}/stocks`} />} />
);

const StockDashboardFallback = signedOutFallback(
	props => (
		<StockPageFallback {...props}>
			<StockDashboard currentStock={props.currentStock} />
		</StockPageFallback>
	),
	({ match }) => <Layout children={<Login redirectPath={`${CLIENT_URL}/stocks/${match.params.stockId}/dashboard`} />} />
);

const StockAvailabilityFallback = signedOutFallback(
	props => (
		<StockPageFallback {...props}>
			<StockAvailability currentStock={props.currentStock} match={props.match} />
		</StockPageFallback>
	),
	({ match }) => <Layout children={<Login redirectPath={`${CLIENT_URL}/stocks/${match.params.stockId}/availability`} />} />
);

const StockWriteOffsFallback = signedOutFallback(
	props => (
		<StockPageFallback {...props}>
			<StockWriteOffs currentStock={props.currentStock} match={props.match} />
		</StockPageFallback>
	),
	({ match }) => <Layout children={<Login redirectPath={`${CLIENT_URL}/stocks/${match.params.stockId}/write-offs`} />} />
);

const StockProcurementsFallback = signedOutFallback(
	props => (
		<StockPageFallback {...props}>
			<StockProcurements currentStock={props.currentStock} match={props.match} />
		</StockPageFallback>
	),
	({ match }) => <Layout children={<Login redirectPath={`${CLIENT_URL}/stocks/${match.params.stockId}/procurements`} />} />
);

const StockProcurementFallback = signedOutFallback(
	props => (
		<StockPageFallback {...props}>
			<StockProcurement currentStock={props.currentStock} match={props.match} />
		</StockPageFallback>
	),
	({ match }) => (
		<Layout children={<Login redirectPath={`${CLIENT_URL}/stocks/${match.params.stockId}/procurements/${match.props.procurementId}`} />} />
	)
);

const StockStatisticsFallback = signedOutFallback(
	props => (
		<StockPageFallback {...props}>
			<StockStatistics currentStock={props.currentStock} />
		</StockPageFallback>
	),
	({ match }) => <Layout children={<Login redirectPath={`${CLIENT_URL}/stocks/${match.params.stockId}/statistics`} />} />
);

const StockSettingsFallback = signedOutFallback(
	props => (
		<StockPageFallback {...props}>
			<StockSettings currentStock={props.currentStock} />
		</StockPageFallback>
	),
	({ match }) => <Layout children={<Login redirectPath={`${CLIENT_URL}/stocks/${match.params.stockId}/settings`} />} />
);

const UserSettingsFallback = signedOutFallback(
	() => <Layout children={<UserSettings />} authed />,
	() => <Layout children={<Login redirectPath={`${CLIENT_URL}/settings`} />} />
);

const StockPageFallback = props => {
	const { match, currentUser, stocks, currentStock } = props;

	if (Array.isArray(stocks) && !stocks.some(stock => stock._id === match.params.stockId)) {
		if (!match.params.stockId && currentUser.activeStockId)
			return <Redirect to={`/stocks/${match.params.stockId || currentUser.activeStockId}/dashboard`} />;

		if (!currentStock && match.params.stockId) return <Redirect to="/stocks" />;

		if (match.params.stockId || currentUser.activeStockId)
			return <Layout children={<StockNotFound currentStock={currentStock} />} authed />;
	}

	return <Layout children={props.children} authed />;
};

class Routes extends Component {
	render() {
		const { currentUser, stocks } = this.props;
		const { title, description } = generateMetaInfo();

		const findCurrentStock = match => {
			let currentStock = null;

			if (Array.isArray(stocks) && stocks.length) {
				currentStock = stocks[stocks.findIndex(stock => match.params.stockId === stock._id)];

				currentStock = currentStock //!~stocks.findIndex(stock => match.params.stockId === stock._id)
					? stocks[stocks.findIndex(stock => match.params.stockId === stock._id)]
					: stocks[stocks.findIndex(stock => currentUser.activeStockId === stock._id)];
			}

			return currentStock;
		};

		return (
			<ThemeProvider theme={BliksideTheme}>
				<div className={stylesPage.page}>
					{/* Метатеги по умолчанию, переопределяемые чем-нибудь вниз по дереву */}
					<Head title={title} description={description} />

					{/*
           AuthViewHandler often returns null, but is responsible for triggering
           things like the 'set username' prompt when a user auths and doesn't
           have a username set.
           */}
					<AuthViewHandler>{() => null}</AuthViewHandler>

					{currentUser && stocks.length ? <Sidebar /> : null}

					{/*
           Switch отображает только первое совпадение. Внутренняя маршрутизация происходит вниз по течению
           https://reacttraining.com/react-router/web/api/Switch
           */}
					<Switch>
						{/* Публичные бизнес страницы */}
						{/* Страницы приложения */}
						<Route path="/login" component={LoginFallback} exact strict sensitive />
						<Route path="/registration" component={RegistrationFallback} exact strict sensitive />
						<Route path="/password-recovery" component={PasswordRecoveryFallback} exact strict sensitive />

						<Route path={['/stocks', '/stocks/:stockId']} exact strict sensitive>
							{props => {
								const { match } = props;

								if (Array.isArray(stocks) && stocks.some(stock => stock._id === match.params.stockId)) {
									if (match.params.stockId || currentUser.activeStockId) {
										return <Redirect to={`/stocks/${match.params.stockId || currentUser.activeStockId}/dashboard`} />;
									}
								}

								return <StockNotFoundFallback {...props} currentStock={findCurrentStock(props.match)} />;
							}}
						</Route>
						<Route path="/stocks/:stockId/dashboard" exact strict sensitive>
							{props => <StockDashboardFallback {...props} currentStock={findCurrentStock(props.match)} />}
						</Route>
						<Route path="/stocks/:stockId/availability" exact strict sensitive>
							{props => <StockAvailabilityFallback {...props} currentStock={findCurrentStock(props.match)} />}
						</Route>
						<Route path="/stocks/:stockId/write-offs" exact strict sensitive>
							{props => <StockWriteOffsFallback {...props} currentStock={findCurrentStock(props.match)} />}
						</Route>
						<Route path={'/stocks/:stockId/procurements'} exact strict sensitive>
							{props => <StockProcurementsFallback {...props} currentStock={findCurrentStock(props.match)} />}
						</Route>
						<Route path={'/stocks/:stockId/procurements/:procurementId'} exact strict sensitive>
							{props => <StockProcurementFallback {...props} currentStock={findCurrentStock(props.match)} />}
						</Route>
						<Route path="/stocks/:stockId/statistics" exact strict sensitive>
							{props => <StockStatisticsFallback {...props} currentStock={findCurrentStock(props.match)} />}
						</Route>
						<Route path="/stocks/:stockId/settings" exact strict sensitive>
							{props => <StockSettingsFallback {...props} currentStock={findCurrentStock(props.match)} />}
						</Route>

						<Route path="/settings" component={UserSettingsFallback} exact strict sensitive />

						<Route path="*" component={PageNotFound} />
					</Switch>
				</div>
			</ThemeProvider>
		);
	}
}

export default compose(withCurrentUser)(Routes);
