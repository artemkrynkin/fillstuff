import React from 'react';

import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';

import { formatNumber } from 'shared/utils';

import NumberFormat, { currencyMoneyFormatProps } from 'src/components/NumberFormat';
import PositionNameInList from 'src/components/PositionNameInList';
import QuantityIndicator from 'src/components/QuantityIndicator';

import styles from './Procurement.module.css';

import { TableCell } from './styles';

const Receipt = props => {
	const { receipt } = props;

	return (
		<TableRow>
			<TableCell width={280}>
				<PositionNameInList
					name={receipt.position.name}
					characteristics={receipt.position.characteristics}
					isArchived={receipt.position.isArchived}
				/>
			</TableCell>
			<TableCell />
			<TableCell align="right" width={160}>
				<QuantityIndicator
					type="receipt"
					unitReceipt={receipt.position.unitReceipt}
					unitIssue={receipt.position.unitIssue}
					receipts={[{ ...receipt.initial }]}
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
				{!receipt.position.isFree ? (
					<Tooltip
						title={
							<div>
								<NumberFormat
									value={formatNumber(receipt.unitPurchasePrice, { toString: true })}
									renderText={value => `Цена покупки: ${value}`}
									displayType="text"
									{...currencyMoneyFormatProps}
								/>
								{receipt.unitCostDelivery > 0 ? <br /> : null}
								{receipt.unitCostDelivery > 0 ? (
									<NumberFormat
										value={formatNumber(receipt.unitCostDelivery, { toString: true })}
										renderText={value => `Стоимость доставки: ${value}`}
										displayType="text"
										{...currencyMoneyFormatProps}
									/>
								) : null}
								{receipt.unitExtraCharge > 0 ? <br /> : null}
								{receipt.unitExtraCharge > 0 ? (
									<NumberFormat
										value={formatNumber(receipt.unitExtraCharge, { toString: true })}
										renderText={value => `Процент студии: ${value}`}
										displayType="text"
										{...currencyMoneyFormatProps}
									/>
								) : null}
								{receipt.unitManualExtraCharge > 0 ? <br /> : null}
								{receipt.unitManualExtraCharge > 0 ? (
									<NumberFormat
										value={formatNumber(receipt.unitManualExtraCharge, { toString: true })}
										renderText={value => `Ручная наценка: ${value}`}
										displayType="text"
										{...currencyMoneyFormatProps}
									/>
								) : null}
							</div>
						}
					>
						<span>
							<NumberFormat
								value={formatNumber(receipt.unitSellingPrice, { toString: true })}
								renderText={value => value}
								displayType="text"
								{...currencyMoneyFormatProps}
							/>
						</span>
					</Tooltip>
				) : (
					<span className={styles.caption}>Бесплатно</span>
				)}
			</TableCell>
		</TableRow>
	);
};

export default Receipt;
