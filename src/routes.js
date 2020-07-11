import React from 'react';
import { compose } from 'redux';
import { Route, Switch, Redirect } from 'react-router';
import { SnackbarProvider } from 'notistack';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ThemeProvider } from '@material-ui/core/styles';

import generateMetaInfo from 'shared/generate-meta-info';

import { CLIENT_URL } from 'src/api/constants';

import { BliksideTheme } from 'src/helpers/MuiTheme';
import useStylesSnackbar from 'src/helpers/snackbarStyles';
import signedOutFallback from 'src/helpers/signed-out-fallback';

import AuthViewHandler from 'src/components/authViewHandler';
import Head from 'src/components/head';
import { Layout } from 'src/components/Layout';
import HelpPanel from 'src/components/HelpPanel';
import Sidebar from 'src/components/Sidebar';
import Snackbar from 'src/components/Snackbar';
import { withCurrentUser } from 'src/components/withCurrentUser';
import Status from 'src/components/Status';

import Login from 'src/pages/Login';
import PageNotFound from 'src/pages/PageNotFound';
import PasswordRecovery from 'src/pages/PasswordRecovery';
import Dashboard from 'src/pages/Dashboard';
import Availability from 'src/pages/Availability';
import Position from 'src/pages/Position';
import WriteOffs from 'src/pages/WriteOffs';
import Stocktaking from 'src/pages/Stocktaking';
import Procurements from 'src/pages/Procurements';
import Procurement from 'src/pages/Procurement';
import Invoices from 'src/pages/Invoices';
import Invoice from 'src/pages/Invoice';
import Members from 'src/pages/Members';
import Member from 'src/pages/Member';
import Settings from 'src/pages/Settings';
import Registration from 'src/pages/Registration';
import UserSettings from 'src/pages/UserSettings';

import stylesPage from 'src/styles/page.module.css';
import stylesAppShell from 'src/styles/appShell.module.css';

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
	() => <Layout children={<Dashboard />} authed />,
	() => <Layout children={<Login redirectPath={`${CLIENT_URL}/dashboard`} />} />
);

const AvailabilityFallback = signedOutFallback(
	props => <Layout children={<Availability match={props.match} />} authed />,
	() => <Layout children={<Login redirectPath={`${CLIENT_URL}/availability`} />} />
);

const PositionFallback = signedOutFallback(
	props => <Layout children={<Position match={props.match} />} authed />,
	({ match }) => <Layout children={<Login redirectPath={`${CLIENT_URL}/availability/${match.params.positionId}`} />} />
);

const WriteOffsFallback = signedOutFallback(
	props => <Layout children={<WriteOffs match={props.match} />} authed />,
	() => <Layout children={<Login redirectPath={`${CLIENT_URL}/write-offs`} />} />
);

const StocktakingFallback = signedOutFallback(
	props => <Layout children={<Stocktaking match={props.match} />} authed />,
	() => <Layout children={<Login redirectPath={`${CLIENT_URL}/stocktaking`} />} />
);

const ProcurementsFallback = signedOutFallback(
	props => <Layout children={<Procurements match={props.match} />} authed />,
	() => <Layout children={<Login redirectPath={`${CLIENT_URL}/procurements`} />} />
);

const ProcurementFallback = signedOutFallback(
	props => <Layout children={<Procurement match={props.match} />} authed />,
	({ match }) => <Layout children={<Login redirectPath={`${CLIENT_URL}/procurements/${match.params.procurementId}`} />} />
);

const InvoicesFallback = signedOutFallback(
	props => <Layout children={<Invoices match={props.match} />} authed />,
	() => <Layout children={<Login redirectPath={`${CLIENT_URL}/invoices`} />} />
);

const InvoiceFallback = signedOutFallback(
	props => <Layout children={<Invoice match={props.match} />} authed />,
	({ match }) => <Layout children={<Login redirectPath={`${CLIENT_URL}/invoices/${match.params.invoiceId}`} />} />
);

const MembersFallback = signedOutFallback(
	props => <Layout children={<Members match={props.match} />} authed />,
	() => <Layout children={<Login redirectPath={`${CLIENT_URL}/members`} />} />
);

const MemberFallback = signedOutFallback(
	props => <Layout children={<Member match={props.match} />} authed />,
	({ match }) => <Layout children={<Login redirectPath={`${CLIENT_URL}/members/${match.params.memberId}`} />} />
);

