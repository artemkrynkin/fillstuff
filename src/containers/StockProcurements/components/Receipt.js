import React from 'react';

import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';

import { percentOfNumber } from 'shared/utils';

import NumberFormat, { currencyFormatProps } from 'src/components/NumberFormat';
import QuantityIndicator from 'src/components/QuantityIndicator';

import styles from './Procurement.module.css';

import { TableCell, TableCellHighlight, TableRowHighlight } from './styles';

const Receipt = props => {
	const { receipt, positionSameFilter } = props;
	const TableRowHighlightClasses = TableRowHighlight();
	const TableCellHighlightClasses = TableCellHighlight();

	const unitSellingPrice =
		receipt.unitSellingPrice + receipt.unitCostDelivery + percentOfNumber(receipt.unitSellingPrice, receipt.position.extraCharge);

	return (
		<TableRow classes={positionSameFilter ? { root: TableRowHighlightClasses.root } : {}}>
			<TableCell classes={positionSameFilter ? { root: TableCellHighlightClasses.root } : {}}>
				{receipt.position.name}{' '}
				{receipt.position.characteristics.reduce(
					(fullCharacteristics, characteristic) => `${fullCharacteristics} ${characteristic.label}`,
					''
				)}
				{receipt.position.isArchived ? <span className={styles.isArchived}>В архиве</span> : null}
			</TableCell>
			<TableCell classes={positionSameFilter ? { root: TableCellHighlightClasses.root } : {}} align="right" width={160}>
				<QuantityIndicator
					type="receipt"
					unitReceipt={receipt.position.unitReceipt}
					unitIssue={receipt.position.unitIssue}
					receipts={[{ ...receipt.initial }]}
				/>
			</TableCell>
			<TableCell classes={positionSameFilter ? { root: TableCellHighlightClasses.root } : {}} align="right" width={160}>
				{receipt.unitPurchasePrice} ₽
			</TableCell>
			<TableCell classes={positionSameFilter ? { root: TableCellHighlightClasses.root } : {}} align="right" width={160}>
				{!receipt.position.isFree ? (
					<Tooltip
						title={
							<div>
								<NumberFormat
									value={receipt.unitSellingPrice}
									renderText={value => `Цена продажи: ${value}`}
									displayType="text"
									onValueChange={() => {}}
									{...currencyFormatProps}
								/>
								<br />
								<NumberFormat
									value={receipt.unitCostDelivery}
									renderText={value => `Стоимость доставки: ${value}`}
									displayType="text"
									onValueChange={() => {}}
									{...currencyFormatProps}
								/>
								<br />
								{receipt.position.extraCharge > 0 ? (
									<NumberFormat
										value={percentOfNumber(receipt.unitSellingPrice, receipt.position.extraCharge)}
										renderText={value => `Процент студии: ${value}`}
										displayType="text"
										onValueChange={() => {}}
										{...currencyFormatProps}
									/>
								) : null}
							</div>
						}
					>
						<span>{unitSellingPrice} ₽</span>
					</Tooltip>
				) : (
					'Бесплатно'
				)}
			</TableCell>
		</TableRow>
	);
};

export default Receipt;
