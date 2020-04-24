import React, { useRef } from 'react';
import { Field } from 'formik';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

import { receiptCalc } from 'shared/checkPositionAndReceipt';
import { formatNumber } from 'shared/utils';

import { formError, formErrorHelperText } from 'src/helpers/utils';

import NumberFormat, { moneyInputFormatProps, currencyMoneyFormatProps } from 'src/components/NumberFormat';
import PositionNameInList from 'src/components/PositionNameInList';
import Tooltip from 'src/components/Tooltip';
import { DefinitionList, DefinitionListItem } from 'src/components/Definition';

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

	const isNmpPce = receipt.position.unitReceipt === 'nmp' && receipt.position.unitRelease === 'pce';
	const isNmpNmp = receipt.position.unitReceipt === 'nmp' && receipt.position.unitRelease === 'nmp';

	const autoGenUnitSellingPrice =
		!formEditable && !receipt.position.isFree ? formatNumber(receipt.unitPurchasePrice + receipt.unitCostDelivery + receipt.unitMarkup) : 0;

	return (
		<Grid className={styles.receiptItem} direction="column" container>
			<Grid wrap="nowrap" alignItems="center" container>
				<Grid style={{ flex: '1 1' }} zeroMinWidth item>
					<PositionNameInList
						name={receipt.position.name}
						characteristics={receipt.position.characteristics}
						size="md"
						style={{ marginBottom: 15 }}
					/>
				</Grid>
				{formEditable ? (
					<Grid className={styles.removeReceipt} item>
						<IconButton className={styles.removeReceiptButton} onClick={() => remove(index)} tabIndex={-1}>
							<FontAwesomeIcon icon={['fal', 'times']} />
						</IconButton>
					</Grid>
				) : null}
			</Grid>
			<Grid alignItems="flex-start" spacing={2} container>
				<Grid style={{ width: 154 }} item>
					{receipt.position.unitReceipt === 'pce' || receipt.position.unitRelease === 'nmp' ? (
						<Field
							name={`receipts.${index}.quantity`}
							label={isNmpNmp ? 'Количество уп.' : 'Количество шт.'}
							placeholder="0"
							error={formError(touched, errors, `receipts.${index}.quantity`)}
							helperText={formErrorHelperText(touched, errors, `receipts.${index}.quantity`, null)}
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
							error={formError(touched, errors, `receipts.${index}.quantityPackages`)}
							helperText={formErrorHelperText(touched, errors, `receipts.${index}.quantityPackages`, null)}
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
					<Grid style={{ width: 154 }} item>
						<Field
							name={`receipts.${index}.quantityInUnit`}
							label="Штук в упаковке"
							placeholder="0"
							as={TextField}
							error={formError(touched, errors, `receipts.${index}.quantityInUnit`)}
							helperText={formErrorHelperText(touched, errors, `receipts.${index}.quantityInUnit`, null)}
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

				<Grid style={{ width: 154 }} item>
					<Field
						name={`receipts.${index}.purchasePrice`}
						label={receipt.position.unitReceipt === 'nmp' ? 'Цена покупки уп.' : 'Цена покупки шт.'}
						placeholder="0"
						as={TextField}
						error={formError(touched, errors, `receipts.${index}.purchasePrice`)}
						helperText={formErrorHelperText(touched, errors, `receipts.${index}.purchasePrice`, null)}
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
				</Grid>

				{formEditable ? (
					<Grid style={{ width: 154 }} item>
						{!receipt.position.isFree ? (
							<Field
								name={`receipts.${index}.markupPercent`}
								label="Наценка"
								placeholder="0"
								as={TextField}
								error={formError(touched, errors, `receipts.${index}.markupPercent`)}
								helperText={formErrorHelperText(touched, errors, `receipts.${index}.markupPercent`, null)}
								InputProps={{
									endAdornment: <InputAdornment position="end">%</InputAdornment>,
									inputComponent: NumberFormat,
									inputProps: {
										...moneyInputFormatProps,
										decimalScale: 4,
									},
								}}
								disabled={isSubmitting || !formEditable}
								fullWidth
							/>
						) : null}
					</Grid>
				) : (
					<Grid style={{ width: 174 }} item>
						{!receipt.position.isFree ? (
							<Grid wrap="nowrap" alignItems="flex-start" container>
								<Grid item>
									<Field
										innerRef={sellingPriceFieldRef}
										name={isNmpPce ? `receipts.${index}.unitSellingPrice` : `receipts.${index}.sellingPrice`}
										label={isNmpNmp ? 'Цена продажи уп.' : 'Цена продажи шт.'}
										placeholder="0"
										as={TextField}
										error={formError(touched, errors, isNmpPce ? `receipts.${index}.unitSellingPrice` : `receipts.${index}.sellingPrice`)}
										helperText={formErrorHelperText(
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
													if (Number(value) < autoGenUnitSellingPrice) {
														setFieldValue(
															isNmpPce ? `receipts.${index}.unitSellingPrice` : `receipts.${index}.sellingPrice`,
															autoGenUnitSellingPrice
														);
													}
												},
												onChange: ({ target: { value } }) => {
													const receiptValues = {
														purchasePrice: receipt.purchasePrice,
														unitPurchasePrice: receipt.unitPurchasePrice,
														sellingPrice: Number(value),
														unitSellingPrice: Number(value),
														costDelivery: receipt.costDelivery,
														unitCostDelivery: receipt.unitCostDelivery,
													};

													const newReceiptValues = {
														...receiptCalc.markupPercent(receiptValues, {
															isFree: receipt.position.isFree,
															unitReceipt: receipt.position.unitReceipt,
															unitRelease: receipt.position.unitRelease,
														}),
														...receiptCalc.sellingPrice(receiptValues, {
															isFree: receipt.position.isFree,
														}),
													};

													setFieldValue(`receipts.${index}.sellingPrice`, newReceiptValues.sellingPrice);
													setFieldValue(`receipts.${index}.unitSellingPrice`, newReceiptValues.unitSellingPrice);
													setFieldValue(`receipts.${index}.markupPercent`, newReceiptValues.markupPercent);
													setFieldValue(`receipts.${index}.markup`, newReceiptValues.markup);
													setFieldValue(`receipts.${index}.unitMarkup`, newReceiptValues.unitMarkup);
												},
											},
										}}
										disabled={isSubmitting}
										validate={value => {
											if (Number(value) < autoGenUnitSellingPrice) {
												return 'Не может быть ниже рассчитанной цены';
											}
										}}
										fullWidth
									/>
								</Grid>
								<Grid style={{ marginTop: 32 }} item>
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
										placement="top-end"
										style={{ marginLeft: 8 }}
										interactive
									>
										<div className={styles.searchSellingPrice}>
											<span className="fa-layers fa-fw">
												<FontAwesomeIcon icon={['fal', 'search']} />
												<FontAwesomeIcon icon={['fas', 'ruble-sign']} transform="shrink-9 down--1.5 right--1.5" />
											</span>
										</div>
									</Tooltip>
								</Grid>
							</Grid>
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
		</Grid>
	);
};

export default FormFieldArrayReceipt;
