import React from 'react';
import { Field, Form, Formik } from 'formik';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';

import { receiptCalc } from 'shared/checkPositionAndReceipt';
import { formatNumber } from 'shared/utils';

import NumberFormat, { moneyInputFormatProps } from 'src/components/NumberFormat';

import changeSellingPriceSchema from './changeSellingPriceSchema';

import stylesGlobal from 'src/styles/globals.module.css';
import styles from './FormChangeSellingPrice.module.css';

const FormChangeSellingPrice = props => {
	const { position, receipt, onClose, changeSellingPriceReceipt } = props;

	const isNmpPce = position.unitReceipt === 'nmp' && position.unitRelease === 'pce';
	const isNmpNmp = position.unitReceipt === 'nmp' && position.unitRelease === 'nmp';

	const initialValues = {
		sellingPrice: receipt.sellingPrice,
		unitSellingPrice: receipt.unitSellingPrice,
		markupPercent: receipt.markupPercent,
		markup: receipt.markup,
		unitMarkup: receipt.unitMarkup,
		manualMarkup: receipt.manualMarkup,
		unitManualMarkup: receipt.unitManualMarkup,
	};

	const onSubmit = (values, actions) => {
		const newValues = changeSellingPriceSchema.cast(values);

		changeSellingPriceReceipt(receipt._id, newValues, () => {
			actions.setSubmitting(false);
			onClose();
		});
	};

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={changeSellingPriceSchema}
			validateOnChange={false}
			onSubmit={(values, actions) => onSubmit(values, actions)}
		>
			{({ errors, isSubmitting, touched, setFieldValue, values }) => {
				let autoGenUnitSellingPrice = formatNumber(receipt.unitPurchasePrice + receipt.unitCostDelivery + values.unitMarkup);

				return (
					<Form className={styles.form}>
						<Grid className={stylesGlobal.formLabelControl}>
							<Field
								name="markupPercent"
								label="Наценка"
								placeholder="0"
								as={TextField}
								error={Boolean(errors.markupPercent && touched.markupPercent)}
								helperText={typeof errors.markupPercent === 'string' && touched.markupPercent ? errors.markupPercent : null}
								InputProps={{
									endAdornment: <InputAdornment position="end">%</InputAdornment>,
									inputComponent: NumberFormat,
									inputProps: {
										...moneyInputFormatProps,
										onChange: ({ target: { value } }) => {
											setFieldValue('markupPercent', value);

											const receiptValues = {
												purchasePrice: receipt.purchasePrice,
												unitPurchasePrice: receipt.unitPurchasePrice,
												costDelivery: receipt.costDelivery,
												unitCostDelivery: receipt.unitCostDelivery,
												markupPercent: Number(value),
											};

											const newReceiptValues = receiptCalc.sellingPrice(receiptValues, {
												isFree: position.isFree,
											});

											setFieldValue('sellingPrice', newReceiptValues.sellingPrice);
											setFieldValue('unitSellingPrice', newReceiptValues.unitSellingPrice);
											setFieldValue('markup', newReceiptValues.markup);
											setFieldValue('unitMarkup', newReceiptValues.unitMarkup);
										},
									},
								}}
								disabled={isSubmitting}
								autoFocus
								fullWidth
							/>
						</Grid>

						<Grid className={stylesGlobal.formLabelControl}>
							<Field
								name={isNmpPce ? 'unitSellingPrice' : 'sellingPrice'}
								label={isNmpNmp ? 'Цена продажи уп.' : 'Цена продажи шт.'}
								placeholder="0"
								as={TextField}
								error={
									isNmpPce
										? Boolean(errors.unitSellingPrice && touched.unitSellingPrice)
										: Boolean(errors.sellingPrice && touched.sellingPrice)
								}
								helperText={
									isNmpPce
										? typeof errors.unitSellingPrice === 'string' && touched.unitSellingPrice
											? errors.unitSellingPrice
											: null
										: typeof errors.sellingPrice === 'string' && touched.sellingPrice
										? errors.sellingPrice
										: null
								}
								InputProps={{
									endAdornment: <InputAdornment position="end">₽</InputAdornment>,
									inputComponent: NumberFormat,
									inputProps: {
										...moneyInputFormatProps,
										onFocus: ({ target }) => (target.selectionStart = target.value.length),
										onBlur: ({ target: { value } }) => {
											if (Number(value) < autoGenUnitSellingPrice) {
												setFieldValue(isNmpPce ? 'unitSellingPrice' : 'sellingPrice', autoGenUnitSellingPrice);
											}
										},
										onChange: ({ target: { value } }) => {
											const receiptValues = {};

											if (isNmpPce) {
												receiptValues.unitPurchasePrice = receipt.unitPurchasePrice;
												receiptValues.unitSellingPrice = Number(value);
												receiptValues.unitCostDelivery = receipt.unitCostDelivery;
												receiptValues.unitMarkup = values.unitMarkup;
												receiptValues.quantityInUnit = receipt.quantityInUnit;
											} else {
												receiptValues.purchasePrice = receipt.purchasePrice;
												receiptValues.sellingPrice = Number(value);
												receiptValues.costDelivery = receipt.costDelivery;
												receiptValues.markup = values.markup;
											}

											const newReceiptValues = receiptCalc.manualMarkup(receiptValues, {
												isFree: position.isFree,
												unitReceipt: position.unitReceipt,
												unitRelease: position.unitRelease,
											});

											setFieldValue('sellingPrice', newReceiptValues.sellingPrice);
											setFieldValue('unitSellingPrice', newReceiptValues.unitSellingPrice);
											setFieldValue('manualMarkup', newReceiptValues.manualMarkup);
											setFieldValue('unitManualMarkup', newReceiptValues.unitManualMarkup);
										},
									},
								}}
								disabled={isSubmitting}
								validate={value => {
									if (value < autoGenUnitSellingPrice) {
										return 'Не может быть ниже рассчитанной цены';
									}
								}}
								fullWidth
							/>
						</Grid>

						<Grid alignItems="center" spacing={2} container>
							<Grid xs={6} item>
								<Button type="submit" disabled={isSubmitting} variant="contained" color="primary" size="small" fullWidth>
									{isSubmitting ? <CircularProgress size={20} style={{ position: 'absolute' }} /> : null}
									<span className="loading-button-label" style={{ opacity: Number(!isSubmitting) }}>
										Сохранить
									</span>
								</Button>
							</Grid>
							<Grid xs={6} item>
								<Button onClick={onClose} disabled={isSubmitting} variant="contained" size="small" fullWidth>
									Отмена
								</Button>
							</Grid>
						</Grid>
					</Form>
				);
			}}
		</Formik>
	);
};

export default FormChangeSellingPrice;
