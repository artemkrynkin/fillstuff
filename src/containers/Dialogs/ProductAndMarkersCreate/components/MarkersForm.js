import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Formik, Form, Field, FastField, FieldArray } from 'formik';
import { TextField, CheckboxWithLabel } from 'formik-material-ui';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';

import translitRu from 'shared/translit/ru';
import { characteristicTypeTransform } from 'shared/checkProductAndMarkers';

import {
	compareByName,
	onAddCharacteristicInMarker,
	checkCharacteristicsOnAbsenceInMarker,
	onUnitSellingPriceCalc,
} from 'src/helpers/productAndMarkersUtils';

import { PDDialogTitle, PDDialogActions } from 'src/components/Dialog';
import { SelectAutocompleteCreate } from 'src/components/selectAutocomplete';
import { CustomSelectField } from 'src/components/CustomSelectField';
import Chips from 'src/components/Chips';

import { createCharacteristic } from 'src/actions/characteristics';

import { markersSchema } from './FormScheme';

const checkErrorsMarker = (errors, index, propName1, propName2) => {
	if (!propName2) return Boolean(errors.markers && errors.markers[index] && errors.markers[index][propName1]);
	else
		return Boolean(
			errors.markers && errors.markers[index] && errors.markers[index][propName1] && errors.markers[index][propName1][propName2]
		);
};

class MarkersForm extends Component {
	static propTypes = {
		saveProduct: PropTypes.object.isRequired,
		saveMarkers: PropTypes.object,
		onPrevStep: PropTypes.func.isRequired,
		onSubmit: PropTypes.func.isRequired,
	};

	state = {
		isLoadingMainCharacteristic: false,
		isLoadingCharacteristics: false,
	};

	onCreateMainCharacteristic = (values, index, setFieldValue) => {
		this.setState({ isLoadingMainCharacteristic: true }, () => {
			this.props.createCharacteristic(values).then(response => {
				const mainCharacteristic = response.data;

				this.setState({ isLoadingMainCharacteristic: false });

				setFieldValue(`markers.${index}.mainCharacteristic`, mainCharacteristic);
			});
		});
	};

	onCreateCharacteristic = (values, index, setFieldValue) => {
		this.setState({ isLoadingCharacteristics: true }, () => {
			this.props.createCharacteristic(values).then(response => {
				const characteristic = response.data;

				this.setState({ isLoadingCharacteristics: false });

				setFieldValue(`markers.${index}.characteristicTemp.value`, characteristic);
			});
		});
	};

