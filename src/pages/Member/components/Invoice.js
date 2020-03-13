import React from 'react';
import ClassNames from 'classnames';
import moment from 'moment';

import TableRow from '@material-ui/core/TableRow';

import { formatNumber } from 'shared/utils';

import NumberFormat, { currencyMoneyFormatProps } from 'src/components/NumberFormat';

import { TableCell } from './styles';
import styles from './Invoice.module.css';

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

const statusColorClasses = status =>
	ClassNames({
		[styles.status]: true,
		[styles.statusRed]: status === 'unpaid',
		[styles.statusYellow]: status === 'partially-paid',
		[styles.statusGreen]: status === 'paid',
	});

const Invoice = props => {
	const { invoice } = props;

	const isCurrentYear = momentDate.isSame(invoice.createdAt, 'year');

	return (
		<TableRow>
			<TableCell width={200}>{moment(invoice.createdAt).format(isCurrentYear ? 'D MMMM в HH:mm' : 'D MMMM YYYY')}</TableCell>
			<TableCell width={240}>
				<a className={styles.buttonLink} href={`/invoices/${invoice._id}`} target="_blank" rel="noreferrer noopener">
					{moment(invoice.fromDate).format('DD.MM.YYYY')} &ndash; {moment(invoice.toDate).format('DD.MM.YYYY')}
				</a>
			</TableCell>
			<TableCell width={140}>
				<span className={statusColorClasses(invoice.status)}>{statusTransform(invoice.status)}</span>
			</TableCell>
			<TableCell align="right" width={140}>
				<NumberFormat
					value={formatNumber(invoice.amount, { toString: true })}
					renderText={value => value}
					displayType="text"
					{...currencyMoneyFormatProps}
				/>
			</TableCell>
		</TableRow>
	);
};

export default Invoice;
