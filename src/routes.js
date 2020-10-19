import React from 'react';
import { compose } from 'redux';
import { Route, Switch, Redirect } from 'react-router';
import { SnackbarProvider } from 'notistack';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ThemeProvider } from '@material-ui/core/styles';

import generateMetaInfo from 'shared/generate-meta-info';

import { CLIENT_URL } from 'src/api/constants';

import { MuiTheme } from 'src/helpers/MuiTheme';
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

import Login from 'src/views/Login';
import PageNotFound from 'src/views/PageNotFound';
import PasswordRecovery from 'src/views/PasswordRecovery';
import Dashboard from 'src/views/Dashboard';
import Stock from 'src/views/Stock';
import Position from 'src/views/Position';
import WriteOffs from 'src/views/WriteOffs';
import Stocktaking from 'src/views/Stocktaking';
import Procurements from 'src/views/Procurements';
import Procurement from 'src/views/Procurement';
import Invoices from 'src/views/Invoices';
import Invoice from 'src/views/Invoice';
import Members from 'src/views/Members';
import Member from 'src/views/Member';
import Settings from 'src/views/Settings';
import Signup from 'src/views/Signup';
import UserSettings from 'src/views/UserSettings';

import stylesPage from 'src/styles/page.module.css';

const LoginFallback = signedOutFallback(
	() => <Redirect to="/dashboard" />,
	() => <Layout children={<Login />} />
);

const SignupFallback = signedOutFallback(
	() => <Redirect to="/dashboard" />,
	() => <Layout children={<Signup />} />
);

const PasswordRecoveryFallback = signedOutFallback(
	() => <Redirect to="/dashboard" />,
	() => <Layout children={<PasswordRecovery />} />
);

const DashboardFallback = signedOutFallback(
	() => <Layout children={<Dashboard />} authed />,
	() => <Layout children={<Login redirectPath={`${CLIENT_URL}/dashboard`} />} />
);

const StockFallback = signedOutFallback(
	props => <Layout children={<Stock match={props.match} />} authed />,
	() => <Layout children={<Login redirectPath={`${CLIENT_URL}/stock`} />} />
);

const PositionFallback = signedOutFallback(
	props => <Layout children={<Position match={props.match} />} authed />,
	({ match }) => <Layout children={<Login redirectPath={`${CLIENT_URL}/stock/${match.params.positionId}`} />} />
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
		<ThemeProvider theme={MuiTheme}>
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

				<div>
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
							<Route path="/" exact strict>
								{() => {
									if (currentUser && currentUser._id && currentStudio && currentStudio._id && currentMember && currentMember._id) {
										return <Redirect to="/dashboard" push />;
									} else {
										return <Redirect to="/login" push />;
									}
								}}
							</Route>

							<Route path={['/login', '/login/']} component={LoginFallback} exact strict />
							<Route path={['/signup', '/signup/']} component={SignupFallback} exact strict />
							<Route path={['/password-recovery', '/password-recovery/']} component={PasswordRecoveryFallback} exact strict />

							<Route path={['/dashboard', '/dashboard/']} component={DashboardFallback} exact strict />
							<Route path={['/stock', '/stock/']} component={StockFallback} exact strict />
							<Route path={['/stock/:positionId', '/stock/:positionId/']} component={PositionFallback} exact strict />
							<Route path={['/write-offs', '/write-offs/']} component={WriteOffsFallback} exact strict />
							<Route path={['/stocktaking', '/stocktaking/']} component={StocktakingFallback} exact strict />
							<Route path={['/procurements', '/procurements/']} component={ProcurementsFallback} exact strict />
							<Route
								path={['/procurements/:procurementId', '/procurements/:procurementId/']}
								component={ProcurementFallback}
								exact
								strict
							/>
							<Route path={['/invoices', '/invoices/']} component={InvoicesFallback} exact strict />
							<Route path={['/invoices/:invoiceId', '/invoices/:invoiceId/']} component={InvoiceFallback} exact strict />
							<Route path={['/members', '/members/', '/members/guests', '/members/guests/']} component={MembersFallback} exact strict />
							<Route path={['/members/:memberId', '/members/:memberId/']} component={MemberFallback} exact strict />
							<Route path={['/settings', '/settings/']} component={SettingsFallback} exact strict />

							<Route path={['/user-settings', '/user-settings/']} component={UserSettingsFallback} exact strict />

							<Route path="*" component={PageNotFound} />
						</Switch>
					</div>
				</div>
			</SnackbarProvider>
		</ThemeProvider>
	);
};

export default compose(withCurrentUser)(Routes);
