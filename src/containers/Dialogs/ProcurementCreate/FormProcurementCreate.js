import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import ClassNames from 'classnames';
import { Form, Field, FastField, FieldArray } from 'formik';
import loadable from '@loadable/component';
import moment from 'moment';
import MomentUtils from '@date-io/moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogContent from '@material-ui/core/DialogContent';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import InputLabel from '@material-ui/core/InputLabel';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { DatePicker } from '@material-ui/pickers';

import { percentOfNumber } from 'shared/utils';

import { formError } from 'src/helpers/utils';

import CheckboxWithLabel from 'src/components/CheckboxWithLabel';
import { PDDialogActions } from 'src/components/Dialog';
import NumberFormat, { currencyFormatProps, currencyFormatInputProps } from 'src/components/NumberFormat';
import { SelectAutocomplete } from 'src/components/selectAutocomplete';
import Dropdown from 'src/components/Dropdown';

import { getCharacteristics } from 'src/actions/characteristics';

import stylesGlobal from 'src/styles/globals.module.css';
import styles from './index.module.css';

const DialogPositionCreate = loadable(() =>
	import('src/containers/Dialogs/PositionCreateEdit' /* webpackChunkName: "Dialog_PositionCreateEdit" */)
);

const onUnitSellingPriceCalc = (value, fieldName, receipt, index, setFieldValue) => {
	setFieldValue(`receipts.${index}.${fieldName}`, value);

	const checkEmptinessField = receipt[`${fieldName === 'quantityInUnit' ? 'purchasePrice' : 'quantityInUnit'}`];
	const setValue = fieldName === 'quantityInUnit' ? receipt.purchasePrice / value : value / receipt.quantityInUnit;
	const conditionSetValue = !!value && !!checkEmptinessField ? setValue : '';

	setFieldValue(`receipts.${index}.unitSellingPrice`, conditionSetValue);
};

const addPositionContainerClasses = formEditable =>
	ClassNames({
		[styles.addPositionContainer]: true,
		[styles.disabled]: !formEditable,
	});

