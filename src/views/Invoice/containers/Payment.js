import React from 'react';
import moment from 'moment';

import TableRow from '@material-ui/core/TableRow';

import { formatNumber } from 'shared/utils';

import NumberFormat, { currencyMoneyFormatProps } from 'src/components/NumberFormat';
import UserSummary from 'src/components/UserSummary';

import { TableCell } from '../components/styles';

const Payment = props => {
	const { payment } = props;

	return (
		<TableRow>
			<TableCell>
				<UserSummary src={payment.merchant.user.picture} title={payment.merchant.user.name} />
			</TableCell>
			<TableCell>{moment(payment.date).format('DD MMMM YYYY')}</TableCell>
			<TableCell />
			<TableCell align="right" width={140}>
				<NumberFormat
					value={formatNumber(payment.amount, { toString: true })}
					renderText={value => value}
					displayType="text"
					{...currencyMoneyFormatProps}
				/>
			</TableCell>
		</TableRow>
	);
};

export default Payment;
