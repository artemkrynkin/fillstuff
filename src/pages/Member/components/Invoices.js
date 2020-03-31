import React, { useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

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

import Money from 'src/components/Money';

import { createInvoice } from 'src/actions/invoices';

import Invoice from './Invoice';

import { TableCell } from './styles';
import styles from './Invoices.module.css';

const momentDate = moment();

const Invoices = props => {
	const { member, invoicesData, updateMember, getInvoices } = props;
	const [showInvoices, setShowInvoices] = useState(3);

	const createInvoice = () => {
		props.createInvoice().then(response => {
			if (response.status === 'success') {
				updateMember(response);
				getInvoices();
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
					{member.billingPeriodDebt !== 0 ? (
						<Button onClick={createInvoice} variant="outlined" color="primary">
							Выставить счет
						</Button>
					) : null}
				</Grid>
			</Grid>
			<Grid container>
				<div className={styles.infoSmall}>
					Счет будет выставлен {moment(member.nextBillingDate).format(nextBillingDateIsCurrentYear ? 'D MMMM' : 'D MMMM YYYY')}
				</div>
				<div className={styles.separator}>•</div>
				<ButtonBase className={styles.buttonLink} component="span">
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
