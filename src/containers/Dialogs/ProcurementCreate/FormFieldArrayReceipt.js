import React, { useRef, useState, useEffect } from 'react';
import { FastField, Field } from 'formik';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';

import { receiptCalc } from 'shared/checkPositionAndReceipt';
import { formatNumber } from 'shared/utils';

import { formError } from 'src/helpers/utils';

import NumberFormat, { currencyFormatInputProps, currencyFormatProps } from 'src/components/NumberFormat';

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

	const isNmpPce = receipt.position.unitReceipt === 'nmp' && receipt.position.unitIssue === 'pce';

	const autoGenUnitSellingPrice =
		!formEditable && !receipt.position.isFree
			? formatNumber(receipt.unitPurchasePrice + receipt.unitCostDelivery + receipt.unitExtraCharge)
			: null;

	useEffect(() => {
		if (sellingPriceFieldRef && !formEditable && sellingPriceEditable) sellingPriceFieldRef.current.querySelector('input').focus();
	}, [formEditable, sellingPriceEditable]);

	return (
		<Grid className={styles.receiptItem} alignItems="flex-start" spacing={2} container>
			<Grid style={{ width: 190 }} item>
				<InputLabel>&nbsp;</InputLabel>
				<div className={styles.positionName}>{receipt.position.label}</div>
			</Grid>

			<Grid style={{ width: 180 }} item>
				{receipt.position.unitReceipt === 'pce' || receipt.position.unitIssue !== 'pce' ? (
					<FastField
						name={`receipts.${index}.quantity`}
						label={
							receipt.position.unitReceipt === 'nmp' && receipt.position.unitIssue !== 'pce' ? 'Количество упаковок:' : 'Количество штук:'
						}
						placeholder="0"
						error={Boolean(formError(touched, errors, `receipts.${index}.quantity`))}
						helperText={typeof formError(touched, errors, `receipts.${index}.quantity`) === 'string' || null}
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
						label="Количество упаковок:"
						placeholder="0"
						error={Boolean(formError(touched, errors, `receipts.${index}.quantityPackages`))}
						helperText={typeof formError(touched, errors, `receipts.${index}.quantityPackages`) === 'string' || null}
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
						label="Штук в упаковке:"
						placeholder="0"
						as={TextField}
						error={Boolean(formError(touched, errors, `receipts.${index}.quantityInUnit`))}
						helperText={typeof formError(touched, errors, `receipts.${index}.quantityInUnit`) === 'string' || null}
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
						label={isNmpPce ? 'Цена покупки упаковки:' : 'Цена покупки:'}
						placeholder="0"
						as={TextField}
						error={Boolean(formError(touched, errors, `receipts.${index}.purchasePrice`))}
						helperText={typeof formError(touched, errors, `receipts.${index}.purchasePrice`) === 'string' || null}
						InputProps={{
							endAdornment: <InputAdornment position="end">₽</InputAdornment>,
							inputComponent: NumberFormat,
							inputProps: {
								...currencyFormatInputProps,
							},
						}}
						disabled={isSubmitting || !formEditable}
						fullWidth
					/>
				) : (
					<TextField
						label={isNmpPce ? 'Цена покупки упаковки:' : 'Цена покупки:'}
						defaultValue={receipt.purchasePrice}
						InputProps={{
							endAdornment: <InputAdornment position="end">₽</InputAdornment>,
							inputComponent: NumberFormat,
							inputProps: {
								...currencyFormatInputProps,
							},
						}}
						disabled
						fullWidth
					/>
				)}
			</Grid>

			<Grid style={{ width: 180 }} item>
				{!formEditable ? (
					!receipt.position.isFree ? (
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
							disableHoverListener={sellingPriceEditable}
						>
							<div>
								<Field
									innerRef={sellingPriceFieldRef}
									name={isNmpPce ? `receipts.${index}.unitSellingPrice` : `receipts.${index}.sellingPrice`}
									label={isNmpPce ? 'Цена продажи штуки:' : 'Цена продажи:'}
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
											...currencyFormatInputProps,
											onFocus: ({ target }) => (target.selectionStart = target.value.length),
											onBlur: ({ target: { value } }) => {
												if (value < autoGenUnitSellingPrice) {
													setFieldValue(
														isNmpPce ? `receipts.${index}.unitSellingPrice` : `receipts.${index}.sellingPrice`,
														autoGenUnitSellingPrice
													);
												}

												onHandleSellingPriceEditable(false);

												receiptCalc.manualExtraCharge(receipt, {
													isFree: receipt.position.isFree,
													unitReceipt: receipt.position.unitReceipt,
													unitIssue: receipt.position.unitIssue,
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
											return 'Не может быть меньше автоматически сформированной цены';
										}
									}}
									fullWidth
								/>
							</div>
						</Tooltip>
					) : (
						<TextField
							className="none-padding"
							label={isNmpPce ? 'Цена продажи штуки:' : 'Цена продажи:'}
							defaultValue="Бесплатно"
							inputProps={{
								readOnly: true,
							}}
							fullWidth
						/>
					)
				) : null}
			</Grid>

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
