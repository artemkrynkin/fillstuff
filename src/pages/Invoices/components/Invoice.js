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
import AvatarTitle from 'src/components/AvatarTitle';

import WriteOff from './WriteOff';
import Payment from './Payment';

import { TableCell } from './styles';
import styles from './Invoice.module.css';

const Invoice = props => {
	const { invoice, onOpenDialogInvoice } = props;
	const [expanded, setExpanded] = useState(false);
	const [tabName, setTabName] = useState('writeOffs');

	const onChangeTab = (event, tabName) => setTabName(tabName);

	const onHandleExpand = event => {
		if (
			event.target.classList.contains(styles.title) ||
			event.target.classList.contains(styles.acceptPayment) ||
			(event.target.closest('.' + styles.acceptPayment) &&
				event.target.closest('.' + styles.acceptPayment).classList.contains(styles.acceptPayment))
		)
			return;

		if (!expanded && tabName === 'payments') onChangeTab(null, 'writeOffs');

		setExpanded(!expanded);
	};

	return (
		<CardPaper className={styles.container} header={false}>
			<div className={styles.wrapper}>
				<div className={styles.header} onClick={onHandleExpand}>
					<Grid container>
						<Grid xs={6} item>
							<Link className={styles.title} to={`/invoices/${invoice._id}`}>
								Счет за {moment(invoice.fromDate).format('DD.MM.YYYY')} &ndash; {moment(invoice.toDate).format('DD.MM.YYYY')}
							</Link>
							<AvatarTitle imageSrc={invoice.member.user.avatar} title={invoice.member.user.name} />
						</Grid>
						<Grid xs={6} item>
							<Grid className={styles.indicators} alignItems="center" container>
								<Grid xs={12} item>
									{invoice.status !== 'paid' ? (
										<div className={styles.indicatorsTitle}>
											<Tooltip title="Погасить счет" placement="top" interactive>
												<button onClick={() => onOpenDialogInvoice('dialogInvoicePaymentCreate', invoice)} className={styles.acceptPayment}>
													<FontAwesomeIcon icon={['fas', 'wallet']} />
												</button>
											</Tooltip>
											<Money value={invoice.amount - invoice.paymentAmountDue} />
										</div>
									) : (
										<div className={styles.indicatorsTitle2}>
											<FontAwesomeIcon className={styles.invoicePaidIcon} icon={['fal', 'check-circle']} />
											Счет оплачен
										</div>
									)}
									<Grid justify="flex-end" container>
										{invoice.status === 'unpaid' ? (
											<div className={styles.indicatorsSubtitle}>К оплате</div>
										) : (
											<div className={styles.indicatorsSubtitle2}>
												<Money value={invoice.paymentAmountDue} /> / <Money value={invoice.amount} />
											</div>
										)}
										{invoice.status === 'paid' ? (
											<div className={styles.indicatorsSubtitle2} style={{ marginLeft: 25 }}>
												{moment(invoice.datePayment).format('D MMMM YYYY')}
											</div>
										) : null}
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</div>
				<Collapse in={expanded} timeout={300} unmountOnExit>
					<Tabs className={styles.tabs} value={tabName} onChange={onChangeTab}>
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
										Цена
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
				</Collapse>
				<ButtonBase
					className={ClassNames({
						[styles.detailsButton]: true,
						open: expanded,
					})}
					onClick={onHandleExpand}
					disableRipple
				>
					<FontAwesomeIcon icon={['far', 'angle-down']} className={expanded ? 'open' : ''} />
				</ButtonBase>
			</div>
		</CardPaper>
	);
};

export default Invoice;
