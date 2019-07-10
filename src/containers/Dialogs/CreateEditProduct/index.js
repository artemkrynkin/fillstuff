import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Formik, Form, Field, FieldArray } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import * as Yup from 'yup';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuItem from '@material-ui/core/MenuItem';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Fade from '@material-ui/core/Fade';
import FormHelperText from '@material-ui/core/FormHelperText';
import MuiDialog from '@material-ui/core/Dialog';
import FormLabel from '@material-ui/core/FormLabel';
import IconButton from '@material-ui/core/IconButton';

import translitRu from 'shared/translit/ru';

import { SelectAutocompleteCreate } from 'src/components/selectAutocomplete';
import { PDDialogActions, PDDialogTitle } from 'src/components/Dialog';

import { getStockStatus, createProductShop, createProductSpecification } from 'src/actions/stocks';
import { createProduct, editProduct } from 'src/actions/products';

import './index.styl';
import ButtonBase from '@material-ui/core/ButtonBase';

const Dialog = withStyles({
	paperWidthLg: {
		maxWidth: 800,
	},
})(MuiDialog);

const productSchema = Yup.object().shape({
	name: Yup.string()
		// eslint-disable-next-line
		.min(2, 'Не может быть короче ${min} символов')
		// eslint-disable-next-line
		.max(100, 'Не может превышать ${max} символов')
		.required('Обязательное поле'),
	receiptUnits: Yup.string()
		.oneOf(['pce', 'nmp', 'npl', 'bot'], 'Значение отсутствует в списке доступных единиц')
		.required('Обязательное поле'),
	unitIssue: Yup.string()
		.when('receiptUnits', (value, schema) => {
			return value === 'nmp'
				? schema.oneOf(['pce', 'nmp'], 'Значение отсутствует в списке доступных единиц').required('Обязательное поле')
				: schema;
		})
		.nullable(),
	quantity: Yup.number()
		// eslint-disable-next-line
		.min(0, 'Не может быть меньше ${min}')
		.required('Обязательное поле'),
	quantityInUnit: Yup.number().when('receiptUnits', (value, schema) => {
		return value === 'nmp'
			? schema
					// eslint-disable-next-line
					.min(0, 'Не может быть меньше ${min}')
					.required('Обязательное поле')
			: schema;
	}),
	minimumBalance: Yup.number()
		// eslint-disable-next-line
		.min(1, 'Не может быть меньше ${min}')
		.required('Обязательное поле'),
	purchasePrice: Yup.number()
		// eslint-disable-next-line
		.min(0, 'Не может быть меньше ${min}')
		.required('Обязательное поле'),
	margin: Yup.number()
		// eslint-disable-next-line
		.min(0, 'Не может быть меньше ${min}')
		.required('Обязательное поле'),
	sellingPrice: Yup.number()
		// eslint-disable-next-line
		.min(0, 'Не может быть меньше ${min}')
		.required('Обязательное поле'),
	specifications: Yup.array().of(
		Yup.object().shape({
			nameId: Yup.string().required('Обязательное поле'),
			valueId: Yup.string().required('Обязательное поле'),
		})
	),
});