	render() {
		const { onCloseDialog, currentStock, saveProduct, characteristics, saveMarkers, onPrevStep, onSubmit } = this.props;
		const { isLoadingMainCharacteristic, isLoadingCharacteristics } = this.state;

		const initialValuesMarker = {
			mainCharacteristic: '',
			mainCharacteristicTemp: {
				type: '',
				value: '',
			},
			quantity: '',
			quantityPackages: '',
			quantityInUnit: '',
			minimumBalance: '',
			purchasePrice: '',
			sellingPrice: '',
			unitSellingPrice: '',
			isFree: false,
			linkInShop: '',
			characteristics: [],
			characteristicTemp: {
				type: '',
				value: '',
				valueTemp: '',
			},
		};

		const initialValues = saveMarkers || {
			markers: [initialValuesMarker],
		};

		return (
			<Formik
				initialValues={initialValues}
				validationSchema={() => markersSchema(saveProduct)}
				validateOnBlur={false}
				validateOnChange={false}
				onSubmit={(values, actions) => onSubmit(values, actions)}
				render={({ errors, isSubmitting, values, setFieldValue }) => (
					<Form>
						<PDDialogTitle
							theme="primary"
							leftHandleProps={{
								handleProps: {
									onClick: () => onPrevStep(values),
								},
								text: 'Назад',
								icon: <FontAwesomeIcon icon={['far', 'angle-left']} />,
								iconPositionLeft: true,
							}}
							titlePositionCenter
							onClose={onCloseDialog}
						>
							Добавление маркера
						</PDDialogTitle>
						<FieldArray
							name="markers"
							validateOnChange={false}
							render={arrayHelpers => (
								<DialogContent>
									{values.markers.map((marker, index) => (
										<Grid key={index}>
											{values.markers.length > 1 && index !== 0 ? (
												<Grid style={{ marginBottom: 10 }} container>
													<IconButton
														className="D-pam-create__marker-remove"
														aria-haspopup="true"
														size="small"
														onClick={() => arrayHelpers.remove(index)}
													>
														<FontAwesomeIcon icon={['fal', 'times']} />
													</IconButton>
												</Grid>
											) : null}

											<Grid className="pd-rowGridFormLabelControl" wrap="nowrap" alignItems="flex-start" spacing={2} container>
												<Grid className="pd-rowGridFormLabelControl" xs={6} style={{ marginBottom: 0 }} item>
													<InputLabel
														error={
															checkErrorsMarker(errors, index, 'mainCharacteristicTemp', 'type') ||
															checkErrorsMarker(errors, index, 'mainCharacteristic')
														}
														style={{ display: 'inline-flex', minWidth: 120 }}
													>
														Наименование:
													</InputLabel>
													<FormControl style={{ width: 'calc(100% - 130px)' }}>
														<CustomSelectField
															name={`markers.${index}.mainCharacteristicTemp.type`}
															inputProps={{
																onChange: ({ target: { value } }) => {
																	if (marker.mainCharacteristic && marker.mainCharacteristicTemp.type !== value)
																		setFieldValue(`markers.${index}.mainCharacteristic`, '');

																	if (!marker.mainCharacteristicTemp.type || marker.mainCharacteristicTemp.type !== value) {
																		setFieldValue(`markers.${index}.mainCharacteristicTemp`, {
																			type: value,
																			value: '',
																		});
																	}

																	if (marker.characteristicTemp.type === value) {
																		setFieldValue(`markers.${index}.characteristicTemp`, {
																			type: '',
																			value: '',
																			valueTemp: '',
																		});
																	}
																},
															}}
															error={checkErrorsMarker(errors, index, 'mainCharacteristicTemp', 'type')}
															displayEmpty
														>
															<MenuItem value="" disabled>
																Выберите
															</MenuItem>
															{checkCharacteristicsOnAbsenceInMarker(marker, true).map((characteristicType, index) => (
																<MenuItem key={index} value={characteristicType}>
																	{characteristicTypeTransform(characteristicType)}
																</MenuItem>
															))}
														</CustomSelectField>
														{checkErrorsMarker(errors, index, 'mainCharacteristicTemp', 'type') ? (
															<FormHelperText error>{errors.markers[index].mainCharacteristicTemp.type}</FormHelperText>
														) : null}
													</FormControl>
												</Grid>

												<Grid xs={6} item>
													<FormControl fullWidth>
														<Field
															name={`markers.${index}.mainCharacteristic`}
															component={SelectAutocompleteCreate}
															TextFieldProps={{
																error: checkErrorsMarker(errors, index, 'mainCharacteristic'),
															}}
															isClearable
															isDisabled={isSubmitting || isLoadingMainCharacteristic || !marker.mainCharacteristicTemp.type}
															isLoading={isLoadingMainCharacteristic}
															value={marker.mainCharacteristic}
															inputValue={marker.mainCharacteristicTemp.value}
															onChange={option => {
																setFieldValue(`markers.${index}.mainCharacteristic`, option ? option : '');

																if (marker.mainCharacteristicTemp.value) {
																	setFieldValue(`markers.${index}.mainCharacteristicTemp.value`, '');
																}
															}}
															onInputChange={(value, { action }) => {
																if (action !== 'input-blur' && action !== 'menu-close') {
																	setFieldValue(`markers.${index}.mainCharacteristicTemp.value`, value);

																	if (marker.mainCharacteristic) {
																		setFieldValue(`markers.${index}.mainCharacteristic`, '');
																	}
																}
															}}
															onCreateOption={value =>
																this.onCreateMainCharacteristic(
																	{
																		stock: currentStock._id,
																		type: marker.mainCharacteristicTemp.type,
																		value: translitRu(value),
																		label: value,
																	},
																	index,
																	setFieldValue
																)
															}
															menuPlacement="auto"
															menuPosition="fixed"
															placeholder="Выберите или создайте"
															noOptionsMessage={() => 'Не создано ни одного значения, введите текст, чтобы создать'}
															formatCreateLabel={value => `Нажмите, чтобы создать «${value}»`}
															options={characteristics.filter(value => value.type === marker.mainCharacteristicTemp.type)}
														/>
														{checkErrorsMarker(errors, index, 'mainCharacteristic') ? (
															<FormHelperText error>{errors.markers[index].mainCharacteristic}</FormHelperText>
														) : null}
													</FormControl>
												</Grid>
											</Grid>

											<Grid className="pd-rowGridFormLabelControl" style={{ marginBottom: 12 }} container spacing={2}>
												{saveProduct.receiptUnits === 'pce' || saveProduct.unitIssue !== 'pce' ? (
													<Grid xs={saveProduct.dividedMarkers ? 6 : 12} item>
														<FastField
															name={`markers.${index}.quantity`}
															type="number"
															label={`Количество ${
																saveProduct.receiptUnits === 'nmp' && saveProduct.unitIssue !== 'pce' ? 'упаковок' : 'штук'
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
												) : (
													<Grid
														xs={
															saveProduct.receiptUnits === 'nmp' && saveProduct.unitIssue === 'pce'
																? saveProduct.dividedMarkers
																	? 4
																	: 6
																: 6
														}
														item
													>
														<FastField
															name={`markers.${index}.quantityPackages`}
															type="number"
															label="Количество упаковок:"
															placeholder="0"
															component={TextField}
															InputLabelProps={{
																shrink: true,
															}}
															autoComplete="off"
															fullWidth
														/>
													</Grid>
												)}

												{saveProduct.receiptUnits === 'nmp' && saveProduct.unitIssue === 'pce' ? (
													<Grid xs={saveProduct.dividedMarkers ? 4 : 6} item>
														<Field
															name={`markers.${index}.quantityInUnit`}
															type="number"
															label="Штук в упаковке:"
															placeholder="0"
															component={TextField}
															InputLabelProps={{
																shrink: true,
															}}
															inputProps={
																saveProduct.receiptUnits === 'nmp' && saveProduct.unitIssue === 'pce'
																	? {
																			onChange: ({ target: { value } }) =>
																				onUnitSellingPriceCalc(value, 'quantityInUnit', marker, index, setFieldValue),
																	  }
																	: {}
															}
															autoComplete="off"
															fullWidth
														/>
													</Grid>
												) : null}

												{saveProduct.dividedMarkers ? (
													<Grid xs={saveProduct.receiptUnits === 'nmp' && saveProduct.unitIssue === 'pce' ? 4 : 6} item>
														<FastField
															name={`markers.${index}.minimumBalance`}
															type="number"
															label={`Мин. остаток в ${
																saveProduct.receiptUnits === 'nmp' && saveProduct.unitIssue !== 'pce' ? 'упаковках' : 'штуках'
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
												alignItems={
													marker.isFree
														? checkErrorsMarker(errors, index, 'purchasePrice') && marker.isFree
															? 'center'
															: 'flex-end'
														: 'stretch'
												}
												spacing={2}
												style={{ marginBottom: 12 }}
												container
											>
												<Grid xs={6} item>
													<Field
														name={`markers.${index}.purchasePrice`}
														type="number"
														label={`Цена закупки${
															saveProduct.receiptUnits === 'nmp' && saveProduct.unitIssue === 'pce' ? ' упаковки' : ''
														}:`}
														placeholder="0"
														component={TextField}
														InputLabelProps={{
															shrink: true,
														}}
														inputProps={
															saveProduct.receiptUnits === 'nmp' && saveProduct.unitIssue === 'pce'
																? {
																		onChange: ({ target: { value } }) =>
																			onUnitSellingPriceCalc(value, 'purchasePrice', marker, index, setFieldValue),
																  }
																: {
																		onChange: ({ target: { value } }) => {
																			setFieldValue(`markers.${index}.purchasePrice`, value);
																			setFieldValue(`markers.${index}.sellingPrice`, value);
																		},
																  }
														}
														autoComplete="off"
														fullWidth
													/>
												</Grid>

												<Grid xs={6} item>
													{!marker.isFree ? (
														saveProduct.receiptUnits === 'nmp' && saveProduct.unitIssue === 'pce' ? (
															<FastField
																name={`markers.${index}.unitSellingPrice`}
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
															<FastField
																name={`markers.${index}.sellingPrice`}
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

													<FastField
														name={`markers.${index}.isFree`}
														Label={{ label: 'Бесплатно' }}
														component={CheckboxWithLabel}
														color="primary"
														icon={<FontAwesomeIcon icon={['far', 'square']} />}
														checkedIcon={<FontAwesomeIcon icon={['fas', 'check-square']} />}
													/>
												</Grid>
											</Grid>

											<Grid className="pd-rowGridFormLabelControl" wrap="nowrap" alignItems="flex-start" container>
												<InputLabel error={checkErrorsMarker(errors, index, 'linkInShop')} style={{ minWidth: 120 }}>
													Ссылка / Магазин:
												</InputLabel>
												<FormControl fullWidth>
													<FastField
														name={`markers.${index}.linkInShop`}
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
												name={`markers.${index}.characteristics`}
												validateOnChange={false}
												render={arrayHelpersCharacteristics => (
													<Grid>
														{marker.characteristics.length ? (
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
																		chips={marker.characteristics.sort(compareByName)}
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

														{checkCharacteristicsOnAbsenceInMarker(marker).length ? (
															<Grid className="pd-rowGridFormLabelControl" wrap="nowrap" alignItems="flex-start" spacing={2} container>
																<Grid className="pd-rowGridFormLabelControl" xs={6} style={{ marginBottom: 0 }} item>
																	{!marker.characteristics.length ? (
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
																			name={`markers.${index}.characteristicTemp.type`}
																			inputProps={{
																				onChange: ({ target: { value } }) => {
																					if (!marker.characteristicTemp.type || marker.characteristicTemp.type !== value) {
																						setFieldValue(`markers.${index}.characteristicTemp`, {
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
																			{checkCharacteristicsOnAbsenceInMarker(marker).map((characteristicType, index) => (
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
																			name={`markers.${index}.characteristicTemp.value`}
																			component={SelectAutocompleteCreate}
																			isClearable
																			isDisabled={isSubmitting || isLoadingCharacteristics || !marker.characteristicTemp.type}
																			isLoading={isLoadingCharacteristics}
																			value={marker.characteristicTemp.value}
																			inputValue={marker.characteristicTemp.valueTemp}
																			onChange={option => {
																				setFieldValue(`markers.${index}.characteristicTemp.value`, option);

																				if (marker.characteristicTemp.valueTemp) {
																					setFieldValue(`markers.${index}.characteristicTemp.valueTemp`, '');
																				}
																			}}
																			onInputChange={(value, { action }) => {
																				if (action !== 'input-blur' && action !== 'menu-close') {
																					setFieldValue(`markers.${index}.characteristicTemp.valueTemp`, value);

																					if (marker.characteristicTemp.value) {
																						setFieldValue(`markers.${index}.characteristicTemp.value`, '');
																					}
																				}
																			}}
																			onCreateOption={value =>
																				this.onCreateCharacteristic(
																					{
																						stock: currentStock._id,
																						type: marker.characteristicTemp.type,
																						value: translitRu(value),
																						label: value,
																					},
																					index,
																					setFieldValue
																				)
																			}
																			menuPlacement="auto"
																			menuPosition="fixed"
																			placeholder="Выберите или создайте"
																			noOptionsMessage={() => 'Не создано ни одного значения, введите текст, чтобы создать'}
																			formatCreateLabel={value => `Нажмите, чтобы создать «${value}»`}
																			options={characteristics.filter(value => value.type === marker.characteristicTemp.type)}
																		/>
																	</FormControl>
																	<IconButton
																		className="D-pam-create__add-characteristic"
																		aria-haspopup="true"
																		size="small"
																		onClick={() => onAddCharacteristicInMarker(marker, index, setFieldValue, arrayHelpersCharacteristics)}
																		disabled={marker.characteristicTemp.type === '' || marker.characteristicTemp.value === ''}
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

											{values.markers.length - 1 !== index ? <Divider style={{ margin: '20px 0 30px' }} /> : null}
										</Grid>
									))}

									{values.markers.length <= 5 ? (
										<Button
											className="D-pam-create__add-marker"
											variant="outlined"
											color="primary"
											onClick={() => arrayHelpers.push(initialValuesMarker)}
										>
											<FontAwesomeIcon icon={['fal', 'plus']} />
											Добавить маркер
										</Button>
									) : null}
								</DialogContent>
							)}
						/>
						<PDDialogActions
							leftHandleProps={null}
							rightHandleProps={{
								handleProps: {
									type: 'submit',
									disabled: isSubmitting,
								},
								text: isSubmitting ? <CircularProgress size={20} /> : 'Создать',
							}}
						/>
					</Form>
				)}
			/>
		);
	}
}

const mapStateToProps = state => {
	return {
		characteristics: state.characteristics.data,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		createCharacteristic: values => dispatch(createCharacteristic(values)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MarkersForm);
