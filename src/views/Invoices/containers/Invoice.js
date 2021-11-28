import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ButtonBase from '@material-ui/core/ButtonBase';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Collapse from '@material-ui/core/Collapse';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Tooltip from '@material-ui/core/Tooltip';

import CardPaper from 'src/components/CardPaper';
import Money from 'src/components/Money';
import UserSummary from 'src/components/UserSummary';

import Position from './Position';
import Payment from './Payment';

import { TableCell } from '../components/styles';
import styles from './Invoice.module.css';

const Invoice = props => {
	const { invoice, onOpenDialogInvoice } = props;
	const [expanded, setExpanded] = useState(false);
	const [tabName, setTabName] = useState('positions');

	const onChangeTab = (event, tabName) => setTabName(tabName);

	const onHandleExpand = () => {
		if (!expanded && tabName === 'payments') onChangeTab(null, 'positions');

		setExpanded(!expanded);
	};

	return (
		<CardPaper className={styles.container} header={false}>
			<div className={styles.wrapper}>
				<div className={styles.header} onClick={onHandleExpand}>
					<Grid container>
						<Grid xs={6} item>
							<Link className={styles.title} onClick={event => event.stopPropagation()} to={`/invoices/${invoice._id}`}>
								Счет за {moment(invoice.fromDate).format('DD.MM.YYYY')} &ndash; {moment(invoice.toDate).format('DD.MM.YYYY')}
							</Link>
							<UserSummary src={invoice.member.user.picture} title={invoice.member.user.name} />
						</Grid>
						<Grid xs={6} item>
							<Grid className={styles.indicators} direction="column" justifyContent="center" container>
								{invoice.status !== 'paid' ? (
									<div className={styles.indicatorsTitle}>
										<Tooltip title="Погасить счет" placement="top">
											<button
												onClick={event => {
													event.stopPropagation();
													onOpenDialogInvoice('dialogInvoicePaymentCreate', invoice);
												}}
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
									<Grid className={styles.indicatorsDetails} justifyContent="flex-end" container>
										<Grid justifyContent="flex-end" container>
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
				</div>
				<Collapse in={expanded} timeout="auto" unmountOnExit>
					<Tabs className={styles.tabs} value={tabName} onChange={onChangeTab}>
						<Tab value="positions" label="Позиции" id="positions" />
						{invoice.payments.length ? <Tab value="payments" label="Платежи" id="payments" /> : null}
					</Tabs>
					{tabName === 'positions' ? (
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
								{invoice.positions.map(position => (
									<Position key={position._id} position={position} />
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
								{invoice.payments.map(payment => (
									<Payment key={payment._id} payment={payment} />
								))}
							</TableBody>
						</Table>
					) : null}
				</Collapse>
				<ButtonBase className={ClassNames(styles.detailsButton, { open: expanded })} onClick={onHandleExpand}>
					<FontAwesomeIcon icon={['far', 'chevron-down']} className={expanded ? 'open' : ''} />
				</ButtonBase>
			</div>
		</CardPaper>
	);
};

export default Invoice;
