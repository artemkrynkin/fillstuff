import React from 'react';
import { Field, Form } from 'formik';

import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

import { receiptCalc } from 'shared/checkPositionAndReceipt';

import NumberFormat, { moneyInputFormatProps } from 'src/components/NumberFormat';
import PositionNameInList from 'src/components/PositionNameInList';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';

const FormReceiptCreate = props => {
	const {
		onCloseDialog,
		checkSellingPrice,
		formikProps: { errors, isSubmitting, submitForm, setFieldValue, touched, values },
	} = props;

	const isNmpPce = values.position.unitReceipt === 'nmp' && values.position.unitRelease === 'pce';
	const isNmpNmp = values.position.unitReceipt === 'nmp' && values.position.unitRelease === 'nmp';

	return (
		<Form>
			<DialogContent>
				<PositionNameInList name={values.position.name} characteristics={values.position.characteristics} size="md" />

				<Grid alignItems="flex-start" spacing={2} style={{ marginTop: 20 }} container>
					<Grid xs={3} item>
						{values.position.unitReceipt === 'pce' || values.position.unitRelease === 'nmp' ? (
							<Field
								name="quantity"
								label={isNmpNmp ? 'Количество уп.' : 'Количество шт.'}
								placeholder="0"
								error={Boolean(errors.quantity && touched.quantity)}
								helperText={typeof errors.quantity === 'string' && touched.quantity ? errors.quantity : null}
								as={TextField}
								InputProps={{
									inputComponent: NumberFormat,
									inputProps: {
										allowNegative: false,
									},
								}}
								disabled={isSubmitting || checkSellingPrice}
								autoFocus
								fullWidth
							/>
						) : (
							<Field
								name="quantityPackages"
								label="Количество уп."
								placeholder="0"
								error={Boolean(errors.quantityPackages && touched.quantityPackages)}
								helperText={typeof errors.quantityPackages === 'string' && touched.quantityPackages ? errors.quantityPackages : null}
								as={TextField}
								InputProps={{
									inputComponent: NumberFormat,
									inputProps: {
										allowNegative: false,
									},
								}}
								disabled={isSubmitting || checkSellingPrice}
								autoFocus
								fullWidth
							/>
						)}
					</Grid>

					{isNmpPce ? (
						<Grid xs={3} item>
							<Field
								name="quantityInUnit"
								label="Штук в упаковке"
								placeholder="0"
								as={TextField}
								error={Boolean(errors.quantityInUnit && touched.quantityInUnit)}
								helperText={typeof errors.quantityInUnit === 'string' && touched.quantityInUnit ? errors.quantityInUnit : null}
								InputProps={{
									inputComponent: NumberFormat,
									inputProps: {
										allowNegative: false,
									},
								}}
								disabled={isSubmitting || checkSellingPrice}
								fullWidth
							/>
						</Grid>
					) : null}

					<Grid xs={3} item>
						<Field
							name="purchasePrice"
							label={values.position.unitReceipt === 'nmp' ? 'Цена покупки уп.' : 'Цена покупки шт.'}
							placeholder="0"
							as={TextField}
							error={Boolean(errors.purchasePrice && touched.purchasePrice)}
							helperText={typeof errors.purchasePrice === 'string' && touched.purchasePrice ? errors.purchasePrice : null}
							InputProps={{
								endAdornment: <InputAdornment position="end">₽</InputAdornment>,
								inputComponent: NumberFormat,
								inputProps: {
									...moneyInputFormatProps,
								},
							}}
							disabled={isSubmitting || checkSellingPrice}
							fullWidth
						/>
					</Grid>

					{!checkSellingPrice ? (
						<Grid xs={3} item>
							{!values.position.isFree ? (
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
											decimalScale: 4,
										},
									}}
									disabled={isSubmitting}
									fullWidth
								/>
							) : null}
						</Grid>
					) : (
						<Grid xs={3} item>
							{!values.position.isFree ? (
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
											onFocus: ({ target }) => target.select(),
											onBlur: ({ target: { value } }) => {
												if (Number(value) < values.unitPurchasePrice) {
													setFieldValue(isNmpPce ? 'unitSellingPrice' : 'sellingPrice', values.unitPurchasePrice);
												}
											},
											onChange: ({ target: { value } }) => {
												const receiptValues = {
													purchasePrice: values.purchasePrice,
													unitPurchasePrice: values.unitPurchasePrice,
													sellingPrice: Number(value),
													unitSellingPrice: Number(value),
													costDelivery: values.costDelivery,
													unitCostDelivery: values.unitCostDelivery,
												};

												const newReceiptValues = {
													...receiptCalc.markupPercent(receiptValues, {
														isFree: values.position.isFree,
														unitReceipt: values.position.unitReceipt,
														unitRelease: values.position.unitRelease,
													}),
													...receiptCalc.sellingPrice(receiptValues, {
														isFree: values.position.isFree,
													}),
												};

												setFieldValue('sellingPrice', newReceiptValues.sellingPrice);
												setFieldValue('unitSellingPrice', newReceiptValues.unitSellingPrice);
												setFieldValue('markupPercent', newReceiptValues.markupPercent);
												setFieldValue('markup', newReceiptValues.markup);
												setFieldValue('unitMarkup', newReceiptValues.unitMarkup);
											},
										},
									}}
									disabled={isSubmitting}
									validate={value => {
										if (Number(value) < values.unitPurchasePrice) {
											return 'Не может быть ниже цены покупки';
										}
									}}
									fullWidth
								/>
							) : (
								<TextField
									label={isNmpNmp ? 'Цена продажи уп.' : 'Цена продажи шт.'}
									defaultValue="Бесплатно"
									inputProps={{
										readOnly: true,
									}}
									fullWidth
									readOnly
								/>
							)}
						</Grid>
					)}
				</Grid>
			</DialogContent>
			<DialogActions>
				<Grid spacing={2} container>
					<Grid xs={4} item>
						<Button onClick={onCloseDialog} variant="outlined" size="large" fullWidth>
							Отмена
						</Button>
					</Grid>
					<Grid xs={8} item>
						<Button
							type={!checkSellingPrice ? 'submit' : 'button'}
							onClick={!checkSellingPrice ? () => {} : submitForm}
							disabled={isSubmitting}
							variant="contained"
							color="primary"
							size="large"
							fullWidth
						>
							{isSubmitting ? <CircularProgress size={20} style={{ position: 'absolute' }} /> : null}
							<span className="loading-button-label" style={{ opacity: Number(!isSubmitting) }}>
								{checkSellingPrice ? 'Создать поступление' : 'Рассчитать цену продажи'}
							</span>
						</Button>
					</Grid>
				</Grid>
			</DialogActions>
		</Form>
	);
};

export default FormReceiptCreate;
