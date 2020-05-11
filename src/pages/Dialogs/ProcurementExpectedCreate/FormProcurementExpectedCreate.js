import React, { useRef, useState } from 'react';
import { Form, Field, FieldArray } from 'formik';
import moment from 'moment';
import loadable from '@loadable/component';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import MomentUtils from '@material-ui/pickers/adapter/moment';
import { StaticDatePicker, LocalizationProvider } from '@material-ui/pickers';

import MenuItem from 'src/components/MenuItem';
import { SelectAutocomplete } from 'src/components/selectAutocomplete';
import NumberFormat, { moneyInputFormatProps } from 'src/components/NumberFormat';
import Dropdown from 'src/components/Dropdown';

import FormFieldArrayPositions from './FormFieldArrayPositions';
import { times } from './utils';

import stylesGlobal from 'src/styles/globals.module.css';

const DialogShopCreate = loadable(() => import('src/pages/Dialogs/ShopCreateEdit' /* webpackChunkName: "Dialog_ShopCreateEdit" */));

const FormProcurementExpectedCreate = props => {
	const {
		onCloseDialog,
		dialogRef,
		shops: {
			data: shops,
			isFetching: isLoadingShops,
			// error: errorShops
		},
		positions,
		formikProps: { errors, isSubmitting, setFieldValue, touched, values },
	} = props;
	const [dialogShopCreate, setDialogShopCreate] = useState(false);
	const refDropdownDeliveryDate = useRef(null);
	const [dropdownDeliveryDate, setDropdownDeliveryDate] = useState(false);
	const [shopTempName, setShopTempName] = useState('');

	const labelStyle = { width: 150 };

	const onOpenDialogShopCreate = () => setDialogShopCreate(true);

	const onCloseDialogShopCreate = () => setDialogShopCreate(false);

	const onHandleDropdownDeliveryDate = value =>
		setDropdownDeliveryDate(!value === null || value === undefined ? !dropdownDeliveryDate : value);

	const onChangeDeliveryDate = date => {
		setFieldValue('deliveryDate', date);
		onHandleDropdownDeliveryDate(false);
	};

	return (
		<Form>
			<DialogContent style={{ overflow: 'initial' }}>
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
								isDisabled={isSubmitting}
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
								autoFocus
							/>
							{touched.shop && errors.shop ? <FormHelperText error>{errors.shop}</FormHelperText> : null}
						</Grid>
						<Grid item>
							<Button onClick={onOpenDialogShopCreate} variant="outlined" color="primary" tabIndex={-1}>
								Новый магазин
							</Button>
						</Grid>
					</Grid>
				</Grid>

				<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" container>
					<InputLabel
						error={Boolean(errors.invoiceNumber && touched.invoiceNumber) || Boolean(errors.deliveryDate && touched.deliveryDate)}
						style={labelStyle}
						data-inline
					>
						Дата доставки
					</InputLabel>
					<Grid wrap="nowrap" alignItems="flex-start" spacing={2} container>
						<Grid style={{ width: 116 }} item>
							<TextField
								innerRef={refDropdownDeliveryDate}
								name="deliveryDate"
								placeholder={values.noInvoice ? '-' : 'Дата'}
								error={Boolean(errors.deliveryDate && touched.deliveryDate)}
								helperText={typeof errors.deliveryDate === 'string' && touched.deliveryDate ? errors.deliveryDate : null}
								disabled={isSubmitting}
								value={values.deliveryDate ? moment(values.deliveryDate).format('DD.MM.YYYY') : ''}
								onFocus={() => {
									setTimeout(() => {
										onHandleDropdownDeliveryDate(true);
									}, 100);
								}}
								fullWidth
							/>
						</Grid>
						<Grid style={{ width: 95 }} item>
							<Grid alignItems="baseline" container>
								<InputLabel style={{ marginLeft: -8, marginRight: 8 }} data-inline>
									c
								</InputLabel>
								<Grid style={{ flex: '1 1' }} item>
									<Field
										name="deliveryTimeFrom"
										as={Select}
										error={Boolean(touched.deliveryTimeFrom && errors.deliveryTimeFrom)}
										onChange={({ target: { value } }) => {
											setFieldValue('deliveryTimeFrom', value);

											if (moment(value).isAfter(values.deliveryTimeTo)) {
												setFieldValue('deliveryTimeTo', value);
											}
										}}
										renderValue={value => {
											if (!value) return '';
											else return moment(value).format('HH:mm');
										}}
										fullWidth
									>
										{times.map((time, index) => {
											const date = moment(new Date()).set({
												hour: time.hour,
												minute: time.minute,
												second: 0,
											});

											return (
												<MenuItem key={index} value={date.format()}>
													{date.format('HH:mm')}
												</MenuItem>
											);
										})}
									</Field>
								</Grid>
							</Grid>
						</Grid>
						<Grid style={{ width: 105 }} item>
							<Grid alignItems="baseline" container>
								<InputLabel style={{ marginLeft: -8, marginRight: 8 }} data-inline>
									до
								</InputLabel>
								<Grid style={{ flex: '1 1' }} item>
									<Field
										name="deliveryTimeTo"
										as={Select}
										error={Boolean(touched.deliveryTimeFrom && errors.deliveryTimeFrom)}
										renderValue={value => {
											if (!value) return '';
											else return moment(value).format('HH:mm');
										}}
										fullWidth
									>
										{times.map((time, index) => {
											const date = moment(new Date()).set({
												hour: time.hour,
												minute: time.minute,
												second: 0,
											});

											return (
												<MenuItem key={index} value={date.format()} hidden={date.isSameOrBefore(values.deliveryTimeFrom)}>
													{date.format('HH:mm')}
												</MenuItem>
											);
										})}
									</Field>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Grid>

				<Grid style={{ marginBottom: 10 }} wrap="nowrap" alignItems="flex-start" container>
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
									disabled={isSubmitting}
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
									disabled={isSubmitting}
									fullWidth
								/>
							</Grid>
						</Grid>
					</Grid>
				</Grid>

				<FieldArray name="positions" validateOnChange={false}>
					{props => (
						<FormFieldArrayPositions
							dialogRef={dialogRef}
							positions={positions}
							arrayHelpers={props}
							formikProps={{ errors, isSubmitting, setFieldValue, touched, values }}
						/>
					)}
				</FieldArray>
			</DialogContent>
			<DialogActions>
				<Grid spacing={2} container>
					<Grid xs={4} item>
						<Button onClick={onCloseDialog} variant="outlined" size="large" fullWidth>
							Отмена
						</Button>
					</Grid>
					<Grid xs={8} item>
						<Button type="submit" disabled={isSubmitting} variant="contained" color="primary" size="large" fullWidth>
							{isSubmitting ? <CircularProgress size={20} style={{ position: 'absolute' }} /> : null}
							<span className="loading-button-label" style={{ opacity: Number(!isSubmitting) }}>
								Создать заказ
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
				anchor={refDropdownDeliveryDate}
				open={dropdownDeliveryDate}
				onClose={() => onHandleDropdownDeliveryDate(false)}
				placement="bottom"
				disablePortal={false}
			>
				<LocalizationProvider dateAdapter={MomentUtils}>
					<StaticDatePicker
						views={['date']}
						displayStaticWrapperAs="desktop"
						reduceAnimations
						value={values.deliveryDate}
						onChange={onChangeDeliveryDate}
						leftArrowButtonProps={{
							size: 'small',
						}}
						leftArrowIcon={<FontAwesomeIcon icon={['far', 'angle-left']} />}
						rightArrowButtonProps={{
							size: 'small',
						}}
						rightArrowIcon={<FontAwesomeIcon icon={['far', 'angle-right']} />}
						disablePast
						allowKeyboardControl={false}
					/>
				</LocalizationProvider>
			</Dropdown>
		</Form>
	);
};

export default FormProcurementExpectedCreate;
