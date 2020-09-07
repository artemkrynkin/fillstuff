import React, { useRef, useState } from 'react';
import { Form, Field, FieldArray, ErrorMessage } from 'formik';
import moment from 'moment';
import ClassNames from 'classnames';
import loadable from '@loadable/component';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';
import MomentUtils from '@material-ui/pickers/adapter/moment';
import { StaticDatePicker, LocalizationProvider } from '@material-ui/pickers';

import { declensionNumber } from 'src/helpers/utils';

import CheckboxWithLabel from 'src/components/CheckboxWithLabel';
import { SelectAutocomplete } from 'src/components/selectAutocomplete';
import NumberFormat, { moneyInputFormatProps } from 'src/components/NumberFormat';
import Dropdown from 'src/components/Dropdown';

import Receipts from './Receipts';

import stylesGlobal from 'src/styles/globals.module.css';
import styles from './index.module.css';
import Collapse from '@material-ui/core/Collapse';

const DialogShopCreate = loadable(() => import('src/pages/Dialogs/ShopCreateEdit' /* webpackChunkName: "Dialog_ShopCreateEdit" */));

const ProcurementForm = props => {
	const {
		dialogRef,
		receiptInitialValues,
		onHandleEditFormProcurement,
		shops: {
			data: shops,
			isFetching: isLoadingShops,
			// error: errorShops
		},
		positions,
		formEditable,
		formikProps: { errors, isSubmitting, submitForm, setFieldValue, touched, values },
	} = props;
	const [dialogShopCreate, setDialogShopCreate] = useState(false);
	const refDropdownInvoiceDate = useRef(null);
	const [dropdownInvoiceDate, setDropdownInvoiceDate] = useState(false);
	const [shopTempName, setShopTempName] = useState('');

	const labelStyle = { width: 150 };

	const onOpenDialogShopCreate = () => setDialogShopCreate(true);

	const onCloseDialogShopCreate = () => setDialogShopCreate(false);

	const onHandleDropdownInvoiceDate = value =>
		setDropdownInvoiceDate(value === null || value === undefined ? prevValue => !prevValue : value);

	const onChangeInvoiceDate = date => {
		setFieldValue('invoiceDate', date);
		onHandleDropdownInvoiceDate(false);
	};

	const sellingPositionCount = !formEditable ? values.receipts.reduce((sum, receipt) => sum + (!receipt.position.isFree ? 1 : 0), 0) : 0;

	return (
		<Form>
			<DialogContent style={{ overflow: 'initial' }}>
				{!formEditable && sellingPositionCount ? (
					<div className={ClassNames(styles.headerInfo, styles.headerInfoBlueGrey)}>
						<Grid justify="center" alignItems="center" container>
							<FontAwesomeIcon
								className={styles.headerInfoIcon}
								icon={['fad', 'exclamation-circle']}
								style={{ '--fa-primary-opacity': 0.9, '--fa-secondary-opacity': 0.2 }}
							/>
							<Typography className={styles.headerInfoText} variant="body1">
								Для {declensionNumber(sellingPositionCount, ['позиции', 'позиций', 'позиций'], true)} рассчитана цена продажи.
								<br />
								При необходимости измените её вручную.
							</Typography>
						</Grid>
					</div>
				) : null}

				<ErrorMessage name="pricePositions">
					{message => (
						<div className={ClassNames(styles.headerInfo, styles.headerInfoRed)}>
							<Grid justify="center" alignItems="center" container>
								<FontAwesomeIcon
									className={styles.headerInfoIcon}
									icon={['fad', 'exclamation-circle']}
									style={{ '--fa-primary-opacity': 0.9, '--fa-secondary-opacity': 0.2 }}
								/>
								<Typography className={styles.headerInfoText} variant="body1">
									{message}
								</Typography>
							</Grid>
						</div>
					)}
				</ErrorMessage>

				<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" container>
					<InputLabel style={labelStyle} error={Boolean(touched.shop && errors.shop)} data-inline>
						Магазин
					</InputLabel>
					<Grid alignItems="flex-start" spacing={2} container>
						<Grid style={{ flex: '1 1', zIndex: 2 }} item>
							<SelectAutocomplete
								name="shop"
								TextFieldProps={{
									error: Boolean(touched.shop && errors.shop),
								}}
								isDisabled={isSubmitting || !formEditable || values.status === 'expected'}
								isLoading={isLoadingShops}
								value={values.shop}
								inputValue={shopTempName}
								onChange={shop => {
									setFieldValue('shop', shop);

									setShopTempName('');
								}}
								onInputChange={(value, { action }) => {
									if (action !== 'input-blur' && action !== 'menu-close') {
										setShopTempName(value);
									}
								}}
								onKeyDown={event => {
									if (event.keyCode === 13 && !setShopTempName) return event.preventDefault();
								}}
								getOptionValue={option => option._id}
								getOptionLabel={option => option.name}
								menuPlacement="auto"
								menuPosition="fixed"
								placeholder="Выберите"
								noOptionsMessage={() =>
									shops.length === 0 ? 'Нет магазинов для выбора. Создайте магазин' : 'Среди магазинов совпадений не найдено.'
								}
								options={shops}
								isClearable
								autoFocus={values.status !== 'expected'}
							/>
							{touched.shop && errors.shop ? <FormHelperText error>{errors.shop}</FormHelperText> : null}
						</Grid>
						<Grid style={{ visibility: !formEditable || values.status === 'expected' ? 'hidden' : 'visible' }} item>
							<Button onClick={onOpenDialogShopCreate} variant="outlined" color="primary" tabIndex={-1}>
								Новый магазин
							</Button>
						</Grid>
					</Grid>
				</Grid>

				<Grid style={{ marginBottom: formEditable ? 10 : 20 }} wrap="nowrap" alignItems="flex-start" container>
					<InputLabel
						error={Boolean(errors.invoiceNumber && touched.invoiceNumber) || Boolean(errors.invoiceDate && touched.invoiceDate)}
						style={labelStyle}
						data-inline
					>
						Чек/накладная
					</InputLabel>
					<Grid direction="column" container>
						<Collapse in={!values.noInvoice} timeout="auto">
							<Grid wrap="nowrap" alignItems="flex-start" spacing={2} container>
								<Grid style={{ width: 186 }} item>
									<Field
										name="invoiceNumber"
										placeholder="Номер"
										error={Boolean(errors.invoiceNumber && touched.invoiceNumber)}
										helperText={typeof errors.invoiceNumber === 'string' && touched.invoiceNumber ? errors.invoiceNumber : null}
										as={TextField}
										disabled={isSubmitting || !formEditable}
										// autoFocus={values.status === 'expected'}
										fullWidth
									/>
								</Grid>
								<Grid style={{ width: 130 }} item>
									<Grid alignItems="baseline" container>
										<InputLabel style={{ marginLeft: -8, marginRight: 8 }} data-inline>
											от
										</InputLabel>
										<Grid style={{ flex: '1 1' }} item>
											<TextField
												innerRef={refDropdownInvoiceDate}
												name="invoiceDate"
												placeholder="Дата"
												error={Boolean(errors.invoiceDate && touched.invoiceDate)}
												helperText={typeof errors.invoiceDate === 'string' && touched.invoiceDate ? errors.invoiceDate : null}
												disabled={isSubmitting || !formEditable}
												value={values.invoiceDate ? moment(values.invoiceDate).format('DD.MM.YYYY') : ''}
												onFocus={() => {
													setTimeout(() => onHandleDropdownInvoiceDate(true), 100);
												}}
												fullWidth
											/>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Collapse>
						{formEditable ? (
							<Grid item>
								<Field
									type="checkbox"
									name="noInvoice"
									Label={{ label: 'Чек/накладная отсутствует' }}
									as={CheckboxWithLabel}
									onChange={({ target: { checked } }) => {
										setFieldValue('noInvoice', checked);

										if (checked && values.invoiceNumber) setFieldValue('invoiceNumber', '');
										if (checked && values.invoiceDate) setFieldValue('invoiceDate', '');
									}}
									disabled={isSubmitting || !formEditable}
								/>
							</Grid>
						) : null}
					</Grid>
				</Grid>

				<Grid style={{ marginBottom: formEditable ? 10 : 20 }} wrap="nowrap" alignItems="flex-start" container>
					<InputLabel error={Boolean(errors.pricePositions && touched.pricePositions)} style={{ marginTop: 32, ...labelStyle }} data-inline>
						Итого
					</InputLabel>
					<Grid direction="column" container>
						<Grid wrap="nowrap" alignItems="flex-start" spacing={2} container>
							<Grid style={{ width: 158 }} item>
								<Field
									name="pricePositions"
									placeholder="0"
									label="Стоимость позиций"
									error={Boolean(errors.pricePositions && touched.pricePositions)}
									helperText={typeof errors.pricePositions === 'string' && touched.pricePositions ? errors.pricePositions : null}
									as={TextField}
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
							<Grid style={{ width: 158 }} item>
								<Field
									name="costDelivery"
									placeholder="0"
									label="Стоимость доставки"
									as={TextField}
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
						</Grid>
						{formEditable ? (
							<Grid style={{ paddingLeft: 158 }} alignItems="center" container>
								<Field
									type="checkbox"
									name="compensateCostDelivery"
									Label={{ label: 'Компенсировать' }}
									as={CheckboxWithLabel}
									disabled={isSubmitting || !formEditable}
								/>
								<Tooltip
									title={
										<div style={{ maxWidth: 200 }}>
											При наличии в закупке платных позиций, стоимость доставки будет включена в цену продажи этих позиций.
										</div>
									}
									placement="bottom"
								>
									<div className={styles.helpIcon}>
										<FontAwesomeIcon icon={['fal', 'question-circle']} fixedWidth />
									</div>
								</Tooltip>
							</Grid>
						) : null}
					</Grid>
				</Grid>

				<FieldArray name="receipts" validateOnChange={false}>
					{arrayHelpers => (
						<Receipts
							dialogRef={dialogRef}
							receiptInitialValues={receiptInitialValues}
							positions={positions}
							formEditable={formEditable}
							arrayHelpers={arrayHelpers}
							formikProps={props.formikProps}
						/>
					)}
				</FieldArray>
			</DialogContent>
			<DialogActions>
				<Grid spacing={2} container>
					{!formEditable ? (
						<Grid xs={4} item>
							<Button onClick={() => onHandleEditFormProcurement(true)} variant="outlined" size="large" fullWidth>
								Изменить закупку
							</Button>
						</Grid>
					) : null}
					<Grid xs={!formEditable ? 8 : 12} item>
						<Button
							type={formEditable ? 'submit' : 'button'}
							onClick={formEditable ? () => {} : submitForm}
							disabled={isSubmitting}
							variant="contained"
							color="primary"
							size="large"
							fullWidth
						>
							{isSubmitting ? <CircularProgress size={20} style={{ position: 'absolute' }} /> : null}
							<span className="loading-button-label" style={{ opacity: Number(!isSubmitting) }}>
								{!formEditable ? 'Занести на склад' : 'Проверить данные'}
							</span>
						</Button>
					</Grid>
				</Grid>
			</DialogActions>

			<DialogShopCreate
				type="create"
				dialogOpen={dialogShopCreate}
				onCloseDialog={onCloseDialogShopCreate}
				onCallback={response => {
					if (response.status === 'success') {
						const { data: shop } = response;

						setFieldValue('shop', shop);

						setShopTempName('');
					}
				}}
			/>

			<Dropdown
				anchor={refDropdownInvoiceDate}
				open={dropdownInvoiceDate}
				onClose={() => onHandleDropdownInvoiceDate(false)}
				placement="bottom"
			>
				<LocalizationProvider dateAdapter={MomentUtils}>
					<StaticDatePicker
						views={['date']}
						displayStaticWrapperAs="desktop"
						reduceAnimations
						value={values.invoiceDate}
						onChange={onChangeInvoiceDate}
						leftArrowButtonProps={{
							size: 'small',
						}}
						leftArrowIcon={<FontAwesomeIcon icon={['far', 'angle-left']} />}
						rightArrowButtonProps={{
							size: 'small',
						}}
						rightArrowIcon={<FontAwesomeIcon icon={['far', 'angle-right']} />}
						disableFuture
						allowKeyboardControl={false}
					/>
				</LocalizationProvider>
			</Dropdown>
		</Form>
	);
};

export default ProcurementForm;
