import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Formik, Form, Field, FieldArray } from 'formik';
import { TextField, CheckboxWithLabel, Select } from 'formik-material-ui';

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
import Fade from '@material-ui/core/Fade';
import MenuItem from '@material-ui/core/MenuItem';

import translitRu from 'shared/translit/ru';
import { specifications, specificationTransform } from 'shared/productSpecifications';

import { PDDialogActions } from 'src/components/Dialog';
import { SelectAutocompleteCreate } from 'src/components/selectAutocomplete';
import Chips from 'src/components/Chips';

import { createManufacturer } from 'src/actions/manufacturers';
import { createSpecification } from 'src/actions/specifications';

import { markersSchema } from './FormScheme';

const checkArrayErrors = (arrayFieldName, index, fieldName) => {
	return (
		typeof arrayFieldName === 'object' &&
		typeof arrayFieldName[index] === 'object' &&
		typeof arrayFieldName[index][fieldName] === 'string'
	);
};

const compareName = (a, b) => {
	if (a.name > b.name) return 1;
	else if (a.name < b.name) return -1;
	else return 0;
};

class ProductMarkersForm extends Component {
	static propTypes = {
		initialValuesFrom: PropTypes.object,
		onPrevStep: PropTypes.func.isRequired,
		onSubmit: PropTypes.func.isRequired,
	};

	state = {
		isLoadingManufacturers: false,
		isLoadingSpecifications: false,
	};

	onCreateManufacturer = (values, index, setFieldValue) => {
		this.setState({ isLoadingManufacturers: true }, () => {
			this.props.createManufacturer(values).then(response => {
				const manufacturer = response.data;

				this.setState({ isLoadingManufacturers: false });

				setFieldValue(`markers.${index}.manufacturer`, manufacturer._id);
			});
		});
	};

	onCreateSpecification = (values, index, setFieldValue) => {
		this.setState({ isLoadingSpecifications: true }, () => {
			this.props.createSpecification(values).then(response => {
				const specification = response.data;

				this.setState({ isLoadingSpecifications: false });

				setFieldValue(`markers.${index}.specificationTemp.value`, specification._id);
			});
		});
	};

	onAddSpecificationInMarker = (markers, index, setFieldValue, arrayHelpersSpecifications) => {
		const { specifications: stockSpecifications } = this.props;

		const specificationIndex = stockSpecifications.findIndex(
			specification => specification._id === markers[index].specificationTemp.value
		);

		arrayHelpersSpecifications.push(stockSpecifications[specificationIndex]);

		setFieldValue(`markers.${index}.specificationTemp.name`, '');
		setFieldValue(`markers.${index}.specificationTemp.value`, '');
	};

	onUnitSellingPriceCalc = ({ target: { value } }, fieldName, markers, index, setFieldValue) => {
		setFieldValue(`markers.${index}.${fieldName}`, value);

		const checkEmptinessField = markers[index][`${fieldName === 'quantityInUnit' ? 'purchasePrice' : 'quantityInUnit'}`];
		const setValue =
			fieldName === 'quantityInUnit' ? markers[index].purchasePrice / value : value / markers[index].quantityInUnit;

		setFieldValue(`markers.${index}.unitSellingPrice`, !!value && !!checkEmptinessField ? setValue.toFixed(2) : '');
	};

	onSellingPriceCalc = ({ target: { value } }, index, setFieldValue) => {
		setFieldValue(`markers.${index}.purchasePrice`, value);

		setFieldValue(`markers.${index}.sellingPrice`, value);
	};

