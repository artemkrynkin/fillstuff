import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';

import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import ButtonBase from '@material-ui/core/ButtonBase';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Money from 'src/components/Money';
import { LoadingComponent } from 'src/components/Loading';

import { createInvoice } from 'src/actions/invoices';
import { enqueueSnackbar } from 'src/actions/snackbars';

import Invoice from './Invoice';

import { TableCell } from '../components/styles';
import styles from './Invoices.module.css';

const momentDate = moment();

const Invoices = props => {
	const { member, invoicesData, updateMember, getInvoices } = props;
	const [showInvoices, setShowInvoices] = useState(3);

	const createInvoice = () => {
		props.createInvoice().then(response => {
			if (response.status === 'success') {
				const {
					data: { member, invoice },
				} = response;

				props.enqueueSnackbar({
					message: (
						<div>
							<b>Успешно!</b>
							<br />
							Участнику <b>{member.user.name || member.user.email}</b> выставлен счет за период{' '}
							<Link to={`/invoices/${invoice._id}`}>
								{moment(invoice.fromDate).format('DD.MM.YYYY')} &ndash; {moment(invoice.toDate).format('DD.MM.YYYY')}
							</Link>
							.
						</div>
					),
					options: {
						variant: 'success',
					},
				});

				updateMember({
					status: response.status,
					data: member,
				});
				getInvoices();
			}

			if (response.status === 'error') {
				props.enqueueSnackbar({
					message: response.message || 'Неизвестная ошибка.',
					options: {
						variant: 'error',
					},
				});
			}
		});
	};

	const nextBillingDateIsCurrentYear = momentDate.isSame(member.nextBillingDate, 'year');

	const onShowInvoices = length => setShowInvoices(length);

	return (
		<div>
			<Typography variant="h6" gutterBottom>
				Задолженность
			</Typography>
			<Grid className={styles.debt} container>
				<Grid xs={2} item>
					<div className={styles.debtTitle}>Общая</div>
					<div className={styles.debtContent}>
						<Money value={member.billingDebt} />
					</div>
				</Grid>
				<Grid xs={2} item>
					<div className={styles.debtTitle}>Текущая</div>
					<div className={styles.debtContent}>
						<Money value={member.billingPeriodDebt} />
					</div>
				</Grid>
				<Grid xs={3} item>
					<Button onClick={createInvoice} variant="outlined" color="primary">
						Выставить счет
					</Button>
				</Grid>
			</Grid>
			<Grid container>
				<div className={styles.infoSmall}>
					Счет будет выставлен {moment(member.nextBillingDate).format(nextBillingDateIsCurrentYear ? 'D MMMM' : 'D MMMM YYYY')}
				</div>
				<ButtonBase className={`${styles.buttonLink} ${styles.infoItem}`} component="span">
					Изменить дату выставления счетов
				</ButtonBase>
			</Grid>

			<Divider style={{ margin: '30px -15px' }} />

			<Typography variant="h6" gutterBottom>
				Выставленные счета
			</Typography>
			<div className={styles.invoices}>
				{invoicesData && invoicesData.status === 'success' && invoicesData.data.length ? (
					<div>
						<Table style={{ tableLayout: 'fixed', marginBottom: -20 }}>
							<TableHead>
								<TableRow>
									<TableCell width={200}>Дата выставления счета</TableCell>
									<TableCell width={240}>Расчетный период</TableCell>
									<TableCell width={140}>Статус</TableCell>
									<TableCell align="right" width={140}>
										Сумма
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{invoicesData.data.map((invoice, index) => {
									if (index + 1 > showInvoices) return null;

									return <Invoice key={invoice._id} invoice={invoice} />;
								})}
							</TableBody>
						</Table>
						{invoicesData.data.length > showInvoices ? (
							<Grid justify="center" container>
								<Button onClick={() => onShowInvoices(invoicesData.data.length)} variant="outlined" style={{ marginTop: 25 }}>
									Показать все счета
								</Button>
							</Grid>
						) : null}
					</div>
				) : invoicesData && invoicesData.status === 'success' && !invoicesData.data.length ? (
					<Typography>Еще нет ни одного выставленного счета.</Typography>
				) : invoicesData && invoicesData.status === 'error' ? (
					<Typography>Не удалось загрузить выставленные счета.</Typography>
				) : !invoicesData ? (
					<LoadingComponent />
				) : null}
			</div>
		</div>
	);
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { member } = ownProps;

	return {
		createInvoice: () => dispatch(createInvoice({ params: { memberId: member._id } })),
		enqueueSnackbar: (...args) => dispatch(enqueueSnackbar(...args)),
	};
};

export default connect(null, mapDispatchToProps)(Invoices);