class CreateEditProduct extends Component {
	static propTypes = {
		actionType: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.object.isRequired]),
		dialogOpen: PropTypes.bool.isRequired,
		selectedData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
		onCloseDialog: PropTypes.func.isRequired,
		currentStock: PropTypes.object.isRequired,
	};

	static defaultProps = {
		actionType: null,
	};

	state = {
		isLoadingShop: false,
		isLoadingSpecifications: false,
	};

	onCreateProductShop = (values, setFieldValue) => {
		this.setState({ isLoadingShop: true }, () => {
			this.props.createProductShop(values).then(response => {
				const shop = response.data;

				this.setState({ isLoadingShop: false });

				setFieldValue('shopId', shop._id);
			});
		});
	};

	onCreateProductSpecification = (schemaName, values, index, setFieldValue) => {
		this.setState({ isLoadingSpecifications: true }, () => {
			this.props.createProductSpecification(schemaName, values).then(response => {
				const specification = response.data;

				this.setState({ isLoadingSpecifications: false });

				setFieldValue(`specifications[${index}].${schemaName === 'names' ? 'nameId' : 'valueId'}`, specification._id);
			});
		});
	};

	render() {
		const { actionType, dialogOpen, selectedProduct, onCloseDialog, currentStock } = this.props;
		const { isLoadingShop, isLoadingSpecifications } = this.state;

		const initialValues = {
			name: '',
			categoryId: '',
			receiptUnits: '',
			quantity: 0,
			minimumBalance: 0,
			purchasePrice: 0,
			sellingPrice: 0,
			margin: 0,
			shopId: '',
			specifications: [],
		};

		return (
			<Dialog open={dialogOpen} onClose={onCloseDialog} maxWidth="lg" fullWidth scroll="body">
				<PDDialogTitle theme="primary" onClose={onCloseDialog}>
					{actionType === 'create' ? 'Добавление новой позиции' : 'Редактирование позиции'}
				</PDDialogTitle>
				<Formik
					initialValues={actionType === 'create' ? initialValues : selectedProduct}
					validationSchema={productSchema}
					validateOnBlur={false}
					validateOnChange={false}
					onSubmit={(values, actions) => {
						values.sellingPrice = Math.ceil(values.purchasePrice + (values.purchasePrice / 100) * values.margin);

						if (values.unitIssue === 'pce') {
							console.log(values.quantityInUnit, values.purchasePrice);
							values.unitPurchasePrice = values.purchasePrice / values.quantityInUnit;
							values.unitSellingPrice = values.sellingPrice / values.quantityInUnit;
						}

						if (actionType === 'create') {
							this.props.createProduct(values).then(response => {
								if (response.status === 'success') {
									this.props.getStockStatus();
									onCloseDialog();
								} else actions.setSubmitting(false);
							});
						}

						if (actionType === 'edit') {
							this.props.editProduct(selectedProduct._id, values).then(response => {
								if (response.status === 'success') {
									this.props.getStockStatus();
									onCloseDialog();
								} else actions.setSubmitting(false);
							});
						}
					}}
					render={({ errors, isSubmitting, values, setFieldValue }) => (
						<Form>
							<DialogContent>
								<Grid className="pd-rowGridFormLabelControl" style={{ marginBottom: 12 }} container spacing={2}>
									<Grid xs={6} item>
										<Field
											name="name"
											label="Наименование"
											component={TextField}
											InputLabelProps={{
												shrink: true,
											}}
											autoComplete="off"
											autoFocus
											fullWidth
										/>
									</Grid>
									<Grid xs={6} item>
										<FormControl fullWidth>
											<InputLabel error={Boolean(errors.categoryId)} shrink>
												Категория
											</InputLabel>
											<Field
												name="categoryId"
												component={Select}
												IconComponent={() => <FontAwesomeIcon icon={['far', 'angle-down']} className="pd-selectIcon" />}
												error={Boolean(errors.categoryId)}
												MenuProps={{
													elevation: 2,
													transitionDuration: 150,
													TransitionComponent: Fade,
												}}
												displayEmpty
												disabled={!currentStock.categories.length}
											>
												<MenuItem value="">Без категории</MenuItem>
												{currentStock.categories.map((category, index) => {
													return (
														<MenuItem key={category._id} value={category._id}>
															{category.name}
														</MenuItem>
													);
												})}
											</Field>
											{typeof errors.categoryId === 'string' ? (
												<FormHelperText error={true}>{errors.categoryId}</FormHelperText>
											) : null}
										</FormControl>
									</Grid>
								</Grid>
								<Grid className="pd-rowGridFormLabelControl" style={{ marginBottom: 12 }} container spacing={2}>
									<Grid xs={values.receiptUnits !== 'nmp' ? 4 : 3} item>
										<FormControl fullWidth>
											<InputLabel error={Boolean(errors.receiptUnits)} shrink>
												Единица поступления
											</InputLabel>
											<Field
												name="receiptUnits"
												component={Select}
												IconComponent={() => <FontAwesomeIcon icon={['far', 'angle-down']} className="pd-selectIcon" />}
												error={Boolean(errors.receiptUnits)}
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
												<MenuItem value="pce">Штука</MenuItem>
												<MenuItem value="nmp">Упаковка</MenuItem>
												<MenuItem value="npl">Рулон</MenuItem>
												<MenuItem value="bot">Бутыль</MenuItem>
											</Field>
											{typeof errors.receiptUnits === 'string' ? (
												<FormHelperText error={true}>{errors.receiptUnits}</FormHelperText>
											) : null}
										</FormControl>
									</Grid>
									{values.receiptUnits === 'nmp' ? (
										<Grid xs={3} item>
											<FormControl fullWidth>
												<InputLabel error={Boolean(errors.unitIssue)} shrink>
													Единица отпуска
												</InputLabel>
												<Field
													name="unitIssue"
													inputProps={{
														value: values.unitIssue || '',
													}}
													component={Select}
													IconComponent={() => <FontAwesomeIcon icon={['far', 'angle-down']} className="pd-selectIcon" />}
													error={Boolean(errors.unitIssue)}
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
													<MenuItem value="pce">Штука</MenuItem>
													<MenuItem value="nmp">Упаковка</MenuItem>
												</Field>
												{typeof errors.unitIssue === 'string' ? (
													<FormHelperText error={true}>{errors.unitIssue}</FormHelperText>
												) : null}
											</FormControl>
										</Grid>
									) : null}
									<Grid xs={values.receiptUnits !== 'nmp' ? 4 : 2} item>
										<Field
											name="quantity"
											type="number"
											label="Количество"
											component={TextField}
											InputLabelProps={{
												shrink: true,
											}}
											autoComplete="off"
											fullWidth
										/>
									</Grid>
									{values.receiptUnits === 'nmp' ? (
										<Grid xs={2} item>
											<Field
												name="quantityInUnit"
												type="number"
												label="Штук в единице"
												inputProps={{
													value: values.quantityInUnit || 0,
												}}
												component={TextField}
												InputLabelProps={{
													shrink: true,
												}}
												autoComplete="off"
												fullWidth
											/>
										</Grid>
									) : null}
									<Grid xs={values.receiptUnits !== 'nmp' ? 4 : 2} item>
										<Field
											name="minimumBalance"
											type="number"
											label="Мин. остаток"
											component={TextField}
											InputLabelProps={{
												shrink: true,
											}}
											autoComplete="off"
											fullWidth
										/>
									</Grid>
								</Grid>
								<Grid className="pd-rowGridFormLabelControl" style={{ marginBottom: 12 }} container spacing={2}>
									<Grid xs={4} item>
										<Field
											name="purchasePrice"
											type="number"
											label="Цена закупки"
											component={TextField}
											InputLabelProps={{
												shrink: true,
											}}
											autoComplete="off"
											fullWidth
										/>
									</Grid>
									<Grid xs={4} item>
										<Field
											name="margin"
											type="number"
											label="Маржа в %"
											component={TextField}
											InputLabelProps={{
												shrink: true,
											}}
											autoComplete="off"
											fullWidth
										/>
									</Grid>
									<Grid xs={4} item>
										<Field
											className="D-create-edit-product__selling-price"
											name="sellingPrice"
											type="number"
											label="Цена продажи"
											component={TextField}
											InputLabelProps={{
												shrink: true,
											}}
											InputProps={{
												value: Math.ceil(values.purchasePrice + (values.purchasePrice / 100) * values.margin),
												readOnly: true,
											}}
											autoComplete="off"
											fullWidth
										/>
									</Grid>
								</Grid>
								<Grid className="pd-rowGridFormLabelControl" style={{ marginBottom: 12 }} container spacing={2}>
									<Grid xs={2} item>
										<FormLabel style={{ display: 'block', marginTop: 12 }}>Магазин</FormLabel>
									</Grid>
									<Grid xs={10} item>
										<Field
											name="shopId"
											component={SelectAutocompleteCreate}
											isClearable
											isDisabled={isSubmitting || isLoadingShop}
											isLoading={isLoadingShop}
											value={currentStock.productShops.find(shop => shop._id === values.shopId) || ''}
											onChange={option => setFieldValue(`shopId`, option ? option._id : '')}
											onCreateOption={value =>
												this.onCreateProductShop(
													{
														value: translitRu(value),
														label: value,
													},
													setFieldValue
												)
											}
											menuPlacement="top"
											menuPosition="fixed"
											placeholder="Выберите магазин"
											noOptionsMessage={() => 'Не создано ни одного магазина'}
											formatCreateLabel={value => `Создать «${value}»`}
											options={currentStock.productShops}
										/>
									</Grid>
								</Grid>
								<FieldArray
									name="specifications"
									validateOnChange={false}
									render={arrayHelpers => {
										const checkErrorSpecifications = () => {
											return Boolean(typeof errors.specifications === 'object' && errors.specifications.length);
										};
										const checkErrorSpecificationField = (fieldName, index) => {
											return Boolean(
												typeof errors.specifications === 'object' &&
													errors.specifications.length &&
													typeof errors.specifications[index] === 'object' &&
													typeof errors.specifications[index][fieldName] === 'string'
											);
										};

										return (
											<Grid className="pd-rowGridFormLabelControl" style={{ marginBottom: -8 }}>
												{values.specifications.map((specification, index) => (
													<Grid key={index} style={{ marginBottom: 8 }} container spacing={2}>
														<Grid xs={2} item>
															{index === 0 ? (
																<FormLabel error={checkErrorSpecifications()} style={{ display: 'block', marginTop: 12 }}>
																	Характеристики
																</FormLabel>
															) : null}
														</Grid>
														<Grid xs={4} item>
															<Field
																name={`specifications[${index}].nameId`}
																component={SelectAutocompleteCreate}
																TextFieldProps={{
																	error: checkErrorSpecificationField('nameId', index),
																}}
																isClearable
																isDisabled={isSubmitting || isLoadingSpecifications}
																isLoading={isLoadingSpecifications}
																value={
																	currentStock.productSpecifications.names.find(
																		specification => specification._id === values.specifications[index].nameId
																	) || ''
																}
																onChange={(option, { action }) => {
																	setFieldValue(`specifications[${index}].nameId`, option ? option._id : '');

																	if (action === 'select-option' || action === 'clear')
																		setFieldValue(`specifications[${index}].valueId`, '');
																}}
																onCreateOption={value =>
																	this.onCreateProductSpecification(
																		'names',
																		{
																			value: translitRu(value),
																			label: value,
																		},
																		index,
																		setFieldValue
																	)
																}
																menuPlacement="top"
																menuPosition="fixed"
																placeholder="Выберите характеристику"
																noOptionsMessage={() => 'Не создано ни одной характеристики'}
																formatCreateLabel={value => `Создать «${value}»`}
																options={currentStock.productSpecifications.names}
															/>
															{checkErrorSpecificationField('nameId', index) ? (
																<FormHelperText error={true}>{errors.specifications[index].nameId}</FormHelperText>
															) : null}
														</Grid>
														<Grid xs={6} item>
															<Grid container spacing={2} alignItems="flex-start">
																<Grid xs={10} item style={{ flexBasis: 'calc(100% - 48px)', maxWidth: 'calc(100% - 48px)' }}>
																	<Field
																		name={`specifications[${index}].valueId`}
																		component={SelectAutocompleteCreate}
																		TextFieldProps={{
																			error: checkErrorSpecificationField('valueId', index),
																		}}
																		isClearable
																		isDisabled={isSubmitting || isLoadingSpecifications || !values.specifications[index].nameId}
																		isLoading={isLoadingSpecifications}
																		value={
																			currentStock.productSpecifications.values.find(
																				value => value._id === values.specifications[index].valueId
																			) || ''
																		}
																		onChange={option =>
																			setFieldValue(`specifications[${index}].valueId`, option ? option._id : '')
																		}
																		onCreateOption={value =>
																			this.onCreateProductSpecification(
																				'values',
																				{
																					parentId: values.specifications[index].nameId,
																					value: translitRu(value),
																					label: value,
																				},
																				index,
																				setFieldValue
																			)
																		}
																		menuPlacement="top"
																		menuPosition="fixed"
																		placeholder="Выберите значение характеристики"
																		noOptionsMessage={() => 'Не создано ни одного значения, начните вводить, чтобы создать'}
																		formatCreateLabel={value => `Создать «${value}»`}
																		options={currentStock.productSpecifications.values.filter(
																			value => value.parentId === values.specifications[index].nameId
																		)}
																	/>
																	{checkErrorSpecificationField('valueId', index) ? (
																		<FormHelperText error={true}>{errors.specifications[index].valueId}</FormHelperText>
																	) : null}
																</Grid>
																<Grid xs={2} item style={{ flexBasis: 48, maxWidth: 48 }}>
																	<IconButton
																		className="D-create-edit-product__specification-remove"
																		aria-haspopup="true"
																		onClick={() => arrayHelpers.remove(index)}
																		size="small"
																		disabled={isSubmitting}
																	>
																		<FontAwesomeIcon icon={['fal', 'times']} />
																	</IconButton>
																</Grid>
															</Grid>
														</Grid>
													</Grid>
												))}
												<Grid style={{ marginBottom: 8 }} container alignItems="flex-start" spacing={2}>
													<Grid xs={2} item>
														{!values.specifications.length ? <FormLabel>Характеристики</FormLabel> : null}
													</Grid>
													<Grid xs={10} item>
														<ButtonBase
															className="D-create-edit-product__add-specification button-link-bg-400"
															component="span"
															disableRipple
															onClick={() => arrayHelpers.push({ nameId: '', valueId: '' })}
															disabled={isSubmitting}
														>
															<FontAwesomeIcon icon={['fal', 'plus']} />
															Добавить
														</ButtonBase>
													</Grid>
												</Grid>
											</Grid>
										);
									}}
								/>
							</DialogContent>
							<PDDialogActions
								leftHandleProps={{
									handleProps: {
										onClick: onCloseDialog,
									},
									text: 'Отмена',
								}}
								rightHandleProps={{
									handleProps: {
										type: 'submit',
										disabled: isSubmitting,
									},
									text: isSubmitting ? <CircularProgress size={20} /> : 'Сохранить',
								}}
							/>
						</Form>
					)}
				/>
			</Dialog>
		);
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStock, selectedCategoryId } = ownProps;

	return {
		getStockStatus: () => dispatch(getStockStatus(currentStock._id)),
		createProductShop: values => dispatch(createProductShop(currentStock._id, values)),
		createProductSpecification: (schemaName, values) =>
			dispatch(createProductSpecification(currentStock._id, schemaName, values)),
		createProduct: values => dispatch(createProduct(currentStock._id, selectedCategoryId, values)),
		editProduct: (productId, newValues) => dispatch(editProduct(productId, newValues)),
	};
};

export default connect(
	null,
	mapDispatchToProps
)(CreateEditProduct);
