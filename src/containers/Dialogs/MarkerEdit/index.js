import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Formik, Form, Field, FieldArray } from 'formik';
import { TextField, CheckboxWithLabel } from 'formik-material-ui';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';

import translitRu from 'shared/translit/ru';
import { characteristicTypeTransform, unitTypeTransform } from 'shared/checkProductAndMarkers';

import {
	compareByName,
	onAddCharacteristicInMarker,
	checkCharacteristicsOnAbsenceInMarker,
	onUnitSellingPriceCalc,
} from 'src/helpers/productAndMarkersUtils';

import { PDDialog, PDDialogTitle, PDDialogActions } from 'src/components/Dialog';
import { SelectAutocompleteCreate } from 'src/components/selectAutocomplete';
import { CustomSelectField } from 'src/components/CustomSelectField';
import Chips from 'src/components/Chips';

import { markerSchema } from 'src/containers/Dialogs/ProductAndMarkersCreate/components/FormScheme';

import { getStockStatus } from 'src/actions/stocks';
import { createCharacteristic } from 'src/actions/characteristics';
import { editMarker } from 'src/actions/markers';
import MuiTextField from '@material-ui/core/TextField/TextField';

class DialogMarkerEdit extends Component {
	static propTypes = {
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		currentStock: PropTypes.object.isRequired,
		selectedProduct: PropTypes.object,
		selectedMarker: PropTypes.object,
	};

	state = {
		isLoadingMainCharacteristic: false,
		isLoadingCharacteristics: false,
	};

	onCreateMainCharacteristic = (values, setFieldValue) => {
		this.setState({ isLoadingMainCharacteristic: true }, () => {
			this.props.createCharacteristic(values).then(response => {
				const mainCharacteristic = response.data;

				this.setState({ isLoadingMainCharacteristic: false });

				setFieldValue('mainCharacteristic', mainCharacteristic);
			});
		});
	};

	onCreateCharacteristic = (values, setFieldValue) => {
		this.setState({ isLoadingCharacteristics: true }, () => {
			this.props.createCharacteristic(values).then(response => {
				const characteristic = response.data;

				this.setState({ isLoadingCharacteristics: false });

				setFieldValue('characteristicTemp.value', characteristic);
			});
		});
	};

	onMarkerEdit = (values, actions) => {
		const { onCloseDialog, selectedProduct, marker = markerSchema(this.props.selectedProduct).cast(values) } = this.props;

		this.props.editMarker(selectedProduct._id, marker._id, marker).then(response => {
			if (response.status === 'success') {
				this.props.getStockStatus();
				onCloseDialog();
			} else actions.setSubmitting(false);
		});
	};