const SettingsFallback = signedOutFallback(
	() => <Layout children={<Settings />} authed />,
	() => <Layout children={<Login redirectPath={`${CLIENT_URL}/settings`} />} />
);

const UserSettingsFallback = signedOutFallback(
	() => <Layout children={<UserSettings />} authed />,
	() => <Layout children={<Login redirectPath={`${CLIENT_URL}/user-settings`} />} />
);

const snackbarSettings = {
	maxSnack: 5,
	anchorOrigin: {
		vertical: 'bottom',
		horizontal: 'left',
	},
	preventDuplicate: true,
	autoHideDuration: 7000,
	iconVariant: {
		success: <FontAwesomeIcon icon={['fal', 'check-circle']} />,
		error: <FontAwesomeIcon icon={['fal', 'times-circle']} />,
		warning: <FontAwesomeIcon icon={['fal', 'exclamation-circle']} />,
		info: <FontAwesomeIcon icon={['fal', 'exclamation-circle']} />,
	},
};

const Routes = props => {
	const { currentUser, currentStudio, currentMember } = props;
	const { title, description } = generateMetaInfo();
	const classesSnackbar = useStylesSnackbar();

	return (
		<ThemeProvider theme={BliksideTheme}>
			<SnackbarProvider
				classes={{
					message: classesSnackbar.message,
					variantSuccess: classesSnackbar.success,
					variantError: classesSnackbar.error,
					variantWarning: classesSnackbar.warning,
					variantInfo: classesSnackbar.info,
				}}
				{...snackbarSettings}
			>
				{/* Метатеги по умолчанию, переопределяемые чем-нибудь вниз по дереву */}
				<Head title={title} description={description} />

				<Snackbar />
				{currentUser && currentUser._id && currentStudio && currentStudio._id && currentMember && currentMember._id ? <Status /> : null}

				{/*
         AuthViewHandler often returns null, but is responsible for triggering
         things like the 'set username' prompt when a user auths and doesn't
         have a username set.
         */}
				<AuthViewHandler>{() => null}</AuthViewHandler>

				<div className={stylesAppShell.container}>
					<div className={stylesPage.pageWrapper}>
						{currentUser && currentUser._id && currentStudio && currentStudio._id && currentMember && currentMember._id ? (
							<HelpPanel />
						) : null}
						{currentUser && currentUser._id && currentStudio && currentStudio._id && currentMember && currentMember._id ? (
							<Sidebar />
						) : null}

						{/*
             Switch отображает только первое совпадение. Внутренняя маршрутизация происходит вниз по течению
             https://reacttraining.com/react-router/web/api/Switch
             */}
						<Switch>
							{/* Публичные бизнес страницы */}
							{/* Страницы приложения */}
							<Route path="/" exact strict sensitive>
								{() => {
									if (currentUser && currentUser._id && currentStudio && currentStudio._id && currentMember && currentMember._id) {
										return <Redirect to="/dashboard" push />;
									} else {
										return <Redirect to="/login" push />;
									}
								}}
							</Route>

							<Route path="/login" component={LoginFallback} exact strict sensitive />
							<Route path="/registration" component={RegistrationFallback} exact strict sensitive />
							<Route path="/password-recovery" component={PasswordRecoveryFallback} exact strict sensitive />

							<Route path="/dashboard" component={DashboardFallback} exact strict sensitive />
							<Route path="/availability" component={AvailabilityFallback} exact strict sensitive />
							<Route path="/availability/:positionId" component={PositionFallback} exact strict sensitive />
							<Route path="/write-offs" component={WriteOffsFallback} exact strict sensitive />
							<Route path="/stocktaking" component={StocktakingFallback} exact strict sensitive />
							<Route path="/procurements" component={ProcurementsFallback} exact strict sensitive />
							<Route path="/procurements/:procurementId" component={ProcurementFallback} exact strict sensitive />
							<Route path="/invoices" component={InvoicesFallback} exact strict sensitive />
							<Route path="/invoices/:invoiceId" component={InvoiceFallback} exact strict sensitive />
							<Route path={['/members', '/members/guests']} component={MembersFallback} exact strict sensitive />
							<Route path="/members/:memberId" component={MemberFallback} exact strict sensitive />
							<Route path="/settings" component={SettingsFallback} exact strict sensitive />

							<Route path="/user-settings" component={UserSettingsFallback} exact strict sensitive />

							<Route path="*" component={PageNotFound} />
						</Switch>
					</div>
				</div>
			</SnackbarProvider>
		</ThemeProvider>
	);
};

export default compose(withCurrentUser)(Routes);
