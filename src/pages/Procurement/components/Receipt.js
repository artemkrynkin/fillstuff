import React from 'react';
import { Link } from 'react-router-dom';

import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';

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
				<Link className={styles.positionLink} to={`/availability/${receipt.position._id}`}>
					<PositionNameInList
						name={receipt.position.name}
						characteristics={receipt.position.characteristics}
						isArchived={receipt.position.isArchived}
					/>
				</Link>
			</TableCell>
			<TableCell />
			<TableCell align="right" width={200}>
				<QuantityIndicator
					type="receipt"
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
								{receipt.unitMarkup > 0 ? <br /> : null}
								{receipt.unitMarkup > 0 ? (
									<NumberFormat
										value={formatNumber(receipt.unitMarkup, { toString: true })}
										renderText={value => `Наценка: ${value}`}
										displayType="text"
										{...currencyMoneyFormatProps}
									/>
								) : null}
								{receipt.unitManualMarkup > 0 ? <br /> : null}
								{receipt.unitManualMarkup > 0 ? (
									<NumberFormat
										value={formatNumber(receipt.unitManualMarkup, { toString: true })}
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