	render() {
		const { dialogOpen, onCloseDialog, currentStock, characteristics, selectedProduct, selectedMarker } = this.props;
		const { isLoadingMainCharacteristic, isLoadingCharacteristics } = this.state;

		if (!selectedProduct || !selectedMarker) return null;

		let initialValues = {
			mainCharacteristicTemp: {
				type: selectedMarker.mainCharacteristic.type,
				value: '',
			},
			quantity: '',
			quantityPackages: '',
			quantityInUnit: '',
			minimumBalance: '',
			sellingPrice: '',
			unitSellingPrice: '',
			characteristicTemp: {
				type: '',
				valueTemp: '',
				value: '',
			},
			...selectedMarker,
		};

		return (
			<PDDialog open={dialogOpen} onClose={onCloseDialog} onExited={this.onExitedDialog} maxWidth="lg" scroll="body" stickyActions>
				<PDDialogTitle theme="primary" onClose={onCloseDialog} children="Редактирование позиции" />
				<Formik
					initialValues={initialValues}
					validationSchema={() => markerSchema(selectedProduct)}
					validateOnBlur={false}
					validateOnChange={false}
					onSubmit={(values, actions) => this.onMarkerEdit(values, actions)}
					render={({ errors, isSubmitting, values, setFieldValue }) => (
						<Form>
							<DialogContent>
								<Grid className="pd-rowGridFormLabelControl" wrap="nowrap" alignItems="flex-start" spacing={2} container>
									<Grid className="pd-rowGridFormLabelControl" xs={6} style={{ marginBottom: 0 }} item>
										<InputLabel
											error={(errors.mainCharacteristicTemp && errors.mainCharacteristicTemp.type) || errors.mainCharacteristic}
											style={{ display: 'inline-flex', minWidth: 120 }}
										>
											Наименование:
										</InputLabel>
										<FormControl style={{ width: 'calc(100% - 130px)' }}>
											<CustomSelectField
												name="mainCharacteristicTemp.type"
												inputProps={{
													onChange: ({ target: { value } }) => {
														if (values.mainCharacteristic && values.mainCharacteristicTemp.type !== value)
															setFieldValue('mainCharacteristic', '');

														if (!values.mainCharacteristicTemp.type || values.mainCharacteristicTemp.type !== value) {
															setFieldValue('mainCharacteristicTemp', {
																type: value,
																value: '',
															});
														}

														if (values.characteristicTemp.type === value) {
															setFieldValue('characteristicTemp', {
																type: '',
																value: '',
																valueTemp: '',
															});
														}
													},
												}}
												error={errors.mainCharacteristicTemp && errors.mainCharacteristicTemp.type}
												displayEmpty
											>
												<MenuItem value="" disabled>
													Выберите
												</MenuItem>
												{checkCharacteristicsOnAbsenceInMarker(values, true).map((characteristicType, index) => (
													<MenuItem key={index} value={characteristicType}>
														{characteristicTypeTransform(characteristicType)}
													</MenuItem>
												))}
											</CustomSelectField>
											{errors.mainCharacteristicTemp && errors.mainCharacteristicTemp.type ? (
												<FormHelperText error>{errors.mainCharacteristicTemp.type}</FormHelperText>
											) : null}
										</FormControl>
									</Grid>

									<Grid xs={6} item>
										<FormControl fullWidth>
											<Field
												name="mainCharacteristic"
												component={SelectAutocompleteCreate}
												TextFieldProps={{
													error: errors.mainCharacteristic,
												}}
												isClearable
												isDisabled={isSubmitting || isLoadingMainCharacteristic || !values.mainCharacteristicTemp.type}
												isLoading={isLoadingMainCharacteristic}
												value={values.mainCharacteristic}
												inputValue={values.mainCharacteristicTemp.value}
												onChange={option => {
													setFieldValue('mainCharacteristic', option ? option : '');

													if (values.mainCharacteristicTemp.value) {
														setFieldValue('mainCharacteristicTemp.value', '');
													}
												}}
												onInputChange={(value, { action }) => {
													if (action !== 'input-blur' && action !== 'menu-close') {
														setFieldValue('mainCharacteristicTemp.value', value);

														if (values.mainCharacteristic) {
															setFieldValue('mainCharacteristic', '');
														}
													}
												}}
												onCreateOption={value =>
													this.onCreateMainCharacteristic(
														{
															stock: currentStock._id,
															type: values.mainCharacteristicTemp.type,
															value: translitRu(value),
															label: value,
														},
														setFieldValue
													)
												}
												menuPlacement="auto"
												menuPosition="fixed"
												placeholder="Выберите или создайте"
												noOptionsMessage={() => 'Не создано ни одного значения, введите текст, чтобы создать'}
												formatCreateLabel={value => `Нажмите, чтобы создать «${value}»`}
												options={characteristics.filter(value => value.type === values.mainCharacteristicTemp.type)}
											/>
											{errors.mainCharacteristic ? <FormHelperText error>{errors.mainCharacteristic}</FormHelperText> : null}
										</FormControl>
									</Grid>
								</Grid>

								<Grid className="pd-rowGridFormLabelControl" style={{ marginBottom: 12 }} container spacing={2}>
									{selectedProduct.receiptUnits === 'pce' || selectedProduct.unitIssue !== 'pce' ? (
										<Grid xs={selectedProduct.dividedMarkers ? 6 : 12} item>
											<MuiTextField
												className="none-padding"
												name="quantity"
												label={`Количество ${
													selectedProduct.receiptUnits === 'nmp' && selectedProduct.unitIssue !== 'pce' ? 'упаковок' : 'штук'
												}:`}
												InputProps={{
													value: values.quantity,
													readOnly: true,
												}}
												fullWidth
											/>
										</Grid>
									) : (
										<Grid
											xs={
												selectedProduct.receiptUnits === 'nmp' && selectedProduct.unitIssue === 'pce'
													? selectedProduct.dividedMarkers
														? 4
														: 6
													: 6
											}
											item
										>
											<MuiTextField
												className="none-padding"
												name="quantityPackages"
												label="Количество упаковок:"
												InputProps={{
													value: values.quantityPackages,
													readOnly: true,
												}}
												fullWidth
											/>
										</Grid>
									)}

									{selectedProduct.receiptUnits === 'nmp' && selectedProduct.unitIssue === 'pce' ? (
										<Grid xs={selectedProduct.dividedMarkers ? 4 : 6} item>
											<Field
												name="quantityInUnit"
												type="number"
												label="Штук в упаковке:"
												placeholder="0"
												component={TextField}
												InputLabelProps={{
													shrink: true,
												}}
												inputProps={
													selectedProduct.receiptUnits === 'nmp' && selectedProduct.unitIssue === 'pce'
														? {
																onChange: ({ target: { value } }) =>
																	onUnitSellingPriceCalc(value, 'quantityInUnit', values, undefined, setFieldValue),
														  }
														: {}
												}
												autoComplete="off"
												fullWidth
											/>
										</Grid>
									) : null}

									{selectedProduct.dividedMarkers ? (
										<Grid xs={selectedProduct.receiptUnits === 'nmp' && selectedProduct.unitIssue === 'pce' ? 4 : 6} item>
											<Field
												name="minimumBalance"
												type="number"
												label={`Мин. остаток в ${
													selectedProduct.receiptUnits === 'nmp' && selectedProduct.unitIssue !== 'pce' ? 'упаковках' : 'штуках'
												}:`}
												placeholder="0"
												component={TextField}
												InputLabelProps={{
													shrink: true,
												}}
												autoComplete="off"
												fullWidth
											/>
										</Grid>
									) : null}
								</Grid>

								<Grid
									className="pd-rowGridFormLabelControl"
									alignItems={values.isFree ? (errors.purchasePrice && values.isFree ? 'center' : 'flex-end') : 'stretch'}
									spacing={2}
									style={{ marginBottom: 12 }}
									container
								>
									<Grid xs={6} item>
										<Field
											name="purchasePrice"
											type="number"
											label={`Цена закупки${
												selectedProduct.receiptUnits === 'nmp' && selectedProduct.unitIssue === 'pce' ? ' упаковки' : ''
											}:`}
											placeholder="0"
											component={TextField}
											InputLabelProps={{
												shrink: true,
											}}
											inputProps={
												selectedProduct.receiptUnits === 'nmp' && selectedProduct.unitIssue === 'pce'
													? {
															onChange: ({ target: { value } }) =>
																onUnitSellingPriceCalc(value, 'purchasePrice', values, undefined, setFieldValue),
													  }
													: {
															onChange: ({ target: { value } }) => {
																setFieldValue('purchasePrice', value);
																setFieldValue('sellingPrice', value);
															},
													  }
											}
											autoComplete="off"
											fullWidth
										/>
									</Grid>

									<Grid xs={6} item>
										{!values.isFree ? (
											selectedProduct.receiptUnits === 'nmp' && selectedProduct.unitIssue === 'pce' ? (
												<Field
													name="unitSellingPrice"
													type="number"
													label="Цена продажи штуки:"
													placeholder="0"
													component={TextField}
													InputLabelProps={{
														shrink: true,
													}}
													autoComplete="off"
													fullWidth
												/>
											) : (
												<Field
													name="sellingPrice"
													type="number"
													label="Цена продажи:"
													placeholder={String(values.purchasePrice || 0)}
													component={TextField}
													InputLabelProps={{
														shrink: true,
													}}
													autoComplete="off"
													fullWidth
												/>
											)
										) : null}

										<Field
											name="isFree"
											Label={{ label: 'Бесплатно' }}
											component={CheckboxWithLabel}
											color="primary"
											icon={<FontAwesomeIcon icon={['far', 'square']} />}
											checkedIcon={<FontAwesomeIcon icon={['fas', 'check-square']} />}
										/>
									</Grid>
								</Grid>

								<Grid className="pd-rowGridFormLabelControl" wrap="nowrap" alignItems="flex-start" container>
									<InputLabel error={errors.linkInShop} style={{ minWidth: 120 }}>
										Ссылка / Магазин:
									</InputLabel>
									<FormControl fullWidth>
										<Field
											name="linkInShop"
											component={TextField}
											placeholder="Ссылка на товар в интернет-магазине или название магазина"
											InputLabelProps={{
												shrink: true,
											}}
											autoComplete="off"
											fullWidth
										/>
									</FormControl>
								</Grid>

								<FieldArray
									name="characteristics"
									validateOnChange={false}
									render={arrayHelpersCharacteristics => (
										<Grid>
											{values.characteristics.length ? (
												<Grid
													className="pd-rowGridFormLabelControl"
													style={{ marginBottom: 11 }}
													wrap="nowrap"
													alignItems="flex-start"
													container
												>
													<InputLabel style={{ display: 'inline-flex', minWidth: 120 }}>
														Дополнительные
														<br />
														характеристики:
													</InputLabel>
													<Grid style={{ marginTop: 7, width: 'calc(100% - 120px)' }} container>
														<Chips
															chips={values.characteristics.sort(compareByName)}
															onRenderChipLabel={value => (
																<span>
																	<span style={{ fontWeight: 600 }}>{characteristicTypeTransform(value.type)}</span>: {value.label}
																</span>
															)}
															onRemoveChip={(chips, index) => arrayHelpersCharacteristics.remove(index)}
														/>
													</Grid>
												</Grid>
											) : null}

											{checkCharacteristicsOnAbsenceInMarker(values).length ? (
												<Grid className="pd-rowGridFormLabelControl" wrap="nowrap" alignItems="flex-start" spacing={2} container>
													<Grid className="pd-rowGridFormLabelControl" xs={6} style={{ marginBottom: 0 }} item>
														{!values.characteristics.length ? (
															<InputLabel style={{ display: 'inline-flex', minWidth: 120 }}>
																Дополнительные
																<br />
																характеристики:
															</InputLabel>
														) : (
															<InputLabel style={{ display: 'inline-flex', minWidth: 120 }} />
														)}
														<FormControl style={{ width: 'calc(100% - 130px)' }}>
															<CustomSelectField
																name="characteristicTemp.type"
																inputProps={{
																	onChange: ({ target: { value } }) => {
																		if (!values.characteristicTemp.type || values.characteristicTemp.type !== value) {
																			setFieldValue('characteristicTemp', {
																				type: value,
																				value: '',
																				valueTemp: '',
																			});
																		}
																	},
																}}
																displayEmpty
															>
																<MenuItem value="" disabled>
																	Выберите
																</MenuItem>
																{checkCharacteristicsOnAbsenceInMarker(values).map((characteristicType, index) => (
																	<MenuItem key={index} value={characteristicType}>
																		{characteristicTypeTransform(characteristicType)}
																	</MenuItem>
																))}
															</CustomSelectField>
														</FormControl>
													</Grid>

													<Grid xs={6} item>
														<FormControl style={{ width: 'calc(100% - 42px)' }}>
															<Field
																name={'characteristicTemp.value'}
																component={SelectAutocompleteCreate}
																isDisabled={isSubmitting || isLoadingCharacteristics || !values.characteristicTemp.type}
																isLoading={isLoadingCharacteristics}
																value={values.characteristicTemp.value}
																inputValue={values.characteristicTemp.valueTemp}
																onChange={option => {
																	setFieldValue('characteristicTemp.value', option ? option : '');

																	if (values.characteristicTemp.valueTemp) {
																		setFieldValue('characteristicTemp.valueTemp', '');
																	}
																}}
																onInputChange={(value, { action }) => {
																	if (action !== 'input-blur' && action !== 'menu-close') {
																		setFieldValue('characteristicTemp.valueTemp', value);

																		if (values.characteristicTemp.value) {
																			setFieldValue('characteristicTemp.value', '');
																		}
																	}
																}}
																onCreateOption={value =>
																	this.onCreateCharacteristic(
																		{
																			stock: currentStock._id,
																			type: values.characteristicTemp.type,
																			value: translitRu(value),
																			label: value,
																		},
																		setFieldValue
																	)
																}
																menuPlacement="top"
																menuPosition="fixed"
																placeholder="Выберите или создайте"
																noOptionsMessage={() => 'Не создано ни одного значения, введите текст, чтобы создать'}
																formatCreateLabel={value => `Нажмите, чтобы создать «${value}»`}
																options={characteristics.filter(value => value.type === values.characteristicTemp.type)}
															/>
														</FormControl>
														<IconButton
															className="D-pam-create__add-characteristic"
															aria-haspopup="true"
															size="small"
															onClick={() => onAddCharacteristicInMarker(values, undefined, setFieldValue, arrayHelpersCharacteristics)}
															disabled={values.characteristicTemp.type === '' || values.characteristicTemp.value === ''}
															disableRipple
															disableFocusRipple
														>
															<FontAwesomeIcon icon={['fal', 'check-circle']} />
														</IconButton>
													</Grid>
												</Grid>
											) : null}
										</Grid>
									)}
								/>
							</DialogContent>
							<PDDialogActions
								leftHandleProps={{
									handleProps: {
										onClick: () => onCloseDialog,
									},
									text: 'Отмена',
								}}
								rightHandleProps={{
									handleProps: {
										type: 'submit',
										disabled: isSubmitting,
									},
									text: isSubmitting ? <CircularProgress size={20} /> : 'Сохранить маркер',
								}}
							/>
						</Form>
					)}
				/>
			</PDDialog>
		);
	}
}

const mapStateToProps = state => {
	return {
		characteristics: state.characteristics.data,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStock } = ownProps;

	return {
		getStockStatus: () => dispatch(getStockStatus(currentStock._id)),
		createCharacteristic: values => dispatch(createCharacteristic(values)),
		editMarker: (productId, markerId, newValues) => dispatch(editMarker(productId, markerId, newValues)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DialogMarkerEdit);
