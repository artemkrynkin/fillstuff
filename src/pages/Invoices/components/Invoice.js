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
import Button from '@material-ui/core/Button';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

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
										onClick={() => onOpenDialogInvoice('dialogInvoicePaymentCreate', invoice)}
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
