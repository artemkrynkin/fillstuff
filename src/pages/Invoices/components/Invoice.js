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
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

import CardPaper from 'src/components/CardPaper';
import Money from 'src/components/Money';

import WriteOff from './WriteOff';

import { TableCell } from './styles';
import styles from './Invoice.module.css';

const Invoice = props => {
	const { invoice, onOpenDialogInvoice } = props;
	const [expanded, setExpanded] = useState(false);

	const onHandleExpand = event => {
		if (
			event.target.classList.contains(styles.title) ||
			event.target.classList.contains(styles.acceptPayment) ||
			(event.target.closest('.' + styles.acceptPayment) &&
				event.target.closest('.' + styles.acceptPayment).classList.contains(styles.acceptPayment))
		)
			return;

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
							<div className={styles.user}>
								<Avatar
									className={styles.userPhoto}
									src={invoice.member.user.avatar}
									alt={invoice.member.user.name}
									children={<div className={styles.userIcon} children={<FontAwesomeIcon icon={['fas', 'user-alt']} />} />}
								/>
								<Grid alignItems="flex-end" container>
									<div className={styles.userName}>{invoice.member.user.name}</div>
								</Grid>
							</div>
						</Grid>
						<Grid xs={6} item>
							<Grid alignItems="flex-end" justify="flex-start" direction="column" container>
								<div className={styles.titleGrey}>
									Сумма по счету: <Money value={invoice.amount} />
								</div>
								{invoice.status === 'partially-paid' ? (
									<div className={styles.smallText}>
										Осталось оплатить: <Money value={invoice.amount - invoice.paymentAmountDue} />
									</div>
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
								) : (
									<Grid alignItems="flex-end" justify="flex-start" direction="column" container>
										<div className={styles.smallText}>
											Сумма платежа: <Money value={invoice.paymentAmountDue} />
										</div>
										<div className={styles.invoicePaid}>
											<FontAwesomeIcon icon={['fal', 'check-circle']} />
											Счет оплачен
										</div>
									</Grid>
								)}
							</Grid>
						</Grid>
					</Grid>
				</div>
				<Collapse in={expanded} timeout={300} unmountOnExit>
					<div className={styles.writeOffs}>
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
					</div>
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
