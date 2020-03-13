import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tooltip from '@material-ui/core/Tooltip';
import TableRow from '@material-ui/core/TableRow';
import ButtonBase from '@material-ui/core/ButtonBase';
import Grid from '@material-ui/core/Grid';

import { formatNumber } from 'shared/utils';

import QuantityIndicator from 'src/components/QuantityIndicator';
import NumberFormat, { currencyMoneyFormatProps } from 'src/components/NumberFormat';
import Dropdown from 'src/components/Dropdown';

import FormChangeSellingPrice from './FormChangeSellingPrice';

import { TableCell } from './styles';
import styles from './Receipt.module.css';

const momentDate = moment();

const statusTransform = status => {
	switch (status) {
		case 'closed':
			return 'Закрыто';
		case 'active':
			return 'Активно';
		case 'received':
			return 'Получено';
		case 'expected':
		default:
			return 'Ожидается';
	}
};

const statusColorClasses = status =>
	ClassNames({
		[styles.status]: true,
		[styles.statusRed]: status === 'closed',
		[styles.statusGreen]: status === 'active',
		[styles.statusYellow]: status === 'received',
		[styles.statusOrange]: status === 'expected',
	});

const Receipt = props => {
	const { position, receipt, changeSellingPriceReceipt } = props;
	const refDropdownChangeSellingPrice = useRef(null);
	const [dropdownChangeSellingPrice, setDropdownChangeSellingPrice] = useState(false);

	const onHandleDropdownChangeSellingPrice = () => setDropdownChangeSellingPrice(prevValue => !prevValue);

	const isCurrentYear = momentDate.isSame(receipt.createdAt, 'year');

	return (
		<TableRow>
			<TableCell>{moment(receipt.createdAt).format(isCurrentYear ? 'D MMMM в HH:mm' : 'D MMMM YYYY')}</TableCell>
			<TableCell>
				<Link className={styles.buttonLink} to={`/procurements/${receipt.procurement._id}`}>
					{!receipt.procurement.noInvoice ? (
						<div>
							<span>№</span>
							{receipt.procurement.number}
						</div>
					) : (
						'Чек/накладная отсутствует'
					)}
				</Link>
			</TableCell>
			<TableCell>
				<span className={statusColorClasses(receipt.status)}>{statusTransform(receipt.status)}</span>
			</TableCell>
			<TableCell align="right" width={200}>
				<QuantityIndicator
					type="receipt"
					unitReceipt={position.unitReceipt}
					unitRelease={position.unitRelease}
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
				{!position.isFree ? (
					<Grid alignItems="center" justify="flex-end" container>
						{receipt.status !== 'closed' ? (
							<ButtonBase
								ref={refDropdownChangeSellingPrice}
								className={styles.changeSellingPrice}
								onClick={onHandleDropdownChangeSellingPrice}
							>
								<FontAwesomeIcon icon={['fas', 'pen']} rotation={270} />
							</ButtonBase>
						) : null}

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
					</Grid>
				) : (
					<span className={styles.caption}>Бесплатно</span>
				)}

				<Dropdown
					anchor={refDropdownChangeSellingPrice}
					open={dropdownChangeSellingPrice}
					onClose={onHandleDropdownChangeSellingPrice}
					placement="bottom-end"
					disablePortal={false}
					style={{ margin: '5px -50px 5px 0' }}
				>
					<FormChangeSellingPrice
						position={position}
						receipt={receipt}
						onClose={onHandleDropdownChangeSellingPrice}
						changeSellingPriceReceipt={changeSellingPriceReceipt}
					/>
				</Dropdown>
			</TableCell>
		</TableRow>
	);
};

export default Receipt;
