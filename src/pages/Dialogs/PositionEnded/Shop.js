import React from 'react';
import moment from 'moment';

import TableRow from '@material-ui/core/TableRow';

import { formatNumber } from 'shared/utils';

import NumberFormat, { currencyMoneyFormatProps } from 'src/components/NumberFormat';

import { TableCell } from './styles';

const momentDate = moment();

const Shop = props => {
	const { position, shop } = props;

	const isCurrentYear = momentDate.isSame(shop.lastProcurement.createdAt, 'year');

	return (
		<TableRow>
			<TableCell>{shop.shop.name}</TableCell>
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
		</TableRow>
	);
};

export default Shop;
