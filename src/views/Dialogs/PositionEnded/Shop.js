import React, { Fragment } from 'react';
import moment from 'moment';

import TableRow from '@material-ui/core/TableRow';

import { formatNumber } from 'shared/utils';

import NumberFormat, { currencyMoneyFormatProps } from 'src/components/NumberFormat';

import { TableCell } from './styles';

import styles from './Shop.module.css';

const momentDate = moment();

const Shop = props => {
	const { position, shop } = props;

	const isCurrentYear = shop.lastProcurement ? momentDate.isSame(shop.lastProcurement.createdAt, 'year') : null;

	return (
		<TableRow>
			<TableCell>{shop.shop.name}</TableCell>
			{shop.lastProcurement ? (
				<Fragment>
					<TableCell>{moment(shop.lastProcurement.createdAt).format(isCurrentYear ? 'D MMMM в HH:mm' : 'D MMMM YYYY')}</TableCell>
					<TableCell align="right" width={180}>
						<NumberFormat
							value={formatNumber(shop.lastProcurement.costDelivery, { toString: true })}
							renderText={value => value}
							displayType="text"
							{...currencyMoneyFormatProps}
						/>
					</TableCell>
					<TableCell align="right" width={140}>
						{shop.lastProcurement.receipt.initial.quantity} {position.unitRelease === 'pce' ? 'шт.' : 'уп.'}
					</TableCell>
					<TableCell align="right" width={140}>
						<NumberFormat
							value={formatNumber(shop.lastProcurement.receipt.unitPurchasePrice, { toString: true })}
							renderText={value => value}
							displayType="text"
							{...currencyMoneyFormatProps}
						/>
					</TableCell>
				</Fragment>
			) : (
				<TableCell align="center" colSpan={4}>
					<span className={styles.caption}>Нет данных</span>
				</TableCell>
			)}
		</TableRow>
	);
};

export default Shop;
