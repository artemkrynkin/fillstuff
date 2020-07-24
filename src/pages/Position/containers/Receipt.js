import React, { useRef, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';

import { formatNumber } from 'shared/utils';

import QuantityIndicator from 'src/components/QuantityIndicator';
import NumberFormat, { currencyMoneyFormatProps } from 'src/components/NumberFormat';
import { DefinitionList, DefinitionListItem } from 'src/components/Definition';
import Dropdown from 'src/components/Dropdown';

import FormChangeSellingPrice from './FormChangeSellingPrice';

import { TableCell } from './styles';
import styles from './Receipt.module.css';

const momentDate = moment();

const statusTransform = status => {
	switch (status) {
		case 'closed':
			return 'Реализовано';
		case 'active':
			return 'На реализации';
		case 'received':
		default:
			return 'На складе';
	}
};

const statusColorClasses = status =>
	ClassNames({
		[styles.status]: true,
		[styles.statusRed]: status === 'closed',
		[styles.statusGreen]: status === 'active',
		[styles.statusYellow]: status === 'received',
	});

const Receipt = props => {
	const { position, receipt, onChangeSellingPriceReceipt } = props;
	const refDropdownChangeSellingPrice = useRef(null);
	const [dropdownChangeSellingPrice, setDropdownChangeSellingPrice] = useState(false);

	const onHandleDropdownChangeSellingPrice = () => setDropdownChangeSellingPrice(prevValue => !prevValue);

	const isCurrentYear = momentDate.isSame(receipt.createdAt, 'year');

	const dateFormat = moment(receipt.createdAt).format(isCurrentYear ? 'D MMMM в HH:mm' : 'D MMMM YYYY');

	return (
		<TableRow>
			<TableCell>
				{receipt.characteristics.length ? (
					receipt.characteristics.reduce((fullName, characteristic) => `${fullName ? `${fullName} ` : ''}${characteristic.name}`, '')
				) : (
					<span className={styles.caption}>-</span>
				)}
			</TableCell>
			<TableCell>
				{receipt.procurement ? (
					<Tooltip
						title={!receipt.procurement.noInvoice ? <Fragment>№{receipt.procurement.invoiceNumber}</Fragment> : 'Чек/накладная отсутствует'}
						placement="top"
					>
						<Link className={styles.buttonLink} to={`/procurements/${receipt.procurement._id}`}>
							{dateFormat}
						</Link>
					</Tooltip>
				) : (
					dateFormat
				)}
			</TableCell>
			<TableCell align="right" width={220}>
				<Tooltip title={statusTransform(receipt.status)} placement="top">
					<div className={styles.quantity}>
						<Grid alignItems="center" justify="flex-end" container>
							<span className={statusColorClasses(receipt.status)} />
							<QuantityIndicator
								type="receipt"
								unitReceipt={position.unitReceipt}
								unitRelease={position.unitRelease}
								receipts={[
									!receipt.quantityInUnit ? { ...receipt.current } : { ...receipt.current, quantityInUnit: receipt.quantityInUnit },
								]}
							/>
							<span style={{ margin: '0 5px' }}>/</span>
							<QuantityIndicator
								type="receipt"
								unitReceipt={position.unitReceipt}
								unitRelease={position.unitRelease}
								receipts={[
									!receipt.quantityInUnit ? { ...receipt.initial } : { ...receipt.initial, quantityInUnit: receipt.quantityInUnit },
								]}
							/>
						</Grid>
					</div>
				</Tooltip>
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
				{!receipt.isFree ? (
					<Grid alignItems="center" justify="flex-end" container>
						<Tooltip
							title={
								<DefinitionList style={{ width: 240 }}>
									<DefinitionListItem
										term="Цена покупки"
										value={
											<NumberFormat
												value={formatNumber(receipt.unitPurchasePrice, { toString: true })}
												renderText={value => value}
												displayType="text"
												{...currencyMoneyFormatProps}
											/>
										}
									/>
									{receipt.unitCostDelivery ? (
										<DefinitionListItem
											term="Стоимость доставки"
											value={
												<NumberFormat
													value={formatNumber(receipt.unitCostDelivery, { toString: true })}
													renderText={value => value}
													displayType="text"
													{...currencyMoneyFormatProps}
												/>
											}
										/>
									) : null}
									{receipt.unitMarkup ? (
										<DefinitionListItem
											term="Наценка"
											value={
												<NumberFormat
													value={formatNumber(receipt.unitMarkup, { toString: true })}
													renderText={value => value}
													displayType="text"
													{...currencyMoneyFormatProps}
												/>
											}
										/>
									) : null}
								</DefinitionList>
							}
							placement="left"
							interactive
						>
							<span className={styles.tooltipContainer}>
								<NumberFormat
									value={formatNumber(receipt.unitSellingPrice, { toString: true })}
									renderText={value => value}
									displayType="text"
									customInput="span"
									{...currencyMoneyFormatProps}
								/>
							</span>
						</Tooltip>

						{receipt.status !== 'closed' ? (
							<IconButton
								ref={refDropdownChangeSellingPrice}
								className={styles.changeSellingPrice}
								onClick={onHandleDropdownChangeSellingPrice}
								size="small"
							>
								<FontAwesomeIcon icon={['fas', 'pen']} />
							</IconButton>
						) : null}
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
					style={{ margin: '-20px -10px -20px 0' }}
					innerContentStyle={{ minWidth: 280 }}
				>
					<FormChangeSellingPrice
						position={position}
						receipt={receipt}
						onClose={onHandleDropdownChangeSellingPrice}
						onChangeSellingPriceReceipt={onChangeSellingPriceReceipt}
					/>
				</Dropdown>
			</TableCell>
		</TableRow>
	);
};

export default Receipt;
