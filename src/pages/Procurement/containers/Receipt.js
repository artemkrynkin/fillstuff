import React from 'react';
import { Link } from 'react-router-dom';

import TableRow from '@material-ui/core/TableRow';

import { formatNumber } from 'shared/utils';

import NumberFormat, { currencyMoneyFormatProps } from 'src/components/NumberFormat';
import PositionNameInList from 'src/components/PositionNameInList';
import QuantityIndicator from 'src/components/QuantityIndicator';

import { TableCell } from './styles';

import styles from './Receipt.module.css';

const Receipt = props => {
	const { receipt } = props;

	return (
		<TableRow>
			<TableCell width={280}>
				<Link className={styles.positionLink} to={`/stock/${receipt.position._id}`}>
					<PositionNameInList
						name={receipt.position.name}
						characteristics={receipt.characteristics}
						isArchived={receipt.position.isArchived}
					/>
				</Link>
			</TableCell>
			<TableCell />
			<TableCell align="right" width={160}>
				<QuantityIndicator
					type="procurementReceipt"
					unitReceipt={receipt.position.unitReceipt}
					unitRelease={receipt.position.unitRelease}
					receipts={[!receipt.quantityInUnit ? { ...receipt.initial } : { ...receipt.initial, quantityInUnit: receipt.quantityInUnit }]}
				/>
			</TableCell>
			<TableCell align="right" width={140}>
				<NumberFormat
					value={formatNumber(receipt.unitPurchasePrice, { toString: true })}
					renderText={value => value}
					displayType="text"
					{...currencyMoneyFormatProps}
				/>
			</TableCell>
			<TableCell align="right" width={140}>
				<NumberFormat
					value={formatNumber(receipt.initial.quantity * receipt.unitPurchasePrice, { toString: true })}
					renderText={value => value}
					displayType="text"
					{...currencyMoneyFormatProps}
				/>
			</TableCell>
		</TableRow>
	);
};

export default Receipt;
