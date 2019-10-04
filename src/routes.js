import React, { Component } from 'react';
import { compose } from 'redux';
import { Route, Switch, Redirect } from 'react-router';

import { ThemeProvider } from '@material-ui/styles';

import generateMetaInfo from 'shared/generate-meta-info';

import { CLIENT_URL } from './api/constants';

import { BliksideTheme } from 'src/helpers/MuiTheme';
import signedOutFallback from 'src/helpers/signed-out-fallback';

import AuthViewHandler from 'src/components/authViewHandler';
import Head from 'src/components/head';
import Layout from 'src/components/Layout';
import Sidebar from './components/Sidebar';
import { withCurrentUser } from 'src/components/withCurrentUser';

import Login from 'src/containers/Login';
import PageNotFound from 'src/containers/PageNotFound';
import PasswordRecovery from 'src/containers/PasswordRecovery';
import StockNotFound from 'src/containers/StockNotFound';
import StockDashboard from 'src/containers/StockDashboard';
import StockAvailability from 'src/containers/StockAvailability';
import StockWriteOffs from 'src/containers/StockWriteOffs';
import StockOrders from 'src/containers/StockOrders';
import StockPurchases from 'src/containers/StockPurchases';
import StockStatistics from 'src/containers/StockStatistics';
import StockSettings from 'src/containers/StockSettings';
import Registration from 'src/containers/Registration';
import UserSettings from 'src/containers/UserSettings';

import stylesPage from 'src/styles/page.module.css';

const LoginFallback = signedOutFallback(() => <Redirect to="/stocks" />, () => <Layout children={<Login />} />);

const RegistrationFallback = signedOutFallback(() => <Redirect to="/stocks" />, () => <Layout children={<Registration />} />);

const PasswordRecoveryFallback = signedOutFallback(() => <Redirect to="/stocks" />, () => <Layout children={<PasswordRecovery />} />);

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

const StockOrdersFallback = signedOutFallback(
	props => (
		<StockPageFallback {...props}>
			<StockOrders currentStock={props.currentStock} match={props.match} />
		</StockPageFallback>
	),
	({ match }) => <Layout children={<Login redirectPath={`${CLIENT_URL}/stocks/${match.params.stockId}/orders`} />} />
);

const StockPurchasesFallback = signedOutFallback(
	props => (
		<StockPageFallback {...props}>
			<StockPurchases currentStock={props.currentStock} match={props.match} />
		</StockPageFallback>
	),
	({ match }) => <Layout children={<Login redirectPath={`${CLIENT_URL}/stocks/${match.params.stockId}/purchases`} />} />
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

						<Route
							path={['/stocks', '/stocks/:stockId']}
							render={props => {
								const { match } = props;

								if (Array.isArray(stocks) && stocks.some(stock => stock._id === match.params.stockId)) {
									if (match.params.stockId || currentUser.activeStockId) {
										return <Redirect to={`/stocks/${match.params.stockId || currentUser.activeStockId}/dashboard`} />;
									}
								}

								return <StockNotFoundFallback {...props} currentStock={findCurrentStock(props.match)} />;
							}}
							exact
							strict
							sensitive
						/>
						<Route
							path="/stocks/:stockId/dashboard"
							render={props => <StockDashboardFallback {...props} currentStock={findCurrentStock(props.match)} />}
							exact
							strict
							sensitive
						/>
						<Route
							path="/stocks/:stockId/availability"
							render={props => <StockAvailabilityFallback {...props} currentStock={findCurrentStock(props.match)} />}
							exact
							strict
							sensitive
						/>
						<Route
							path={['/stocks/:stockId/write-offs', '/stocks/:stockId/write-offs/:selectedUserId']}
							render={props => <StockWriteOffsFallback {...props} currentStock={findCurrentStock(props.match)} />}
							exact
							strict
							sensitive
						/>
						<Route
							path="/stocks/:stockId/orders"
							render={props => <StockOrdersFallback {...props} currentStock={findCurrentStock(props.match)} />}
							exact
							strict
							sensitive
						/>
						<Route
							path={'/stocks/:stockId/purchases'}
							render={props => <StockPurchasesFallback {...props} currentStock={findCurrentStock(props.match)} />}
							exact
							strict
							sensitive
						/>
						<Route
							path="/stocks/:stockId/statistics"
							render={props => <StockStatisticsFallback {...props} currentStock={findCurrentStock(props.match)} />}
							exact
							strict
							sensitive
						/>
						<Route
							path="/stocks/:stockId/settings"
							render={props => <StockSettingsFallback {...props} currentStock={findCurrentStock(props.match)} />}
							exact
							strict
							sensitive
						/>

						<Route path="/settings" component={UserSettingsFallback} exact strict sensitive />

						<Route path="*" component={PageNotFound} />
					</Switch>
				</div>
			</ThemeProvider>
		);
	}
}

export default compose(withCurrentUser)(Routes);
