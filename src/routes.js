import React from 'react';
import { compose } from 'redux';
import { Route, Switch } from 'react-router';
import { SnackbarProvider } from 'notistack';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ThemeProvider } from '@material-ui/core/styles';

import generateMetaInfo from 'shared/generate-meta-info';

import { CLIENT_URL, ACCOUNT_CLIENT_URL } from 'src/api/constants';

import { MuiTheme } from 'src/helpers/MuiTheme';
import useStylesSnackbar from 'src/helpers/snackbarStyles';
import signedOutFallback from 'src/helpers/signed-out-fallback';

import Head from 'src/components/head';
import Snackbar from 'src/components/Snackbar';
import { withCurrentUser } from 'src/components/withCurrentUser';
import Status from 'src/components/Status';

import GettingStarted from 'src/views/GettingStarted';
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
import PageNotFound from 'src/views/PageNotFound';

const redirectLogin = () => {
	const urlLogin = new URL(`${ACCOUNT_CLIENT_URL}/login`);

	urlLogin.searchParams.set('returnTo', CLIENT_URL);

	window.location.href = urlLogin;
};

const HomeViewRedirectFallback = signedOutFallback(props => {
	const { currentUser } = props;

	if (currentUser.settings.studio && currentUser.settings.member) return <DashboardFallback {...props} />;
	else return <GettingStarted {...props} />;
}, redirectLogin);

const DashboardFallback = signedOutFallback(Dashboard, redirectLogin);

const StockFallback = signedOutFallback(Stock, redirectLogin);

const PositionFallback = signedOutFallback(Position, redirectLogin);

const WriteOffsFallback = signedOutFallback(WriteOffs, redirectLogin);

const StocktakingFallback = signedOutFallback(Stocktaking, redirectLogin);

const ProcurementsFallback = signedOutFallback(Procurements, redirectLogin);

const ProcurementFallback = signedOutFallback(Procurement, redirectLogin);

const InvoicesFallback = signedOutFallback(Invoices, redirectLogin);

const InvoiceFallback = signedOutFallback(Invoice, redirectLogin);

const MembersFallback = signedOutFallback(Members, redirectLogin);

const MemberFallback = signedOutFallback(Member, redirectLogin);

const SettingsFallback = signedOutFallback(Settings, redirectLogin);

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
	const { currentUser, currentStudio } = props;
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
				{currentUser && currentStudio ? <Status /> : null}

				<>
					{/*
           Switch отображает только первое совпадение. Внутренняя маршрутизация происходит вниз по течению
           https://reacttraining.com/react-router/web/api/Switch
           */}
					<Switch>
						{/* Публичные бизнес страницы */}
						{/* Страницы приложения */}
						<Route path="/" component={HomeViewRedirectFallback} exact strict />
						<Route path="/stock" component={StockFallback} exact />
						<Route path="/stock/:positionId" component={PositionFallback} />
						<Route path="/write-offs" component={WriteOffsFallback} />
						<Route path="/stocktaking" component={StocktakingFallback} />
						<Route path="/procurements" component={ProcurementsFallback} exact />
						<Route path="/procurements/:procurementId" component={ProcurementFallback} />
						<Route path="/invoices" component={InvoicesFallback} exact />
						<Route path="/invoices/:invoiceId" component={InvoiceFallback} />
						<Route path={['/members', '/members/guests']} component={MembersFallback} exact />
						<Route path="/members/:memberId" component={MemberFallback} />
						<Route path="/settings" component={SettingsFallback} />

						<Route path="*" component={PageNotFound} />
					</Switch>
				</>
			</SnackbarProvider>
		</ThemeProvider>
	);
};

export default compose(withCurrentUser)(Routes);
