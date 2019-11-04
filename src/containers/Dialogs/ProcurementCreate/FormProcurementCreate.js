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
import Tooltip from 'src/components/Tooltip';

import stylesGlobal from 'src/styles/globals.module.css';
import styles from './index.module.css';

const onUnitSellingPriceCalc = (value, fieldName, receipt, index, setFieldValue) => {
	setFieldValue(`receipts.${index}.${fieldName}`, value);

	const checkEmptinessField = receipt[`${fieldName === 'quantityInUnit' ? 'purchasePrice' : 'quantityInUnit'}`];
	const setValue = fieldName === 'quantityInUnit' ? receipt.purchasePrice / value : value / receipt.quantityInUnit;
	const conditionSetValue = !!value && !!checkEmptinessField ? setValue : '';

	setFieldValue(`receipts.${index}.unitSellingPrice`, conditionSetValue);
};

const FormProcurementCreate = props => {
	const {
		onOpenDialogPositionCreate,
		receiptInitialValues,
		onHandleEditFormProcurement,
		onFormRecounted,
		positions: {
			data: positions,
			isFetching: isLoadingPositions,
			// error: errorPositions
		},
		formEditable,
		formRecounted,
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
					<Grid style={{ width: 'calc(100% - 350px)' }} item>
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
					<Grid style={{ width: 350 }} item>
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
								onChange: ({ target: { value } }) => {
									setFieldValue('costDelivery', value);

									onFormRecounted(!value);
								},
							}}
							disabled={isSubmitting || !formEditable}
							fullWidth
						/>
						{values.receipts.some(receipt => !receipt.position.isFree) ? (
							<Grid alignItems="center" container>
								<Field
									type="checkbox"
									name="divideCostDeliverySellingPositions"
									Label={{ label: 'Распределить на позиции для продажи' }}
									as={CheckboxWithLabel}
									disabled={isSubmitting || !formEditable}
								/>
								<Tooltip
									title={
										<div>
											Стоимость доставки будет распределена только на позиции для продажи.
											<br />
											Цены закупки/продажи у всех остальных позиций останутся без изменений
										</div>
									}
									placement="bottom-end"
									interactive
								>
									<div>
										<FontAwesomeIcon className={styles.iconCostDeliveryDivide} icon={['fal', 'question-circle']} />
									</div>
								</Tooltip>
							</Grid>
						) : null}
					</Grid>
				</Grid>

				<FieldArray
					name="receipts"
					validateOnChange={false}
					render={arrayHelpers => (
						<div className={styles.receipts}>
							{formEditable ? (
								<Grid className={stylesGlobal.formLabelControl} alignItems="flex-start" spacing={2} style={{ marginBottom: 12 }} container>
									<Grid xs={9} item>
										<SelectAutocomplete
											value={textSearchPosition}
											onChange={(option, { action }) => {
												if (action === 'select-option') {
													arrayHelpers.push(receiptInitialValues(option));
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
										value={values.purchasePricePositions}
										renderText={value => (
											<div className={styles.purchasePricePositions}>
												Позиций на сумму: <span>{value}</span>
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
															onUnitSellingPriceCalc(value, 'quantityInUnit', receipt, index, setFieldValue);
														},
													},
												}}
												disabled={isSubmitting || !formEditable}
												fullWidth
											/>
										</Grid>
									) : null}

									<Grid style={{ width: 180 }} item>
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
															onUnitSellingPriceCalc(value, 'purchasePrice', receipt, index, setFieldValue);
														} else {
															setFieldValue(`receipts.${index}.purchasePrice`, value);
															setFieldValue(`receipts.${index}.sellingPrice`, value);
															setFieldValue(`receipts.${index}.unitSellingPrice`, value);
														}

														onFormRecounted(!values.costDelivery);
													},
												},
											}}
											disabled={isSubmitting || !formEditable}
											fullWidth
										/>
										{!formEditable && formRecounted ? (
											<FormHelperText>
												<NumberFormat
													value={receipt.purchasePrice + receipt.costDelivery}
													renderText={value =>
														!values.divideCostDeliverySellingPositions || !receipt.position.isFree
															? `С учётом стоимости доставки ${value}`
															: 'Стоимость доставки не включена'
													}
													displayType="text"
													onValueChange={() => {}}
													{...currencyFormatProps}
												/>
											</FormHelperText>
										) : null}
									</Grid>

									<Grid style={{ width: 180 }} item>
										{!receipt.position.isFree ? (
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
													placeholder={`${String(receipt.purchasePrice || 0)} ₽`}
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
										{!receipt.position.isFree && !formEditable && formRecounted ? (
											<FormHelperText>
												<NumberFormat
													value={receipt.unitSellingPrice + receipt.unitCostDelivery}
													renderText={value => `С учётом стоимости доставки ${value}`}
													displayType="text"
													onValueChange={() => {}}
													{...currencyFormatProps}
												/>
											</FormHelperText>
										) : null}
									</Grid>

									{formEditable ? (
										<div className={styles.removeReceipt}>
											<IconButton
												aria-haspopup="true"
												size="small"
												onClick={() => arrayHelpers.remove(index)}
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
										onFormRecounted(false);
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
					) : !formEditable && formRecounted ? (
						'Занести на склад'
					) : (
						'Включить доставку в стоимость'
					),
				}}
			/>
		</Form>
	);
};

export default FormProcurementCreate;
