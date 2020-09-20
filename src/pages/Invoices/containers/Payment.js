import React from 'react';
import moment from 'moment';

import TableRow from '@material-ui/core/TableRow';

import { formatNumber } from 'shared/utils';

import NumberFormat, { currencyMoneyFormatProps } from 'src/components/NumberFormat';
import AvatarTitle from 'src/components/AvatarTitle';

import { TableCell } from '../components/styles';
import styles from './Payment.module.css';

const Payment = props => {
	const { payment } = props;

	return (
		<TableRow>
			<TableCell>
				<AvatarTitle
					classNames={{
						container: styles.avatar,
					}}
					imageSrc={payment.merchant.user.avatar}
					title={payment.merchant.user.name}
				/>
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
