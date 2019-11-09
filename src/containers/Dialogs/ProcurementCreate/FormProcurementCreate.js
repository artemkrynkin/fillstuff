import React, { useState } from 'react';
import { Form, Field, FastField, FieldArray } from 'formik';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogContent from '@material-ui/core/DialogContent';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField/TextField';

import { formError } from 'src/helpers/utils';

import CheckboxWithLabel from 'src/components/CheckboxWithLabel';
import { PDDialogActions } from 'src/components/Dialog';
import NumberFormat, { currencyFormatProps, currencyFormatInputProps } from 'src/components/NumberFormat';
import { SelectAutocomplete } from 'src/components/selectAutocomplete';

import stylesGlobal from 'src/styles/globals.module.css';
import styles from './index.module.css';

const onUnitSellingPriceCalc = (value, fieldName, receipt, index, setFieldValue, currentStock) => {
	setFieldValue(`receipts.${index}.${fieldName}`, value);

	const checkEmptinessField = receipt[`${fieldName === 'quantityInUnit' ? 'purchasePrice' : 'quantityInUnit'}`];
	const setValue = fieldName === 'quantityInUnit' ? receipt.purchasePrice / value : value / receipt.quantityInUnit;
	const conditionSetValue = !!value && !!checkEmptinessField ? setValue : '';

	if (
		currentStock.actualSellingPriceInProcurementCreate &&
		receipt.position.activeReceipt &&
		Number(conditionSetValue) < receipt.position.activeReceipt.unitSellingPrice
	)
		return;

	setFieldValue(`receipts.${index}.unitSellingPrice`, conditionSetValue);
};