const FormProcurementCreate = props => {
	const {
		currentStock,
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
	const [dialogPositionCreate, setDialogPositionCreate] = useState(false);
	const refDropdownDate = useRef(null);
	const [dropdownDate, setDropdownDate] = useState(false);
	const [textSearchPosition, setTextSearchPosition] = useState('');

	const positionsAvailable =
		!isLoadingPositions && positions
			? positions.filter(position => !values.receipts.some(receipt => receipt.position && receipt.position._id === position._id))
			: [];

	const onOpenDialogPositionCreate = async () => {
		await props.getCharacteristics();

		setDialogPositionCreate(true);
	};

	const onCloseDialogPositionCreate = () => setDialogPositionCreate(false);

	const onHandleDropdownDate = value => setDropdownDate(!value === null || value === undefined ? !dropdownDate : value);

	const onChangeDate = date => {
		setFieldValue('date', date);
		onHandleDropdownDate(false);
	};

	const onChangeTextSearchPosition = value => setTextSearchPosition(value);

	return (
		<Form>
			<DialogContent style={{ overflow: 'initial' }}>
				<Grid style={{ marginBottom: 2 }} spacing={2} container>
					<Grid xs={4} item>
						<FastField
							name="number"
							label="Номер чека/накладной:"
							error={Boolean(touched.number && errors.number)}
							helperText={(touched.number && errors.number) || ''}
							as={TextField}
							disabled={isSubmitting || !formEditable}
							autoFocus
							fullWidth
						/>
					</Grid>
					<Grid xs={2} item>
						<Grid
							className={stylesGlobal.formLabelControl}
							wrap="nowrap"
							alignItems={Boolean(touched.date && errors.date) ? 'center' : 'flex-end'}
							style={{ marginBottom: 0 }}
							container
						>
							<InputLabel style={{ margin: '0 8px 0 -8px' }}>от</InputLabel>
							<TextField
								ref={refDropdownDate}
								name="date"
								label="Дата:"
								error={Boolean(touched.date && errors.date)}
								helperText={(touched.date && errors.date) || ''}
								disabled={isSubmitting || !formEditable}
								value={values.date ? moment(values.date).format('DD.MM.YYYY') : ''}
								onFocus={() => onHandleDropdownDate(true)}
								fullWidth
							/>
						</Grid>

						<Dropdown
							anchor={refDropdownDate}
							open={dropdownDate}
							onClose={() => onHandleDropdownDate(false)}
							placement="bottom"
							arrow={false}
							disablePortal={false}
						>
							<MuiPickersUtilsProvider utils={MomentUtils}>
								<DatePicker
									value={values.date}
									onChange={onChangeDate}
									variant="static"
									leftArrowButtonProps={{
										size: 'small',
									}}
									leftArrowIcon={<FontAwesomeIcon icon={['far', 'angle-left']} />}
									rightArrowButtonProps={{
										size: 'small',
									}}
									rightArrowIcon={<FontAwesomeIcon icon={['far', 'angle-right']} />}
									disableFuture
									disableToolbar
								/>
							</MuiPickersUtilsProvider>
						</Dropdown>
					</Grid>
					<Grid xs={3} item>
						<FastField
							name="totalPrice"
							placeholder="0"
							label="Итого по чеку/накладной:"
							error={Boolean(touched.totalPrice && errors.totalPrice)}
							helperText={(touched.totalPrice && errors.totalPrice) || ''}
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
					</Grid>
				</Grid>

				<FieldArray
					name="receipts"
					validateOnChange={false}
					render={arrayHelpers => (
						<div className={styles.receipts}>
							{formEditable ? (
								<div className={styles.receiptsHeader}>
									<Grid alignItems="center" style={{ marginBottom: 10 }} container>
										<Field
											type="checkbox"
											name="notCompensateCostDelivery"
											Label={{ label: 'Не компенсировать стоимость доставки за счёт позиций для продажи' }}
											as={CheckboxWithLabel}
											disabled={isSubmitting || !formEditable}
										/>
									</Grid>
								</div>
							) : null}
							<div className="sentinel-topAddPositionContainer" />
							<div className={addPositionContainerClasses(formEditable)}>
								<Grid alignItems="flex-start" spacing={2} style={{ marginBottom: 0 }} container>
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
												positionsAvailable.length === 0
													? 'Нет позиций для выбора. Создайте новую позицию'
													: 'Среди позиций совпадений не найдено.'
											}
											options={positionsAvailable}
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
								{Object.keys(errors).length === 1 && Object.keys(errors).some(value => value === 'pricePositions') ? (
									<Grid style={{ marginBottom: 20 }} container>
										<FormHelperText error>
											<b>{errors.pricePositions}</b>
										</FormHelperText>
									</Grid>
								) : null}
							</div>

							{values.receipts.length ? (
								<div className={styles.receiptsItems}>
									{values.receipts.map((receipt, index) => (
										<Grid
											key={index}
											className={styles.receiptItem}
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
												{formEditable ? (
													<Field
														name={`receipts.${index}.purchasePrice`}
														label={`Цена покупки${
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
																},
															},
														}}
														disabled={isSubmitting || !formEditable}
														fullWidth
													/>
												) : (
													<TextField
														label={`Цена покупки${
															receipt.position.unitReceipt === 'nmp' && receipt.position.unitIssue === 'pce' ? ' упаковки' : ''
														}:`}
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
																validate={value => {
																	if (value < receipt.purchasePrice / receipt.quantityInUnit)
																		return 'Цена продажи не может быть меньше цены покупки';
																}}
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
																validate={value => {
																	if (value < receipt.purchasePrice) return 'Цена продажи не может быть меньше цены покупки';
																}}
																fullWidth
															/>
														)
													) : (
														<Tooltip
															title={
																<div>
																	<NumberFormat
																		value={receipt.unitSellingPrice}
																		renderText={value => `Цена продажи: ${value}`}
																		displayType="text"
																		onValueChange={() => {}}
																		{...currencyFormatProps}
																	/>
																	<br />
																	<NumberFormat
																		value={receipt.unitCostDelivery}
																		renderText={value => `Стоимость доставки: ${value}`}
																		displayType="text"
																		onValueChange={() => {}}
																		{...currencyFormatProps}
																	/>
																	<br />
																	{receipt.position.extraCharge > 0 ? (
																		<NumberFormat
																			value={percentOfNumber(receipt.unitSellingPrice, receipt.position.extraCharge)}
																			renderText={value => `Процент студии: ${value}`}
																			displayType="text"
																			onValueChange={() => {}}
																			{...currencyFormatProps}
																		/>
																	) : null}
																</div>
															}
														>
															<TextField
																label={
																	receipt.position.unitReceipt === 'nmp' && receipt.position.unitIssue === 'pce'
																		? 'Цена продажи штуки:'
																		: 'Цена продажи:'
																}
																defaultValue={
																	receipt.unitSellingPrice +
																	receipt.unitCostDelivery +
																	percentOfNumber(receipt.unitSellingPrice, receipt.position.extraCharge)
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
														</Tooltip>
													)
												) : (
													<TextField
														className="none-padding"
														label={
															receipt.position.unitReceipt === 'nmp' && receipt.position.unitIssue === 'pce'
																? 'Цена продажи штуки:'
																: 'Цена продажи:'
														}
														defaultValue="Бесплатно"
														inputProps={{
															readOnly: true,
														}}
														fullWidth
													/>
												)}
											</Grid>

											{formEditable ? (
												<div className={styles.removeReceipt}>
													<IconButton size="small" onClick={() => arrayHelpers.remove(index)} disableRipple disableFocusRipple>
														<FontAwesomeIcon icon={['fal', 'times']} />
													</IconButton>
												</div>
											) : null}
										</Grid>
									))}
								</div>
							) : null}

							<DialogPositionCreate
								type="create"
								dialogOpen={dialogPositionCreate}
								onCloseDialog={onCloseDialogPositionCreate}
								onCallback={response => {
									if (response.status === 'success') {
										const position = response.data;

										arrayHelpers.push(
											receiptInitialValues({
												_id: position._id,
												unitIssue: position.unitIssue,
												unitReceipt: position.unitReceipt,
												isFree: position.isFree,
												extraCharge: position.extraCharge,
												label:
													position.name +
													position.characteristics.reduce(
														(fullCharacteristics, characteristic) => `${fullCharacteristics} ${characteristic.label}`,
														''
													),
												value: position._id,
											})
										);
									}
								}}
								currentStockId={currentStock._id}
							/>
						</div>
					)}
				/>
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
					) : (
						'Проверить данные и рассчитать стоимость продажи'
					),
				}}
			/>
		</Form>
	);
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStock } = ownProps;

	return {
		getCharacteristics: () => dispatch(getCharacteristics(currentStock._id)),
	};
};

export default connect(null, mapDispatchToProps)(FormProcurementCreate);
