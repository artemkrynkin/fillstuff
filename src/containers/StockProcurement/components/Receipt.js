import React from 'react';

import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';

import { formatToCurrency } from 'shared/utils';

import NumberFormat, { currencyFormatProps } from 'src/components/NumberFormat';
import QuantityIndicator from 'src/components/QuantityIndicator';

import styles from './Procurement.module.css';

import { TableCell } from './styles';

const Receipt = props => {
	const { receipt } = props;

	return (
		<TableRow>
			<TableCell>
				{receipt.position.name}{' '}
				{receipt.position.characteristics.reduce((fullCharacteristics, characteristic) => {
					return `${fullCharacteristics} ${characteristic.label}`;
				}, '')}
				{receipt.position.isArchived ? <span className={styles.isArchived}>В архиве</span> : null}
			</TableCell>
			<TableCell align="right" width={160}>
				<QuantityIndicator
					type="receipt"
					unitReceipt={receipt.position.unitReceipt}
					unitIssue={receipt.position.unitIssue}
					receipts={[{ ...receipt.initial }]}
				/>
			</TableCell>
			<TableCell align="right" width={160}>
				{formatToCurrency(receipt.unitPurchasePrice, { toString: true })} ₽
			</TableCell>
			<TableCell align="right" width={160}>
				{!receipt.position.isFree ? (
					<Tooltip
						title={
							<div>
								<NumberFormat
									value={receipt.unitPurchasePrice}
									renderText={value => `Цена покупки: ${value}`}
									displayType="text"
									onValueChange={() => {}}
									{...currencyFormatProps}
								/>
								{receipt.unitCostDelivery > 0 ? <br /> : null}
								{receipt.unitCostDelivery > 0 ? (
									<NumberFormat
										value={receipt.unitCostDelivery}
										renderText={value => `Стоимость доставки: ${value}`}
										displayType="text"
										onValueChange={() => {}}
										{...currencyFormatProps}
									/>
								) : null}
								{receipt.unitExtraCharge > 0 ? <br /> : null}
								{receipt.unitExtraCharge > 0 ? (
									<NumberFormat
										value={receipt.unitExtraCharge}
										renderText={value => `Процент студии: ${value}`}
										displayType="text"
										onValueChange={() => {}}
										{...currencyFormatProps}
									/>
								) : null}
								{receipt.unitManualExtraCharge > 0 ? <br /> : null}
								{receipt.unitManualExtraCharge > 0 ? (
									<NumberFormat
										value={receipt.unitManualExtraCharge}
										renderText={value => `Ручная наценка: ${value}`}
										displayType="text"
										onValueChange={() => {}}
										{...currencyFormatProps}
									/>
								) : null}
							</div>
						}
					>
						<span>{formatToCurrency(receipt.unitSellingPrice, { toString: true })} ₽</span>
					</Tooltip>
				) : (
					'Бесплатно'
				)}
			</TableCell>
		</TableRow>
	);
};

export default Receipt;