const FormProcurementCreate = props => {
	const {
		currentStock,
		onOpenDialogPositionCreate,
		receiptInitialValues,
		onHandleEditFormProcurement,
		positions: {
			data: positions,
			isFetching: isLoadingPositions,
			// error: errorPositions
		},
		formEditable,
		formikProps: { errors, isSubmitting, submitForm, setFieldValue, touched, values },
	} = props;
	const [textSearchPosition, setTextSearchPosition] = useState('');

	const receipts =
		!isLoadingPositions && positions
			? positions.filter(position => !values.receipts.some(receipt => receipt.position && receipt.position._id === position._id))
			: [];

	const onChangeTextSearchPosition = value => setTextSearchPosition(value);

	return (
		<Form>
			<DialogContent>
				<Grid className={stylesGlobal.formLabelControl} spacing={2} style={{ marginBottom: 12 }} container>
					<Grid xs={6} item>
						<FastField
							name="number"
							label="Номер чека или накладной:"
							error={Boolean(touched.number && errors.number)}
							helperText={(touched.number && errors.number) || ''}
							as={TextField}
							disabled={isSubmitting || !formEditable}
							autoFocus
							fullWidth
						/>
					</Grid>
					<Grid xs={3} item>
						<FastField
							name="purchasePrice"
							placeholder="0"
							label="Стоимость закупки:"
							error={Boolean(touched.purchasePrice && errors.purchasePrice)}
							helperText={(touched.purchasePrice && errors.purchasePrice) || ''}
							as={TextField}
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
					</Grid>
					<Grid xs={3} item>
						<Field
							name="costDelivery"
							placeholder="0"
							label="Стоимость доставки:"
							as={TextField}
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
						<Grid alignItems="center" container>
							<Field
								type="checkbox"
								name="divideCostDeliverySellingPositions"
								Label={{ label: 'Распределить между позициями для продажи' }}
								as={CheckboxWithLabel}
								disabled={isSubmitting || !formEditable || !values.receipts.some(receipt => !receipt.position.isFree)}
							/>
						</Grid>
					</Grid>
				</Grid>

				<FieldArray
					name="receipts"
					validateOnChange={false}
					render={arrayHelpers => (
						<div className={styles.receipts}>
							{formEditable ? (
								<div>
									<Grid
										className={stylesGlobal.formLabelControl}
										alignItems="flex-start"
										spacing={2}
										style={{ marginBottom: 12 }}
										container
									>
										<Grid xs={9} item>
											<SelectAutocomplete
												value={textSearchPosition}
												onChange={(option, { action }) => {
													if (action === 'select-option') {
														let activeReceiptSellingPrice = {};

														if (currentStock.actualSellingPriceInProcurementCreate && option.activeReceipt) {
															activeReceiptSellingPrice.sellingPrice = option.activeReceipt.sellingPrice;
															activeReceiptSellingPrice.unitSellingPrice = option.activeReceipt.unitSellingPrice;
														}

														arrayHelpers.push(receiptInitialValues(option, activeReceiptSellingPrice));
														onChangeTextSearchPosition(textSearchPosition);
													}
												}}
												onInputChange={(value, { action }) => {
													if (action !== 'input-blur' && action !== 'menu-close') {
														onChangeTextSearchPosition(value);
													}
												}}
												menuPlacement="auto"
												menuPosition="fixed"
												placeholder="Выберите позицию"
												noOptionsMessage={() =>
													receipts.length === 0 ? 'Нет позиций для выбора. Создайте новую позицию' : 'Среди позиций совпадений не найдено.'
												}
												options={receipts}
												isDisabled={isSubmitting || !formEditable}
												isClearable
											/>
											{typeof errors.receipts === 'string' ? <FormHelperText error>{errors.receipts}</FormHelperText> : null}
										</Grid>
										<Grid xs={3} item>
											<Button onClick={onOpenDialogPositionCreate} variant="outlined" color="primary" fullWidth>
												Создать новую позицию
											</Button>
										</Grid>
									</Grid>
									{Object.keys(errors).length === 1 && Object.keys(errors).some(value => value === 'purchasePriceTemp') ? (
										<Grid style={{ marginBottom: 20 }} container>
											<FormHelperText error>
												<b>{errors.purchasePriceTemp}</b>
											</FormHelperText>
										</Grid>
									) : null}
								</div>
							) : (
								<Grid className={styles.totalContainer} direction="column" alignItems="flex-end" container>
									<NumberFormat
										value={values.totalPurchasePrice}
										renderText={value => (
											<div className={styles.totalPurchasePrice}>
												Сумма закупки: <span>{value}</span>
											</div>
										)}
										displayType="text"
										onValueChange={() => {}}
										{...currencyFormatProps}
									/>
									<NumberFormat
										value={values.purchasePrice}
										renderText={value => (
											<div className={styles.purchasePrice}>
												Стоимость закупки: <span>{value}</span>
											</div>
										)}
										displayType="text"
										onValueChange={() => {}}
										{...currencyFormatProps}
									/>
									<NumberFormat
										value={values.costDelivery || 0}
										renderText={value => (
											<div className={styles.costDelivery}>
												Стоимость доставки: <span>{value}</span>
											</div>
										)}
										displayType="text"
										onValueChange={() => {}}
										{...currencyFormatProps}
									/>
								</Grid>
							)}

							{values.receipts.map((receipt, index) => (
								<Grid
									key={index}
									className={`${styles.receipt} ${stylesGlobal.formLabelControl}`}
									alignItems="flex-start"
									spacing={2}
									style={{ marginBottom: 12 }}
									container
								>
									<Grid style={{ width: 190 }} item>
										<TextField
											className="none-padding"
											label="&nbsp;"
											value={receipt.position.label}
											inputProps={{
												readOnly: true,
											}}
											fullWidth
										/>
									</Grid>

									<Grid style={{ width: 180 }} item>
										{receipt.position.unitReceipt === 'pce' || receipt.position.unitIssue !== 'pce' ? (
											<FastField
												name={`receipts.${index}.quantity`}
												label={`Количество ${
													receipt.position.unitReceipt === 'nmp' && receipt.position.unitIssue !== 'pce' ? 'упаковок' : 'штук'
												}:`}
												placeholder="0"
												error={Boolean(formError(touched, errors, `receipts.${index}.quantity`))}
												helperText={formError(touched, errors, `receipts.${index}.quantity`)}
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
												helperText={formError(touched, errors, `receipts.${index}.quantityPackages`)}
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

									{receipt.position.unitReceipt === 'nmp' && receipt.position.unitIssue === 'pce' ? (
										<Grid style={{ width: 180 }} item>
											<Field
												name={`receipts.${index}.quantityInUnit`}
												label="Штук в упаковке:"
												placeholder="0"
												as={TextField}
												error={Boolean(formError(touched, errors, `receipts.${index}.quantityInUnit`))}
												helperText={formError(touched, errors, `receipts.${index}.quantityInUnit`)}
												InputProps={{
													inputComponent: NumberFormat,
													inputProps: {
														allowNegative: false,
														onChange: ({ target: { value } }) => {
															onUnitSellingPriceCalc(value, 'quantityInUnit', receipt, index, setFieldValue, currentStock);
														},
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
												label={`Цена закупки${
													receipt.position.unitReceipt === 'nmp' && receipt.position.unitIssue === 'pce' ? ' упаковки' : ''
												}:`}
												placeholder="0"
												as={TextField}
												error={Boolean(formError(touched, errors, `receipts.${index}.purchasePrice`))}
												helperText={formError(touched, errors, `receipts.${index}.purchasePrice`)}
												InputProps={{
													endAdornment: <InputAdornment position="end">₽</InputAdornment>,
													inputComponent: NumberFormat,
													inputProps: {
														...currencyFormatInputProps,
														onChange: ({ target: { value } }) => {
															if (receipt.position.unitReceipt === 'nmp' && receipt.position.unitIssue === 'pce') {
																onUnitSellingPriceCalc(value, 'purchasePrice', receipt, index, setFieldValue, currentStock);
															} else {
																setFieldValue(`receipts.${index}.purchasePrice`, value);

																if (
																	currentStock.actualSellingPriceInProcurementCreate &&
																	receipt.position.activeReceipt &&
																	Number(value) < receipt.position.activeReceipt.sellingPrice
																)
																	return;

																setFieldValue(`receipts.${index}.sellingPrice`, value);
																setFieldValue(`receipts.${index}.unitSellingPrice`, value);
															}
														},
													},
												}}
												disabled={isSubmitting || !formEditable}
												fullWidth
											/>
										) : (
											<TextField
												label={`Цена закупки${
													receipt.position.unitReceipt === 'nmp' && receipt.position.unitIssue === 'pce' ? ' упаковки' : ''
												}:`}
												defaultValue={receipt.purchasePrice + receipt.costDelivery}
												helperText={
													Boolean(values.costDelivery) ? (
														<NumberFormat
															value={receipt.purchasePrice}
															renderText={value => (
																<span style={{ display: 'inline-block', margin: '0 15px 0 8px' }}>
																	{!values.divideCostDeliverySellingPositions || !receipt.position.isFree ? (
																		<span>
																			<b>{value}</b> без учёта стоимости доставки
																		</span>
																	) : (
																		'Стоимость доставки не распределяется на эту позицию'
																	)}
																</span>
															)}
															displayType="text"
															onValueChange={() => {}}
															{...currencyFormatProps}
														/>
													) : null
												}
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
										{!receipt.position.isFree ? (
											formEditable ? (
												receipt.position.unitReceipt === 'nmp' && receipt.position.unitIssue === 'pce' ? (
													<Field
														name={`receipts.${index}.unitSellingPrice`}
														label="Цена продажи штуки:"
														placeholder="0"
														as={TextField}
														error={Boolean(formError(touched, errors, `receipts.${index}.unitSellingPrice`))}
														helperText={formError(touched, errors, `receipts.${index}.unitSellingPrice`)}
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
													<Field
														name={`receipts.${index}.sellingPrice`}
														label="Цена продажи:"
														placeholder="0"
														as={TextField}
														error={Boolean(formError(touched, errors, `receipts.${index}.sellingPrice`))}
														helperText={formError(touched, errors, `receipts.${index}.sellingPrice`)}
														InputProps={{
															endAdornment: <InputAdornment position="end">₽</InputAdornment>,
															inputComponent: NumberFormat,
															inputProps: {
																...currencyFormatInputProps,
																onChange: ({ target: { value } }) => {
																	setFieldValue(`receipts.${index}.sellingPrice`, value);
																	setFieldValue(`receipts.${index}.unitSellingPrice`, value);
																},
															},
														}}
														disabled={isSubmitting || !formEditable}
														fullWidth
													/>
												)
											) : (
												<TextField
													label={
														receipt.position.unitReceipt === 'nmp' && receipt.position.unitIssue === 'pce'
															? 'Цена продажи штуки:'
															: 'Цена продажи:'
													}
													defaultValue={receipt.unitSellingPrice + receipt.unitCostDelivery}
													helperText={
														Boolean(values.costDelivery) ? (
															<NumberFormat
																value={
																	receipt.position.unitReceipt === 'nmp' && receipt.position.unitIssue === 'pce'
																		? receipt.unitSellingPrice
																		: receipt.sellingPrice
																}
																renderText={value => (
																	<span style={{ display: 'inline-block', margin: '0 15px 0 8px' }}>
																		{!values.divideCostDeliverySellingPositions || !receipt.position.isFree ? (
																			<span>
																				<b>{value}</b> без учёта стоимости доставки
																			</span>
																		) : (
																			'Стоимость доставки не распределяется на эту позицию'
																		)}
																	</span>
																)}
																displayType="text"
																onValueChange={() => {}}
																{...currencyFormatProps}
															/>
														) : null
													}
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
											)
										) : (
											<TextField
												className="none-padding"
												label={
													receipt.position.unitReceipt === 'nmp' && receipt.position.unitIssue === 'pce'
														? 'Цена продажи штуки:'
														: 'Цена продажи:'
												}
												defaultValue="Бесплатный отпуск"
												inputProps={{
													readOnly: true,
												}}
												fullWidth
											/>
										)}
									</Grid>

									{formEditable ? (
										<div className={styles.removeReceipt}>
											<IconButton
												size="small"
												onClick={() => {
													arrayHelpers.remove(index);
													if (values.receipts.filter(receipt => !receipt.position.isFree).length === 1) {
														setFieldValue('divideCostDeliverySellingPositions', false);
													}
												}}
												disableRipple
												disableFocusRipple
											>
												<FontAwesomeIcon icon={['fal', 'times']} />
											</IconButton>
										</div>
									) : null}
								</Grid>
							))}
						</div>
					)}
				/>

				<Grid>
					<FastField
						name="comment"
						label="Комментарий:"
						as={TextField}
						rows={2}
						rowsMax={4}
						disabled={isSubmitting || !formEditable}
						multiline
						fullWidth
					/>
				</Grid>
			</DialogContent>
			<PDDialogActions
				leftHandleProps={
					!formEditable
						? {
								handleProps: {
									onClick: () => {
										onHandleEditFormProcurement(true);
									},
								},
								text: 'Редактировать закупку',
						  }
						: {}
				}
				rightHandleProps={{
					handleProps: {
						onClick: () => submitForm(),
						disabled: isSubmitting,
					},
					text: isSubmitting ? (
						<CircularProgress size={20} />
					) : !formEditable ? (
						'Занести на склад'
					) : Number(values.costDelivery) ? (
						'Проверить данные и распределить доставку между позициями'
					) : (
						'Проверить данные'
					),
				}}
			/>
		</Form>
	);
};

export default FormProcurementCreate;
