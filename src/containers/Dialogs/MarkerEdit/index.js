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
import IconButton from '@material-ui/core/IconButton';
import Fade from '@material-ui/core/Fade';
import MenuItem from '@material-ui/core/MenuItem';

import translitRu from 'shared/translit/ru';
import { specifications, specificationTransform } from 'shared/productSpecifications';

import { PDDialog, PDDialogTitle, PDDialogActions } from 'src/components/Dialog';
import { SelectAutocompleteCreate } from 'src/components/selectAutocomplete';
import Chips from 'src/components/Chips';

import { markerSchema } from 'src/containers/Dialogs/ProductAndMarkersCreate/components/FormScheme';

import { getStockStatus } from 'src/actions/stocks';
import { createManufacturer } from 'src/actions/manufacturers';
import { createSpecification } from 'src/actions/specifications';
import { editMarker } from 'src/actions/markers';

const checkArrayErrors = (arrayFieldName, fieldName) => {
	return typeof arrayFieldName === 'object' && typeof arrayFieldName[fieldName] === 'string';
};

const compareName = (a, b) => {
	if (a.name > b.name) return 1;
	else if (a.name < b.name) return -1;
	else return 0;
};

class DialogMarkerEdit extends Component {
	static propTypes = {
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		currentStock: PropTypes.object.isRequired,
		selectedMarker: PropTypes.object,
	};

	state = {
		isLoadingManufacturers: false,
		isLoadingSpecifications: false,
	};

	onCreateManufacturer = (values, setFieldValue) => {
		this.setState({ isLoadingManufacturers: true }, () => {
			this.props.createManufacturer(values).then(response => {
				const manufacturer = response.data;

				this.setState({ isLoadingManufacturers: false });

				setFieldValue(`manufacturer`, manufacturer._id);
			});
		});
	};

	onCreateSpecification = (values, setFieldValue) => {
		this.setState({ isLoadingSpecifications: true }, () => {
			this.props.createSpecification(values).then(response => {
				const specification = response.data;

				this.setState({ isLoadingSpecifications: false });

				setFieldValue(`specificationTemp.value`, specification._id);
			});
		});
	};

	onAddSpecificationInMarker = (values, setFieldValue, arrayHelpersSpecifications) => {
		const { specifications: stockSpecifications } = this.props;

		const specificationIndex = stockSpecifications.findIndex(
			specification => specification._id === values.specificationTemp.value
		);

		arrayHelpersSpecifications.push(stockSpecifications[specificationIndex]);

		setFieldValue('specificationTemp.name', '');
		setFieldValue('specificationTemp.value', '');
	};

	onUnitSellingPriceCalc = ({ target: { value } }, fieldName, values, setFieldValue) => {
		setFieldValue(`${fieldName}`, value);

		const checkEmptinessField = values[`${fieldName === 'quantityInUnit' ? 'purchasePrice' : 'quantityInUnit'}`];
		const setValue = fieldName === 'quantityInUnit' ? values.purchasePrice / value : value / values.quantityInUnit;

		setFieldValue('unitSellingPrice', !!value && !!checkEmptinessField ? setValue.toFixed(2) : '');
	};

