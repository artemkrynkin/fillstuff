import React, { useRef, useState, useEffect } from 'react';
import { Field } from 'formik';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';

import { receiptCalc } from 'shared/checkPositionAndReceipt';
import { formatNumber } from 'shared/utils';

import { formError } from 'src/helpers/utils';

import NumberFormat, { moneyInputFormatProps, currencyMoneyFormatProps } from 'src/components/NumberFormat';
import PositionNameInList from 'src/components/PositionNameInList';

import styles from './index.module.css';

const FormFieldArrayReceipt = props => {
	const {
		receipt,
		index,
		formEditable,
		arrayHelpers: { remove },
		formikProps: { errors, isSubmitting, setFieldValue, touched },
	} = props;
	const sellingPriceFieldRef = useRef(null);
	const [sellingPriceEditable, setSellingPriceEditable] = useState(!receipt.position.isFree);

	const onHandleSellingPriceEditable = value => setSellingPriceEditable(value);

	const isNmpPce = receipt.position.unitReceipt === 'nmp' && receipt.position.unitRelease === 'pce';
	const isNmpNmp = receipt.position.unitReceipt === 'nmp' && receipt.position.unitRelease === 'nmp';

	const autoGenUnitSellingPrice =
		!formEditable && !receipt.position.isFree
			? formatNumber(receipt.unitPurchasePrice + receipt.unitCostDelivery + receipt.unitMarkup)
			: null;

	useEffect(() => {
		if (!formEditable && sellingPriceFieldRef && sellingPriceEditable) sellingPriceFieldRef.current.querySelector('input').focus();
	}, [formEditable, sellingPriceEditable]);

	return (
		<Grid className={styles.receiptItem} alignItems="flex-start" spacing={2} container>
			<Grid style={{ width: 190 }} item>
				<PositionNameInList name={receipt.position.name} characteristics={receipt.position.characteristics} style={{ marginTop: 23 }} />
			</Grid>

			<Grid style={{ width: 180 }} item>
				{receipt.position.unitReceipt === 'pce' || receipt.position.unitRelease === 'nmp' ? (
					<Field
						name={`receipts.${index}.quantity`}
						label={isNmpNmp ? 'Количество уп.' : 'Количество шт.'}
						placeholder="0"
						error={Boolean(formError(touched, errors, `receipts.${index}.quantity`))}
						helperText={formError(touched, errors, `receipts.${index}.quantity`, null)}
						as={TextField}
						InputProps={{
							inputComponent: NumberFormat,
							inputProps: {
								allowNegative: false,
							},
						}}
						disabled={isSubmitting || !formEditable}
						fullWidth
					/>
				) : (
					<Field
						name={`receipts.${index}.quantityPackages`}
						label="Количество уп."
						placeholder="0"
						error={Boolean(formError(touched, errors, `receipts.${index}.quantityPackages`))}
						helperText={formError(touched, errors, `receipts.${index}.quantityPackages`, null)}
						as={TextField}
						InputProps={{
							inputComponent: NumberFormat,
							inputProps: {
								allowNegative: false,
							},
						}}
						disabled={isSubmitting || !formEditable}
						fullWidth
					/>
				)}
			</Grid>

			{isNmpPce ? (
				<Grid style={{ width: 180 }} item>
					<Field
						name={`receipts.${index}.quantityInUnit`}
						label="Штук в упаковке"
						placeholder="0"
						as={TextField}
						error={Boolean(formError(touched, errors, `receipts.${index}.quantityInUnit`))}
						helperText={formError(touched, errors, `receipts.${index}.quantityInUnit`, null)}
						InputProps={{
							inputComponent: NumberFormat,
							inputProps: {
								allowNegative: false,
							},
						}}
						disabled={isSubmitting || !formEditable}
						fullWidth
					/>
				</Grid>
			) : null}

			<Grid style={{ width: 180 }} item>
				{formEditable ? (
					<Field
						name={`receipts.${index}.purchasePrice`}
						label={receipt.position.unitReceipt === 'nmp' ? 'Цена покупки уп.' : 'Цена покупки шт.'}
						placeholder="0"
						as={TextField}
						error={Boolean(formError(touched, errors, `receipts.${index}.purchasePrice`))}
						helperText={formError(touched, errors, `receipts.${index}.purchasePrice`, null)}
						InputProps={{
							endAdornment: <InputAdornment position="end">₽</InputAdornment>,
							inputComponent: NumberFormat,
							inputProps: {
								...moneyInputFormatProps,
							},
						}}
						disabled={isSubmitting || !formEditable}
						fullWidth
					/>
				) : (
					<TextField
						label={receipt.position.unitReceipt === 'nmp' ? 'Цена покупки уп.' : 'Цена покупки шт.'}
						defaultValue={receipt.purchasePrice}
						InputProps={{
							endAdornment: <InputAdornment position="end">₽</InputAdornment>,
							inputComponent: NumberFormat,
							inputProps: {
								...moneyInputFormatProps,
							},
						}}
						disabled
						fullWidth
					/>
				)}
			</Grid>

			{formEditable ? (
				<Grid style={{ width: 180 }} item>
					{!receipt.position.isFree ? (
						<Field
							name={`receipts.${index}.markupPercent`}
							label="Наценка"
							placeholder="0"
							as={TextField}
							error={Boolean(formError(touched, errors, `receipts.${index}.markupPercent`))}
							helperText={formError(touched, errors, `receipts.${index}.markupPercent`, null)}
							InputProps={{
								endAdornment: <InputAdornment position="end">%</InputAdornment>,
								inputComponent: NumberFormat,
								inputProps: {
									...moneyInputFormatProps,
								},
							}}
							disabled={isSubmitting || !formEditable}
							fullWidth
						/>
					) : null}
				</Grid>
			) : (
				<Grid style={{ width: 180 }} item>
					{!receipt.position.isFree ? (
						<Tooltip
							title={
								<div>
									<NumberFormat
										value={receipt.unitPurchasePrice}
										renderText={value => `Цена покупки: ${value}`}
										displayType="text"
										{...currencyMoneyFormatProps}
									/>
									{receipt.unitCostDelivery > 0 ? <br /> : null}
									{receipt.unitCostDelivery > 0 ? (
										<NumberFormat
											value={receipt.unitCostDelivery}
											renderText={value => `Стоимость доставки: ${value}`}
											displayType="text"
											{...currencyMoneyFormatProps}
										/>
									) : null}
									{receipt.unitMarkup > 0 ? <br /> : null}
									{receipt.unitMarkup > 0 ? (
										<NumberFormat
											value={receipt.unitMarkup}
											renderText={value => `Наценка: ${value}`}
											displayType="text"
											{...currencyMoneyFormatProps}
										/>
									) : null}
								</div>
							}
							disableHoverListener={sellingPriceEditable}
						>
							<div>
								<Field
									innerRef={sellingPriceFieldRef}
									name={isNmpPce ? `receipts.${index}.unitSellingPrice` : `receipts.${index}.sellingPrice`}
									label={isNmpNmp ? 'Цена продажи уп.' : 'Цена продажи шт.'}
									placeholder="0"
									as={TextField}
									error={Boolean(
										formError(touched, errors, isNmpPce ? `receipts.${index}.unitSellingPrice` : `receipts.${index}.sellingPrice`)
									)}
									helperText={formError(
										touched,
										errors,
										isNmpPce ? `receipts.${index}.unitSellingPrice` : `receipts.${index}.sellingPrice`
									)}
									InputProps={{
										endAdornment: <InputAdornment position="end">₽</InputAdornment>,
										inputComponent: NumberFormat,
										inputProps: {
											...moneyInputFormatProps,
											onFocus: ({ target }) => (target.selectionStart = target.value.length),
											onBlur: ({ target: { value } }) => {
												if (value < autoGenUnitSellingPrice) {
													setFieldValue(
														isNmpPce ? `receipts.${index}.unitSellingPrice` : `receipts.${index}.sellingPrice`,
														autoGenUnitSellingPrice
													);
												}

												onHandleSellingPriceEditable(false);

												receiptCalc.markupPercent(receipt, {
													isFree: receipt.position.isFree,
													unitReceipt: receipt.position.unitReceipt,
													unitRelease: receipt.position.unitRelease,
												});
												receiptCalc.sellingPrice(receipt, {
													isFree: receipt.position.isFree,
												});
											},
											onKeyDown: event => {
												if (event.keyCode === 13) event.currentTarget.blur();
											},
										},
									}}
									onClick={!sellingPriceEditable ? () => onHandleSellingPriceEditable(true) : () => {}}
									disabled={isSubmitting || !sellingPriceEditable}
									validate={value => {
										if (value < autoGenUnitSellingPrice) {
											return 'Не может быть ниже рассчитанной цены';
										}
									}}
									fullWidth
								/>
							</div>
						</Tooltip>
					) : (
						<TextField
							className="none-padding"
							label={isNmpNmp ? 'Цена продажи уп.' : 'Цена продажи шт.'}
							defaultValue="Бесплатно"
							inputProps={{
								readOnly: true,
							}}
							fullWidth
						/>
					)}
				</Grid>
			)}

			{formEditable ? (
				<div className={styles.removeReceipt}>
					<IconButton size="small" onClick={() => remove(index)} disableRipple disableFocusRipple>
						<FontAwesomeIcon icon={['fal', 'times']} />
					</IconButton>
				</div>
			) : null}
		</Grid>
	);
};

export default FormFieldArrayReceipt;
