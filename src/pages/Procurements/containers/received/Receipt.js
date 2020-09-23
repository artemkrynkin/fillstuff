import React from 'react';
import { Link } from 'react-router-dom';

import TableRow from '@material-ui/core/TableRow';

import { formatNumber } from 'shared/utils';

import NumberFormat, { currencyMoneyFormatProps } from 'src/components/NumberFormat';
import PositionSummary from 'src/components/PositionSummary';
import QuantityIndicator from 'src/components/QuantityIndicator';

import { TableCell, TableCellHighlight, TableRowHighlight } from '../../components/styles';

import styles from './Receipt.module.css';

const Receipt = props => {
	const { receipt, positionSameFilter } = props;
	const TableRowHighlightClasses = TableRowHighlight();
	const TableCellHighlightClasses = TableCellHighlight();

	const positionBadges = (badges = []) => {
		if (receipt.position.isArchived) badges.push('archived');

		return badges;
	};

	return (
		<TableRow classes={positionSameFilter ? { root: TableRowHighlightClasses.root } : {}}>
			<TableCell classes={positionSameFilter ? { root: TableCellHighlightClasses.root } : {}} width={280}>
				<Link className={styles.positionLink} to={`/stock/${receipt.position._id}`}>
					<PositionSummary
						name={receipt.position.name}
						characteristics={receipt.position.characteristics}
						badges={positionBadges()}
						avatar
					/>
				</Link>
			</TableCell>
			<TableCell />
			<TableCell classes={positionSameFilter ? { root: TableCellHighlightClasses.root } : {}} align="right" width={160}>
				<QuantityIndicator
					type="procurementReceipt"
					unitReceipt={receipt.position.unitReceipt}
					unitRelease={receipt.position.unitRelease}
					receipts={[!receipt.quantityInUnit ? { ...receipt.initial } : { ...receipt.initial, quantityInUnit: receipt.quantityInUnit }]}
				/>
			</TableCell>
			<TableCell classes={positionSameFilter ? { root: TableCellHighlightClasses.root } : {}} align="right" width={140}>
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