	onSellingPriceCalc = ({ target: { value } }, setFieldValue) => {
		setFieldValue('purchasePrice', value);

		setFieldValue('sellingPrice', value);
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
		const {
			dialogOpen,
			onCloseDialog,
			currentStock,
			manufacturers: stockManufacturers,
			specifications: stockSpecifications,
			selectedProduct,
			selectedMarker,
		} = this.props;
		const { isLoadingManufacturers, isLoadingSpecifications } = this.state;

		if (!selectedProduct || !selectedMarker) return null;

		const product = selectedProduct;

		let initialValues = {
			manufacturerTemp: '',
			quantity: '',
			quantityPackages: '',
			quantityInUnit: '',
			minimumBalance: '',
			sellingPrice: '',
			unitSellingPrice: '',
			specificationTemp: {
				name: '',
				valueTemp: '',
				value: '',
			},
			...selectedMarker,
			manufacturer: selectedMarker.manufacturer._id,
		};

		return (
			<PDDialog
				open={dialogOpen}
				onClose={onCloseDialog}
				onExited={this.onExitedDialog}
				maxWidth="lg"
				scroll="body"
				fullWidth
				stickyActions
			>
				<PDDialogTitle theme="primary" onClose={onCloseDialog} children="Редактирование позиции" />
				<Formik
					initialValues={initialValues}
					validationSchema={() => markerSchema(product)}
					validateOnBlur={false}
					validateOnChange={false}
					onSubmit={(values, actions) => this.onMarkerEdit(values, actions)}
					render={({ errors, isSubmitting, values, setFieldValue }) => (
						<Form>
							<DialogContent>
								<Grid className="pd-rowGridFormLabelControl" wrap="nowrap" alignItems="flex-start" container>
									<InputLabel error={checkArrayErrors(errors, 'manufacturer')} style={{ minWidth: 120 }}>
										Производитель:
									</InputLabel>
									<FormControl fullWidth>
										<Field
											name="manufacturer"
											component={SelectAutocompleteCreate}
											TextFieldProps={{
												error: checkArrayErrors(errors, 'manufacturer'),
											}}
											isDisabled={isSubmitting || isLoadingManufacturers}
											isLoading={isLoadingManufacturers}
											value={stockManufacturers.find(manufacturer => manufacturer._id === values.manufacturer) || ''}
											inputValue={values.manufacturerTemp}
											onChange={option => setFieldValue('manufacturer', option ? option._id : '')}
											onInputChange={(value, { action }) => {
												if (action !== 'input-blur' && action !== 'menu-close') {
													setFieldValue('manufacturerTemp', value);

													if (values.manufacturer) {
														setFieldValue('manufacturer', '');
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
										{checkArrayErrors(errors, 'manufacturer') ? (
											<FormHelperText error>{errors.manufacturer}</FormHelperText>
										) : null}
									</FormControl>
								</Grid>

								<Grid className="pd-rowGridFormLabelControl" style={{ marginBottom: 12 }} container spacing={2}>
									{product.receiptUnits === 'pce' || product.unitIssue !== 'pce' ? (
										<Grid xs={product.dividedMarkers ? 6 : 12} item>
											<Field
												name="quantity"
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
											xs={product.receiptUnits === 'nmp' && product.unitIssue === 'pce' ? (product.dividedMarkers ? 4 : 6) : 6}
											item
										>
											<Field
												name="quantityPackages"
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
												name="quantityInUnit"
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
																onChange: event => this.onUnitSellingPriceCalc(event, 'quantityInUnit', values, setFieldValue),
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
												name="minimumBalance"
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
										values.isFree
											? checkArrayErrors(errors, 'purchasePrice') && values.isFree
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
											name="purchasePrice"
											type="number"
											label={`Цена закупки${product.receiptUnits === 'nmp' && product.unitIssue === 'pce' ? ' упаковки' : ''}:`}
											placeholder="0"
											component={TextField}
											InputLabelProps={{
												shrink: true,
											}}
											inputProps={
												product.receiptUnits === 'nmp' && product.unitIssue === 'pce'
													? {
															onChange: event => this.onUnitSellingPriceCalc(event, 'purchasePrice', values, setFieldValue),
													  }
													: {
															onChange: event => this.onSellingPriceCalc(event, setFieldValue),
													  }
											}
											autoComplete="off"
											fullWidth
										/>
									</Grid>

									<Grid xs={6} item>
										{!values.isFree ? (
											product.receiptUnits === 'nmp' && product.unitIssue === 'pce' ? (
												<Field
													name="unitSellingPrice"
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
													name="sellingPrice"
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
									<InputLabel error={checkArrayErrors(errors, 'linkInShop')} style={{ minWidth: 120 }}>
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
									name="specifications"
									validateOnChange={false}
									render={arrayHelpersSpecifications => (
										<Grid>
											{values.specifications.length ? (
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
															chips={values.specifications.sort(compareName)}
															onRenderChipLabel={value => (
																<span>
																	<span style={{ fontWeight: 600 }}>{specificationTransform(value.name)}</span>: {value.label}
																</span>
															)}
															onRemoveChip={(chips, index) => arrayHelpersSpecifications.remove(index)}
														/>
													</Grid>
												</Grid>
											) : null}

											{specifications.filter(
												specification =>
													!values.specifications.some(markerSpecification => markerSpecification.name === specification)
											).length ? (
												<Grid className="pd-rowGridFormLabelControl" wrap="nowrap" alignItems="flex-start" spacing={2} container>
													<Grid className="pd-rowGridFormLabelControl" xs={6} style={{ marginBottom: 0 }} item>
														<InputLabel style={{ display: 'inline-flex', minWidth: 120 }}>
															{!values.specifications.length ? 'Характеристики:' : null}
														</InputLabel>
														<FormControl style={{ width: 'calc(100% - 130px)' }}>
															<Field
																name={'specificationTemp.name'}
																component={Select}
																IconComponent={() => <FontAwesomeIcon icon={['far', 'angle-down']} className="pd-selectIcon" />}
																inputProps={{
																	onChange: ({ target: { value } }) => {
																		setFieldValue('specificationTemp.name', value);
																		setFieldValue('specificationTemp.value', '');
																	},
																}}
																error={checkArrayErrors(errors, 'specificationTemp.name')}
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
																			!values.specifications.some(
																				markerSpecification => markerSpecification.name === specification
																			)
																	)
																	.map((specification, index) => (
																		<MenuItem key={index} value={specification}>
																			{specificationTransform(specification)}
																		</MenuItem>
																	))}
															</Field>
															{checkArrayErrors(errors, 'specificationTemp.name') ? (
																<FormHelperText error>{errors.specificationTemp.name}</FormHelperText>
															) : null}
														</FormControl>
													</Grid>

													<Grid xs={6} item>
														<FormControl style={{ width: 'calc(100% - 42px)' }}>
															<Field
																name={'specificationTemp.value'}
																component={SelectAutocompleteCreate}
																TextFieldProps={{
																	error: checkArrayErrors(errors, 'specificationTemp.value'),
																}}
																isDisabled={isSubmitting || isLoadingSpecifications || !values.specificationTemp.name}
																isLoading={isLoadingSpecifications}
																value={stockSpecifications.find(value => value._id === values.specificationTemp.value) || ''}
																inputValue={values.specificationTemp.valueTemp}
																onChange={option => setFieldValue('specificationTemp.value', option ? option._id : '')}
																onInputChange={(value, { action }) => {
																	if (action !== 'input-blur' && action !== 'menu-close') {
																		setFieldValue('specificationTemp.valueTemp', value);
																	}
																}}
																onCreateOption={value =>
																	this.onCreateSpecification(
																		{
																			stock: currentStock._id,
																			name: values.specificationTemp.name,
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
																options={stockSpecifications.filter(value => value.name === values.specificationTemp.name)}
															/>
															{checkArrayErrors(errors, 'specificationTemp.value') ? (
																<FormHelperText error>{errors.specificationTemp.value}</FormHelperText>
															) : null}
														</FormControl>
														<IconButton
															className="D-pam-create__add-specification"
															aria-haspopup="true"
															size="small"
															onClick={() => this.onAddSpecificationInMarker(values, setFieldValue, arrayHelpersSpecifications)}
															disabled={values.specificationTemp.name === '' || values.specificationTemp.value === ''}
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
		manufacturers: state.manufacturers.data,
		specifications: state.specifications.data,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStock } = ownProps;

	return {
		getStockStatus: () => dispatch(getStockStatus(currentStock._id)),
		createManufacturer: values => dispatch(createManufacturer(values)),
		createSpecification: values => dispatch(createSpecification(values)),
		editMarker: (productId, markerId, newValues) => dispatch(editMarker(productId, markerId, newValues)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DialogMarkerEdit);
