import React from 'react';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import TableRow from '@material-ui/core/TableRow';

import { formatNumber } from 'shared/utils';

import NumberFormat, { currencyMoneyFormatProps } from 'src/components/NumberFormat';

import { TableCell } from './styles';
import styles from './Payment.module.css';

const Payment = props => {
	const { payment } = props;

	return (
		<TableRow className={styles.payment}>
			<TableCell>
				<div className={styles.user}>
					<Avatar
						className={styles.userPhoto}
						src={payment.merchant.user.avatar}
						alt={payment.merchant.user.name}
						children={<div className={styles.userIcon} children={<FontAwesomeIcon icon={['fas', 'user-alt']} />} />}
					/>
					<Grid className={styles.userDetails} alignItems="flex-end" container>
						<div className={styles.userName}>{payment.merchant.user.name}</div>
					</Grid>
				</div>
			</TableCell>
			<TableCell align="right">
				<NumberFormat
					value={formatNumber(payment.amount, { toString: true })}
					renderText={value => value}
					displayType="text"
					{...currencyMoneyFormatProps}
				/>
			</TableCell>
			<TableCell align="right">{moment(payment.date).format('DD MMMM YYYY')}</TableCell>
		</TableRow>
	);
};

export default Payment;