	render() {
		const {
			currentStock,
			product,
			manufacturers: stockManufacturers,
			specifications: stockSpecifications,
			initialValuesFrom,
			onPrevStep,
			onSubmit,
		} = this.props;
		const { isLoadingManufacturers, isLoadingSpecifications } = this.state;

		const initialValuesProductMarker = {
			stock: currentStock._id,
			manufacturer: '',
			manufacturerTemp: '',
			quantity: '',
			quantityPackages: '',
			quantityInUnit: '',
			minimumBalance: '',
			purchasePrice: '',
			sellingPrice: '',
			unitSellingPrice: '',
			isFree: false,
			linkInShop: '',
			specifications: [],
			specificationTemp: {
				name: '',
				valueTemp: '',
				value: '',
			},
		};

		const initialValues = initialValuesFrom || {
			markers: [initialValuesProductMarker],
		};

		return (
			<Formik
				initialValues={initialValues}
				validationSchema={() => markersSchema(product)}
				validateOnBlur={false}
				validateOnChange={false}
				onSubmit={(values, actions) => onSubmit(values, actions)}
				render={({ errors, isSubmitting, values, setFieldValue }) => {
					console.log(errors);
					return (
						<Form>
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

												<Grid className="pd-rowGridFormLabelControl" wrap="nowrap" alignItems="flex-start" container>
													<InputLabel error={checkArrayErrors(errors.markers, index, 'manufacturer')} style={{ minWidth: 120 }}>
														Производитель:
													</InputLabel>
													<FormControl fullWidth>
														<Field
															name={`markers.${index}.manufacturer`}
															component={SelectAutocompleteCreate}
															TextFieldProps={{
																error: checkArrayErrors(errors.markers, index, 'manufacturer'),
															}}
															isDisabled={isSubmitting || isLoadingManufacturers}
															isLoading={isLoadingManufacturers}
															value={
																stockManufacturers.find(
																	manufacturer => manufacturer._id === values.markers[index].manufacturer
																) || ''
															}
															inputValue={values.markers[index].manufacturerTemp}
															onChange={option => setFieldValue(`markers.${index}.manufacturer`, option ? option._id : '')}
															onInputChange={(value, { action }) => {
																if (action !== 'input-blur' && action !== 'menu-close') {
																	setFieldValue(`markers.${index}.manufacturerTemp`, value);

																	if (values.markers[index].manufacturer) {
																		setFieldValue(`markers.${index}.manufacturer`, '');
																	}
																}
															}}
															onCreateOption={value =>
																this.onCreateManufacturer(
																	{
																		stock: currentStock._id,
																		value: translitRu(value),
																		label: value,
																	},
																	index,
																	setFieldValue
																)
															}
															menuPlacement="top"
															menuPosition="fixed"
															placeholder="Выберите или создайте"
															noOptionsMessage={() => 'Не создано ни одного производителя, введите текст, чтобы создать'}
															formatCreateLabel={value => `Нажмите, чтобы создать «${value}»`}
															options={stockManufacturers}
														/>
														{checkArrayErrors(errors.markers, index, 'manufacturer') ? (
															<FormHelperText error>{errors.markers[index].manufacturer}</FormHelperText>
														) : null}
													</FormControl>
												</Grid>

												<Grid className="pd-rowGridFormLabelControl" style={{ marginBottom: 12 }} container spacing={2}>
													{product.receiptUnits === 'pce' || product.unitIssue !== 'pce' ? (
														<Grid xs={product.dividedMarkers ? 6 : 12} item>
															<Field
																name={`markers.${index}.quantity`}
																type="number"
																label={`Количество ${
																	product.receiptUnits === 'nmp' && product.unitIssue !== 'pce' ? 'упаковок' : 'штук'
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
																product.receiptUnits === 'nmp' && product.unitIssue === 'pce'
																	? product.dividedMarkers
																		? 4
																		: 6
																	: 6
															}
															item
														>
															<Field
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

													{product.receiptUnits === 'nmp' && product.unitIssue === 'pce' ? (
														<Grid xs={product.dividedMarkers ? 4 : 6} item>
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
																	product.receiptUnits === 'nmp' && product.unitIssue === 'pce'
																		? {
																				onChange: event =>
																					this.onUnitSellingPriceCalc(
																						event,
																						'quantityInUnit',
																						values.markers,
																						index,
																						setFieldValue
																					),
																		  }
																		: {}
																}
																autoComplete="off"
																fullWidth
															/>
														</Grid>
													) : null}

													{product.dividedMarkers ? (
														<Grid xs={product.receiptUnits === 'nmp' && product.unitIssue === 'pce' ? 4 : 6} item>
															<Field
																name={`markers.${index}.minimumBalance`}
																type="number"
																label={`Мин. остаток в ${
																	product.receiptUnits === 'nmp' && product.unitIssue !== 'pce' ? 'упаковках' : 'штуках'
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
														values.markers[index].isFree
															? checkArrayErrors(errors.markers, index, 'purchasePrice') && values.markers[index].isFree
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
																product.receiptUnits === 'nmp' && product.unitIssue === 'pce' ? ' упаковки' : ''
															}:`}
															placeholder="0"
															component={TextField}
															InputLabelProps={{
																shrink: true,
															}}
															inputProps={
																product.receiptUnits === 'nmp' && product.unitIssue === 'pce'
																	? {
																			onChange: event =>
																				this.onUnitSellingPriceCalc(event, 'purchasePrice', values.markers, index, setFieldValue),
																	  }
																	: {
																			onChange: event => this.onSellingPriceCalc(event, index, setFieldValue),
																	  }
															}
															autoComplete="off"
															fullWidth
														/>
													</Grid>

													<Grid xs={6} item>
														{!values.markers[index].isFree ? (
															product.receiptUnits === 'nmp' && product.unitIssue === 'pce' ? (
																<Field
																	name={`markers.${index}.unitSellingPrice`}
																	type="number"
																	label={`Цена продажи штуки:`}
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
																	name={`markers.${index}.sellingPrice`}
																	type="number"
																	label={`Цена продажи:`}
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
													<InputLabel error={checkArrayErrors(errors.markers, index, 'linkInShop')} style={{ minWidth: 120 }}>
														Ссылка / Магазин:
													</InputLabel>
													<FormControl fullWidth>
														<Field
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
													name={`markers.${index}.specifications`}
													validateOnChange={false}
													render={arrayHelpersSpecifications => (
														<Grid>
															{marker.specifications.length ? (
																<Grid
																	className="pd-rowGridFormLabelControl"
																	style={{ marginBottom: 11 }}
																	wrap="nowrap"
																	alignItems="flex-start"
																	container
																>
																	<InputLabel style={{ display: 'inline-flex', minWidth: 120 }}>Характеристики:</InputLabel>
																	<Grid style={{ marginTop: 7, width: 'calc(100% - 120px)' }} container>
																		<Chips
																			chips={marker.specifications.sort(compareName)}
																			onRenderChipLabel={value => (
																				<span>
																					<span style={{ fontWeight: 600 }}>{specificationTransform(value.name)}</span>:{' '}
																					{value.label}
																				</span>
																			)}
																			onRemoveChip={(chips, index) => arrayHelpersSpecifications.remove(index)}
																		/>
																	</Grid>
																</Grid>
															) : null}

															{specifications.filter(
																specification =>
																	!marker.specifications.some(markerSpecification => markerSpecification.name === specification)
															).length ? (
																<Grid
																	className="pd-rowGridFormLabelControl"
																	wrap="nowrap"
																	alignItems="flex-start"
																	spacing={2}
																	container
																>
																	<Grid className="pd-rowGridFormLabelControl" xs={6} style={{ marginBottom: 0 }} item>
																		<InputLabel style={{ display: 'inline-flex', minWidth: 120 }}>
																			{!marker.specifications.length ? 'Характеристики:' : null}
																		</InputLabel>
																		<FormControl style={{ width: 'calc(100% - 130px)' }}>
																			<Field
																				name={`markers.${index}.specificationTemp.name`}
																				component={Select}
																				IconComponent={() => (
																					<FontAwesomeIcon icon={['far', 'angle-down']} className="pd-selectIcon" />
																				)}
																				inputProps={{
																					onChange: ({ target: { value } }) => {
																						setFieldValue(`markers.${index}.specificationTemp.name`, value);
																						setFieldValue(`markers.${index}.specificationTemp.value`, '');
																					},
																				}}
																				error={checkArrayErrors(errors.markers, index, 'specificationTemp.name')}
																				MenuProps={{
																					elevation: 2,
																					transitionDuration: 150,
																					TransitionComponent: Fade,
																				}}
																				displayEmpty
																			>
																				<MenuItem value="" disabled>
																					Выберите
																				</MenuItem>
																				{specifications
																					.filter(
																						specification =>
																							!marker.specifications.some(
																								markerSpecification => markerSpecification.name === specification
																							)
																					)
																					.map((specification, index) => (
																						<MenuItem key={index} value={specification}>
																							{specificationTransform(specification)}
																						</MenuItem>
																					))}
																			</Field>
																			{checkArrayErrors(errors.markers, index, 'specificationTemp.name') ? (
																				<FormHelperText error>{errors.markers[index].specificationTemp.name}</FormHelperText>
																			) : null}
																		</FormControl>
																	</Grid>

																	<Grid xs={6} item>
																		<FormControl style={{ width: 'calc(100% - 42px)' }}>
																			<Field
																				name={`markers.${index}.specificationTemp.value`}
																				component={SelectAutocompleteCreate}
																				TextFieldProps={{
																					error: checkArrayErrors(errors.markers, index, 'specificationTemp.value'),
																				}}
																				isDisabled={
																					isSubmitting || isLoadingSpecifications || !values.markers[index].specificationTemp.name
																				}
																				isLoading={isLoadingSpecifications}
																				value={
																					stockSpecifications.find(
																						value => value._id === values.markers[index].specificationTemp.value
																					) || ''
																				}
																				inputValue={values.markers[index].specificationTemp.valueTemp}
																				onChange={option =>
																					setFieldValue(`markers.${index}.specificationTemp.value`, option ? option._id : '')
																				}
																				onInputChange={(value, { action }) => {
																					if (action !== 'input-blur' && action !== 'menu-close') {
																						setFieldValue(`markers.${index}.specificationTemp.valueTemp`, value);
																					}
																				}}
																				onCreateOption={value =>
																					this.onCreateSpecification(
																						{
																							stock: currentStock._id,
																							name: values.markers[index].specificationTemp.name,
																							value: translitRu(value),
																							label: value,
																						},
																						index,
																						setFieldValue
																					)
																				}
																				menuPlacement="top"
																				menuPosition="fixed"
																				placeholder="Выберите или создайте"
																				noOptionsMessage={() => 'Не создано ни одного значения, введите текст, чтобы создать'}
																				formatCreateLabel={value => `Нажмите, чтобы создать «${value}»`}
																				options={stockSpecifications.filter(
																					value => value.name === values.markers[index].specificationTemp.name
																				)}
																			/>
																			{checkArrayErrors(errors.markers, index, 'specificationTemp.value') ? (
																				<FormHelperText error>{errors.markers[index].specificationTemp.value}</FormHelperText>
																			) : null}
																		</FormControl>
																		<IconButton
																			className="D-pam-create__add-specification"
																			aria-haspopup="true"
																			size="small"
																			onClick={() =>
																				this.onAddSpecificationInMarker(
																					values.markers,
																					index,
																					setFieldValue,
																					arrayHelpersSpecifications
																				)
																			}
																			disabled={
																				values.markers[index].specificationTemp.name === '' ||
																				values.markers[index].specificationTemp.value === ''
																			}
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

										<Button
											className="D-pam-create__add-marker"
											variant="outlined"
											color="primary"
											onClick={() => arrayHelpers.push(initialValuesProductMarker)}
										>
											<FontAwesomeIcon icon={['fal', 'plus']} />
											Добавить маркер
										</Button>
									</DialogContent>
								)}
							/>
							<PDDialogActions
								leftHandleProps={{
									handleProps: {
										onClick: () => onPrevStep(values),
									},
									text: 'Назад',
									iconLeft: !isSubmitting ? (
										<FontAwesomeIcon icon={['far', 'angle-left']} style={{ fontSize: 22, marginTop: 2 }} />
									) : null,
								}}
								rightHandleProps={{
									handleProps: {
										type: 'submit',
										disabled: isSubmitting,
									},
									text: isSubmitting ? <CircularProgress size={20} /> : 'Создать',
								}}
							/>
						</Form>
					);
				}}
			/>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		createManufacturer: values => dispatch(createManufacturer(values)),
		createSpecification: values => dispatch(createSpecification(values)),
	};
};

export default connect(
	null,
	mapDispatchToProps
)(ProductMarkersForm);
