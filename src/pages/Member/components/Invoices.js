import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import ClassNames from 'classnames';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import ButtonBase from '@material-ui/core/ButtonBase';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { formatNumber } from 'shared/utils';

import Money from 'src/components/Money';

import { createInvoice } from 'src/actions/invoices';

import { TableCell } from './styles';
import styles from './Invoices.module.css';

const momentDate = moment();

const statusTransform = status => {
	switch (status) {
		case 'paid':
			return 'Оплачен';
		case 'partially-paid':
			return 'Частично оплачен';
		case 'unpaid':
		default:
			return 'Не оплачен';
	}
};

const statusCircleClasses = status =>
	ClassNames({
		[styles.circle]: true,
		[styles.circleRed]: status === 'unpaid',
		[styles.circleYellow]: status === 'partially-paid',
		[styles.circleGreen]: status === 'paid',
	});

const Invoices = props => {
	const { member, invoicesData, updateMember, getInvoices } = props;
	const showInitialInvoices = 3;
	const [showAllInvoices, setShowAllInvoices] = useState(false);

	const createInvoice = () => {
		props.createInvoice().then(response => {
			if (response.status === 'success') {
				updateMember(response);
				getInvoices();
			}
		});
	};

	const nextBillingDateIsCurrentYear = momentDate.isSame(member.nextBillingDate, 'year');

	const onShowAllInvoices = () => setShowAllInvoices(true);

	return (
		<div>
			<div className={styles.title}>Задолженность</div>
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
					<Button onClick={createInvoice} disabled={member.billingPeriodDebt === 0} variant="outlined" color="primary">
						Выставить счет
					</Button>
				</Grid>
			</Grid>
			<Grid container>
				<div className={styles.infoSmall}>
					Счет будет выставлен {moment(member.nextBillingDate).format(nextBillingDateIsCurrentYear ? 'D MMMM' : 'D MMMM YYYY')}
				</div>
				<div className={styles.separator}>•</div>
				<ButtonBase className={styles.buttonLink} component="span" disableRipple>
					Изменить дату выставления счетов
				</ButtonBase>
			</Grid>

			<Divider style={{ margin: '30px -15px' }} />

			<div className={styles.title}>Выставленные счета</div>
			<div className={styles.invoices}>
				{invoicesData && invoicesData.status === 'success' && invoicesData.data.length ? (
					<div>
						<Table style={{ tableLayout: 'fixed', marginBottom: -20 }}>
							<TableHead>
								<TableRow>
									<TableCell width={200}>Дата выставления счета</TableCell>
									<TableCell width={240}>Расчетный период</TableCell>
									<TableCell width={140}>Статус оплаты</TableCell>
									<TableCell align="right" width={140}>
										Сумма
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{invoicesData.data.map((invoice, index) => {
									const isCurrentYear = momentDate.isSame(invoice.createdAt, 'year');

									if (!showAllInvoices && index >= showInitialInvoices) return null;

									return (
										<TableRow key={invoice._id}>
											<TableCell width={200}>
												{moment(invoice.createdAt).format(isCurrentYear ? 'D MMMM в HH:mm' : 'D MMMM YYYY')}
											</TableCell>
											<TableCell width={240}>
												<Link className={styles.buttonLink} to={`/invoices/${invoice._id}`}>
													{moment(invoice.fromDate).format('DD.MM.YYYY')} &ndash; {moment(invoice.toDate).format('DD.MM.YYYY')}
												</Link>
											</TableCell>
											<TableCell width={140}>
												<div className={statusCircleClasses(invoice.status)} />
												{statusTransform(invoice.status)}
											</TableCell>
											<TableCell align="right" width={140}>
												{formatNumber(invoice.amount, { toString: true })} ₽
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
						{!showAllInvoices && invoicesData.data.length >= showInitialInvoices ? (
							<Grid justify="center" container>
								<Button onClick={onShowAllInvoices} variant="outlined" style={{ marginTop: 25 }}>
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
					<div children={<CircularProgress size={20} />} style={{ textAlign: 'center' }} />
				) : null}
			</div>
		</div>
	);
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { member } = ownProps;

	return {
		createInvoice: () => dispatch(createInvoice({ params: { memberId: member._id } })),
	};
};

export default connect(null, mapDispatchToProps)(Invoices);
