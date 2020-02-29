import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import loadable from '@loadable/component';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

import { history } from 'src/helpers/history';

import CardPaper from 'src/components/CardPaper';
import Money from 'src/components/Money';
import AvatarTitle from 'src/components/AvatarTitle';

import { getInvoice } from 'src/actions/invoices';

import WriteOff from './WriteOff';
import Payment from './Payment';

import { TableCell } from './styles';
import styles from './Invoice.module.css';

const DialogInvoicePaymentCreate = loadable(() =>
	import('src/pages/Dialogs/InvoicePaymentCreate' /* webpackChunkName: "Dialog_InvoicePaymentCreate" */)
);

class Invoice extends Component {
	state = {
		invoiceData: null,
		dialogOpenedName: '',
		dialogInvoicePaymentCreate: false,
		tabName: 'writeOffs',
	};

	onOpenDialogByName = (dialogName, invoice) =>
		this.setState({
			invoice: invoice,
			dialogOpenedName: dialogName,
			[dialogName]: true,
		});

	onCloseDialogByName = dialogName => this.setState({ [dialogName]: false });

	getInvoice = () => {
		this.props.getInvoice().then(response => {
			if (response.status === 'success') {
				this.setState({ invoiceData: response });
			} else {
				history.push({
					pathname: '/invoices',
				});
			}
		});
	};

	onChangeTab = (event, tabName) => this.setState({ tabName });

	componentDidMount() {
		this.props.getInvoice().then(response => {
			if (response.status === 'success') {
				this.setState({ invoiceData: response });
			} else {
				history.push({
					pathname: '/invoices',
				});
			}
		});
	}

	render() {
		const { invoiceData, dialogOpenedName, dialogInvoicePaymentCreate, tabName } = this.state;

		if (!invoiceData || !invoiceData.data) return <div children={<CircularProgress size={20} />} style={{ textAlign: 'center' }} />;

		const { data: invoice } = invoiceData;

		return (
			<CardPaper className={styles.container} header={false}>
				<div className={styles.wrapper}>
					<Grid className={styles.header} container>
						<Grid xs={6} item>
							<div className={styles.title}>
								Счет за {moment(invoice.fromDate).format('DD.MM.YYYY')} &ndash; {moment(invoice.toDate).format('DD.MM.YYYY')}
							</div>
							<AvatarTitle imageSrc={invoice.member.user.avatar} title={invoice.member.user.name} />
						</Grid>
						<Grid xs={6} item>
							<Grid alignItems="flex-end" justify="flex-start" direction="column" container>
								{invoice.status !== 'paid' ? (
									<div className={styles.titleGrey}>
										К оплате: <Money value={invoice.amount - invoice.paymentAmountDue} />
									</div>
								) : invoice.status === 'paid' ? (
									<div
										className={ClassNames({
											[styles.titleGrey]: true,
											[styles.invoicePaid]: true,
										})}
									>
										<FontAwesomeIcon icon={['fal', 'check-circle']} />
										Счет оплачен {moment(invoice.datePayment).format('DD.MM.YYYY')}
									</div>
								) : null}

								{invoice.status !== 'unpaid' ? (
									<Grid className={styles.containerSmallInfo} alignItems="flex-end" justify="flex-start" direction="column" container>
										<div className={styles.smallText}>
											Сумма платежа: <Money value={invoice.paymentAmountDue} />
										</div>
										<div className={styles.smallText}>
											Сумма по счету: <Money value={invoice.amount} />
										</div>
									</Grid>
								) : null}

								{invoice.status !== 'paid' ? (
									<Button
										className={styles.acceptPayment}
										onClick={() => this.onOpenDialogByName('dialogInvoicePaymentCreate', invoice)}
										variant="outlined"
										color="primary"
										size="small"
									>
										Погасить счет
									</Button>
								) : null}
							</Grid>
						</Grid>
					</Grid>
					<Tabs className={styles.tabs} value={tabName} onChange={this.onChangeTab}>
						<Tab value="writeOffs" label="Списания" id="invoices" />
						{invoice.payments.length ? <Tab value="payments" label="Платежи" id="settings" /> : null}
					</Tabs>
					{tabName === 'writeOffs' ? (
						<Table style={{ tableLayout: 'fixed' }}>
							<TableHead>
								<TableRow>
									<TableCell width={280}>Позиция</TableCell>
									<TableCell align="right" width={125}>
										Количество
									</TableCell>
									<TableCell align="right" width={125}>
										Цена продажи
									</TableCell>
									<TableCell align="right" width={125}>
										Сумма
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{invoice.groupedWriteOffs.map((writeOff, index) => (
									<WriteOff key={index} writeOff={writeOff} />
								))}
							</TableBody>
						</Table>
					) : tabName === 'payments' ? (
						<Table style={{ tableLayout: 'fixed' }}>
							<TableHead>
								<TableRow>
									<TableCell>Участник</TableCell>
									<TableCell align="right">Сумма платежа</TableCell>
									<TableCell align="right">Дата платежа</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{invoice.payments.map((payment, index) => (
									<Payment key={index} payment={payment} />
								))}
							</TableBody>
						</Table>
					) : null}
				</div>

				<DialogInvoicePaymentCreate
					dialogOpen={dialogInvoicePaymentCreate}
					onCloseDialog={() => this.onCloseDialogByName('dialogInvoicePaymentCreate')}
					onExitedDialog={() => this.getInvoice()}
					selectedInvoice={dialogOpenedName === 'dialogInvoicePaymentCreate' ? invoice : null}
				/>
			</CardPaper>
		);
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	const { invoiceId } = ownProps;

	return {
		getInvoice: () => dispatch(getInvoice({ params: { invoiceId } })),
	};
};

export default connect(null, mapDispatchToProps)(Invoice);
