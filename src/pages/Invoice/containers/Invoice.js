import React, { useState } from 'react';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

import CardPaper from 'src/components/CardPaper';
import Money from 'src/components/Money';
import AvatarTitle from 'src/components/AvatarTitle';
import Tooltip from 'src/components/Tooltip';

import WriteOff from './WriteOff';
import Payment from './Payment';

import { TableCell } from './styles';
import styles from './Invoice.module.css';

const Invoice = props => {
	const { invoice, onOpenDialogInvoice } = props;
	const [tabName, setTabName] = useState('writeOffs');

	const onChangeTab = (event, tabName) => setTabName(tabName);

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
						<Grid className={styles.indicators} direction="column" justify="center" container>
							{invoice.status !== 'paid' ? (
								<div className={styles.indicatorsTitle}>
									<Tooltip title="Погасить счет" placement="top" style={{ display: 'inline-block', marginRight: 10 }}>
										<button
											onClick={() => onOpenDialogInvoice('dialogInvoicePaymentCreate', 'invoice', invoice)}
											className={styles.acceptPayment}
										>
											<FontAwesomeIcon icon={['fas', 'wallet']} />
										</button>
									</Tooltip>
									<Money value={invoice.amount - invoice.paymentAmountDue} />
								</div>
							) : (
								<div className={styles.indicatorsTitle2}>
									<FontAwesomeIcon className={styles.invoicePaidIcon} icon={['fal', 'check-circle']} />
									Оплачен
								</div>
							)}

							{invoice.status === 'unpaid' ? (
								<div className={styles.indicatorsSubtitle}>К оплате</div>
							) : (
								<Grid className={styles.indicatorsDetails} justify="flex-end" container>
									<Grid justify="flex-end" container>
										{invoice.status === 'paid' ? (
											<div style={{ marginRight: 30 }}>
												<div className={styles.indicatorsSubtitle2}>{moment(invoice.datePayment).format('DD.MM.YYYY')}</div>
												<div className={styles.indicatorsSubtitle}>Дата оплаты</div>
											</div>
										) : null}
										<div style={{ marginRight: 30 }}>
											<div className={styles.indicatorsSubtitle2}>
												<Money value={invoice.paymentAmountDue} />
											</div>
											<div className={styles.indicatorsSubtitle}>Оплачено</div>
										</div>
										<div>
											<div className={styles.indicatorsSubtitle2}>
												<Money value={invoice.amount} />
											</div>
											<div className={styles.indicatorsSubtitle}>Выставлено</div>
										</div>
									</Grid>
								</Grid>
							)}
						</Grid>
					</Grid>
				</Grid>
				<Tabs className={styles.tabs} value={tabName} onChange={onChangeTab}>
					<Tab value="writeOffs" label="Позиции" id="invoices" />
					{invoice.payments.length ? <Tab value="payments" label="Платежи" id="settings" /> : null}
				</Tabs>
				{tabName === 'writeOffs' ? (
					<Table style={{ tableLayout: 'fixed' }}>
						<TableHead>
							<TableRow>
								<TableCell width={280}>Позиция</TableCell>
								<TableCell />
								<TableCell align="right" width={160}>
									Количество
								</TableCell>
								<TableCell align="right" width={140}>
									Цена
								</TableCell>
								<TableCell align="right" width={140}>
									Сумма
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{invoice.positions.map((writeOff, index) => (
								<WriteOff key={index} writeOff={writeOff} />
							))}
						</TableBody>
					</Table>
				) : tabName === 'payments' ? (
					<Table style={{ tableLayout: 'fixed' }}>
						<TableHead>
							<TableRow>
								<TableCell>Принял</TableCell>
								<TableCell>Дата</TableCell>
								<TableCell />
								<TableCell align="right" width={140}>
									Сумма
								</TableCell>
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
		</CardPaper>
	);
};

export default Invoice;
