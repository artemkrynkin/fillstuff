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
import Dashboard from 'src/pages/Dashboard';
import Availability from 'src/pages/Availability';
import WriteOffs from 'src/pages/WriteOffs';
import Procurements from 'src/pages/Procurements';
import Procurement from 'src/pages/Procurement';
import Invoices from 'src/pages/Invoices';
import Invoice from 'src/pages/Invoice';
import Statistics from 'src/pages/Statistics';
import Members from 'src/pages/Members';
import Member from 'src/pages/Member';
import Settings from 'src/pages/Settings';
import Registration from 'src/pages/Registration';
import UserSettings from 'src/pages/UserSettings';

import stylesPage from 'src/styles/page.module.css';

const LoginFallback = signedOutFallback(
	() => <Redirect to="/dashboard" />,
	() => <Layout children={<Login />} />
);

const RegistrationFallback = signedOutFallback(
	() => <Redirect to="/dashboard" />,
	() => <Layout children={<Registration />} />
);

const PasswordRecoveryFallback = signedOutFallback(
	() => <Redirect to="/dashboard" />,
	() => <Layout children={<PasswordRecovery />} />
);

const DashboardFallback = signedOutFallback(
	props => (
		<PageFallback {...props}>
			<Dashboard />
		</PageFallback>
	),
	() => <Layout children={<Login redirectPath={`${CLIENT_URL}/dashboard`} />} />
);

const AvailabilityFallback = signedOutFallback(
	props => (
		<PageFallback {...props}>
			<Availability match={props.match} />
		</PageFallback>
	),
	() => <Layout children={<Login redirectPath={`${CLIENT_URL}/availability`} />} />
);

const WriteOffsFallback = signedOutFallback(
	props => (
		<PageFallback {...props}>
			<WriteOffs match={props.match} />
		</PageFallback>
	),
	() => <Layout children={<Login redirectPath={`${CLIENT_URL}/write-offs`} />} />
);

const ProcurementsFallback = signedOutFallback(
	props => (
		<PageFallback {...props}>
			<Procurements match={props.match} />
		</PageFallback>
	),
	() => <Layout children={<Login redirectPath={`${CLIENT_URL}/procurements`} />} />
);

const ProcurementFallback = signedOutFallback(
	props => (
		<PageFallback {...props}>
			<Procurement match={props.match} />
		</PageFallback>
	),
	({ match }) => <Layout children={<Login redirectPath={`${CLIENT_URL}/procurements/${match.params.procurementId}`} />} />
);

const InvoicesFallback = signedOutFallback(
	props => (
		<PageFallback {...props}>
			<Invoices match={props.match} />
		</PageFallback>
	),
	() => <Layout children={<Login redirectPath={`${CLIENT_URL}/invoices`} />} />
);

const InvoiceFallback = signedOutFallback(
	props => (
		<PageFallback {...props}>
			<Invoice match={props.match} />
		</PageFallback>
	),
	({ match }) => <Layout children={<Login redirectPath={`${CLIENT_URL}/invoices/${match.params.invoiceId}`} />} />
);

const MembersFallback = signedOutFallback(
	props => (
		<PageFallback {...props}>
			<Members match={props.match} />
		</PageFallback>
	),
	() => <Layout children={<Login redirectPath={`${CLIENT_URL}/members`} />} />
);

const MemberFallback = signedOutFallback(
	props => (
		<PageFallback {...props}>
			<Member match={props.match} />
		</PageFallback>
	),
	({ match }) => <Layout children={<Login redirectPath={`${CLIENT_URL}/member/${match.params.memberId}`} />} />
);

const StatisticsFallback = signedOutFallback(
	props => (
		<PageFallback {...props}>
			<Statistics />
		</PageFallback>
	),
	() => <Layout children={<Login redirectPath={`${CLIENT_URL}/statistics`} />} />
);

const SettingsFallback = signedOutFallback(
	props => (
		<PageFallback {...props}>
			<Settings />
		</PageFallback>
	),
	() => <Layout children={<Login redirectPath={`${CLIENT_URL}/settings`} />} />
);

const UserSettingsFallback = signedOutFallback(
	() => <Layout children={<UserSettings />} authed />,
	() => <Layout children={<Login redirectPath={`${CLIENT_URL}/user-settings`} />} />
);

const PageFallback = props => {
	return <Layout children={props.children} authed />;
};

class Routes extends Component {
	render() {
		const { currentUser, currentStudio, currentMember } = this.props;
		const { title, description } = generateMetaInfo();

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

					{currentUser && currentUser._id && currentStudio && currentStudio._id && currentMember && currentMember._id ? <Sidebar /> : null}

					{/*
           Switch отображает только первое совпадение. Внутренняя маршрутизация происходит вниз по течению
           https://reacttraining.com/react-router/web/api/Switch
           */}
					<Switch>
						{/* Публичные бизнес страницы */}
						{/* Страницы приложения */}
						<Route path="/" exact strict sensitive>
							{() => {
								if (currentUser && currentUser._id && currentStudio && currentStudio._id && currentMember && currentMember._id)
									return <Redirect to="/dashboard" push />;
								else return <Redirect to="/login" push />;
							}}
						</Route>

						<Route path="/login" component={LoginFallback} exact strict sensitive />
						<Route path="/registration" component={RegistrationFallback} exact strict sensitive />
						<Route path="/password-recovery" component={PasswordRecoveryFallback} exact strict sensitive />

						<Route path="/dashboard" component={DashboardFallback} exact strict sensitive />
						<Route path="/availability" component={AvailabilityFallback} exact strict sensitive />
						<Route path="/write-offs" component={WriteOffsFallback} exact strict sensitive />
						<Route path="/procurements" component={ProcurementsFallback} exact strict sensitive />
						<Route path="/procurements/:procurementId" component={ProcurementFallback} exact strict sensitive />
						<Route path="/invoices" component={InvoicesFallback} exact strict sensitive />
						<Route path="/invoices/:invoiceId" component={InvoiceFallback} exact strict sensitive />
						<Route path={['/members', '/members/guests']} component={MembersFallback} exact strict sensitive />
						<Route path="/members/:memberId" component={MemberFallback} exact strict sensitive />
						<Route path="/statistics" component={StatisticsFallback} exact strict sensitive />
						<Route path="/settings" component={SettingsFallback} exact strict sensitive />

						<Route path="/user-settings" component={UserSettingsFallback} exact strict sensitive />

						<Route path="*" component={PageNotFound} />
					</Switch>
				</div>
			</ThemeProvider>
		);
	}
}

export default compose(withCurrentUser)(Routes);
