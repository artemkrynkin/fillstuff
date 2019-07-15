import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Formik, Form, Field, FieldArray } from 'formik';
import { TextField, Select, CheckboxWithLabel } from 'formik-material-ui';
import * as Yup from 'yup';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ButtonBase from '@material-ui/core/ButtonBase';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuItem from '@material-ui/core/MenuItem';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Fade from '@material-ui/core/Fade';
import FormHelperText from '@material-ui/core/FormHelperText';
import Dialog from '@material-ui/core/Dialog';
import FormLabel from '@material-ui/core/FormLabel';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';

import translitRu from 'shared/translit/ru';

import { SelectAutocompleteCreate } from 'src/components/selectAutocomplete';
import { PDDialogActions, PDDialogTitle } from 'src/components/Dialog';

import { getStockStatus, createProductShop, createProductSpecification } from 'src/actions/stocks';
import { createProduct, editProduct } from 'src/actions/products';

import './index.styl';

const productSchema = Yup.object().shape({
	name: Yup.string()
		// eslint-disable-next-line
		.min(2, 'Не может быть короче ${min} символов')
		// eslint-disable-next-line
		.max(100, 'Не может превышать ${max} символов')
		.required('Обязательное поле'),
	receiptUnits: Yup.string()
		.oneOf(['pce', 'nmp'], 'Значение отсутствует в списке доступных единиц')
		.required('Обязательное поле'),
	unitIssue: Yup.string().when('receiptUnits', (value, schema) => {
		return value === 'nmp'
			? schema.oneOf(['pce', 'nmp'], 'Значение отсутствует в списке доступных единиц').required('Обязательное поле')
			: schema;
	}),
	quantity: Yup.number().when('unitIssue', (value, schema) => {
		return value !== 'pce'
			? schema
					// eslint-disable-next-line
					.min(0, 'Не может быть меньше ${min}')
					.required('Обязательное поле')
			: schema;
	}),
	quantityPackages: Yup.number().when('unitIssue', (value, schema) => {
		return value === 'pce'
			? schema
					// eslint-disable-next-line
					.min(0, 'Не может быть меньше ${min}')
					.required('Обязательное поле')
			: schema;
	}),
	quantityInUnit: Yup.number().when('unitIssue', (value, schema) => {
		return value === 'pce'
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
	sellingPrice: Yup.number().when('freeProduct', (value, schema) => {
		return !value
			? schema
					// eslint-disable-next-line
					.min(0, 'Не может быть меньше ${min}')
					.required('Обязательное поле')
			: schema;
	}),
	shopId: Yup.string().required('Обязательное поле'),
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

				setFieldValue(`specifications.${index}.${schemaName === 'names' ? 'nameId' : 'valueId'}`, specification._id);
			});
		});
	};

	checkValuesProduct = values => {
		return new Promise((resolve, reject) => {
			if (values.receiptUnits === 'nmp' && values.unitIssue === 'pce') {
				values.quantity = +(values.quantityPackages * values.quantityInUnit).toFixed();
			} else {
				if (values.receiptUnits !== 'nmp') values.unitIssue = undefined;
				values.quantityPackages = undefined;
				values.quantityInUnit = undefined;
			}

			values.purchasePrice = +values.purchasePrice.toFixed(2);
			values.unitPurchasePrice = +(values.receiptUnits === 'nmp' && values.unitIssue === 'pce'
				? values.purchasePrice / values.quantityInUnit
				: values.purchasePrice
			).toFixed(2);

			if (!values.freeProduct) {
				if (values.unitIssue !== 'pce') {
					values.sellingPrice = +values.sellingPrice.toFixed(2);
					values.unitSellingPrice = +values.sellingPrice.toFixed(2);
				} else {
					values.unitSellingPrice = +values.unitSellingPrice.toFixed(2);
					values.sellingPrice = +(values.unitSellingPrice * values.quantityInUnit).toFixed(2);
				}
			} else {
				values.sellingPrice = undefined;
				values.unitSellingPrice = undefined;
			}

			resolve();
		});
	};

	render() {
		const { actionType, dialogOpen, selectedProduct, onCloseDialog, currentStock } = this.props;
		const { isLoadingShop, isLoadingSpecifications } = this.state;

		const initialValues = {
			name: '',
			receiptUnits: '',
			quantity: '',
			minimumBalance: '',
			purchasePrice: '',
			sellingPrice: '',
			freeProduct: false,
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
					onSubmit={async (values, actions) => {
						await this.checkValuesProduct(values);

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
								<Grid className="pd-rowGridFormLabelControl" wrap="nowrap" container>
									<FormLabel error={Boolean(errors.name)} style={{ minWidth: 146 }}>
										Наименование:
									</FormLabel>
									<Field
										name="name"
										component={TextField}
										InputLabelProps={{
											shrink: true,
										}}
										autoComplete="off"
										autoFocus
										fullWidth
									/>
								</Grid>

								<Divider style={{ marginBottom: 20 }} />

								<Grid className="pd-rowGridFormLabelControl" wrap="nowrap" container>
									<FormLabel error={Boolean(errors.receiptUnits)} style={{ minWidth: 146 }}>
										Единица поступления:
									</FormLabel>
									<FormControl fullWidth>
										<Field
											name="receiptUnits"
											component={Select}
											IconComponent={() => <FontAwesomeIcon icon={['far', 'angle-down']} className="pd-selectIcon" />}
											error={Boolean(errors.receiptUnits)}
											inputProps={{
												onChange: event => {
													const { value } = event.target;

													setFieldValue('receiptUnits', value);
													setFieldValue('unitIssue', values.unitIssue || '');
												},
											}}
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
										{Boolean(errors.receiptUnits) ? <FormHelperText error>{errors.receiptUnits}</FormHelperText> : null}
									</FormControl>
								</Grid>

								{values.receiptUnits === 'nmp' ? (
									<Grid className="pd-rowGridFormLabelControl" wrap="nowrap" container>
										<FormLabel error={Boolean(errors.unitIssue)} style={{ minWidth: 146 }}>
											Единица отпуска:
										</FormLabel>
										<FormControl fullWidth>
											<Field
												name="unitIssue"
												component={Select}
												IconComponent={() => <FontAwesomeIcon icon={['far', 'angle-down']} className="pd-selectIcon" />}
												error={Boolean(errors.unitIssue)}
												inputProps={{
													onChange: event => {
														const { value } = event.target;

														setFieldValue('unitIssue', value);
														setFieldValue('quantity', values.quantity || '');
														setFieldValue('quantityPackages', values.quantityPackages || '');
														setFieldValue('quantityInUnit', values.quantityInUnit || '');
														setFieldValue('unitSellingPrice', values.unitSellingPrice || '');
													},
												}}
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
											{Boolean(errors.unitIssue) ? <FormHelperText error>{errors.unitIssue}</FormHelperText> : null}
										</FormControl>
									</Grid>
								) : null}

								<Grid className="pd-rowGridFormLabelControl" style={{ marginBottom: 12 }} container spacing={2}>
									{values.unitIssue !== 'pce' ? (
										<Grid xs={6} item>
											<Field
												name="quantity"
												type="number"
												label={`Количество ${values.receiptUnits === 'nmp' && values.unitIssue !== 'pce' ? 'упаковок' : 'штук'}:`}
												placeholder="0"
												component={TextField}
												InputLabelProps={{
													shrink: true,
												}}
												autoComplete="off"
												disabled={actionType === 'edit'}
												fullWidth
											/>
										</Grid>
									) : (
										<Grid xs={values.receiptUnits === 'nmp' && values.unitIssue === 'pce' ? 4 : 6} item>
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
												disabled={actionType === 'edit'}
												fullWidth
											/>
										</Grid>
									)}

									{values.receiptUnits === 'nmp' && values.unitIssue === 'pce' ? (
										<Grid xs={4} item>
											<Field
												name="quantityInUnit"
												type="number"
												label="Штук в упаковке:"
												placeholder="0"
												component={TextField}
												InputLabelProps={{
													shrink: true,
												}}
												inputProps={{
													onChange: event => {
														const { value } = event.target;

														setFieldValue('quantityInUnit', +value);
														setFieldValue('unitSellingPrice', +((values.purchasePrice || 0) / value).toFixed(2));
													},
												}}
												autoComplete="off"
												fullWidth
											/>
										</Grid>
									) : null}

									<Grid xs={values.receiptUnits === 'nmp' && values.unitIssue === 'pce' ? 4 : 6} item>
										<Field
											name="minimumBalance"
											type="number"
											label={`Мин. остаток в ${
												values.receiptUnits === 'nmp' && values.unitIssue !== 'pce' ? 'упаковках' : 'штуках'
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
								</Grid>

								<Divider style={{ marginBottom: 20 }} />

								<Grid className="pd-rowGridFormLabelControl" style={{ marginBottom: -20 }} container spacing={2}>
									<Grid xs={6} item>
										<Field
											name="purchasePrice"
											type="number"
											label={`Цена закупки${values.receiptUnits === 'nmp' && values.unitIssue === 'pce' ? ' упаковки' : ''}:`}
											placeholder="0"
											component={TextField}
											InputLabelProps={{
												shrink: true,
											}}
											inputProps={
												values.receiptUnits === 'nmp' && values.unitIssue === 'pce'
													? {
															onChange: event => {
																const { value } = event.target;

																setFieldValue('purchasePrice', +value);
																setFieldValue('unitSellingPrice', +(value / (values.quantityInUnit || 0)).toFixed(2));
															},
													  }
													: {}
											}
											autoComplete="off"
											fullWidth
										/>
									</Grid>

									{!values.freeProduct ? (
										<Grid xs={6} item>
											{values.unitIssue !== 'pce' ? (
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
											) : (
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
											)}
										</Grid>
									) : null}
								</Grid>

								<Grid className="pd-rowGridFormLabelControl" style={{ marginBottom: 12 }}>
									<Field
										name="freeProduct"
										Label={{ label: 'Предоставляется бесплатно' }}
										component={CheckboxWithLabel}
										color="primary"
										icon={<FontAwesomeIcon icon={['far', 'square']} />}
										checkedIcon={<FontAwesomeIcon icon={['fas', 'check-square']} />}
										inputProps={{
											onChange: event => {
												const { checked } = event.target;

												setFieldValue('freeProduct', checked);
												setFieldValue('sellingPrice', checked ? values.sellingPrice : '');
											},
										}}
									/>
								</Grid>

								<Divider style={{ marginBottom: 20 }} />

								<Grid className="pd-rowGridFormLabelControl" wrap="nowrap" container>
									<FormLabel error={Boolean(errors.shopId)} style={{ minWidth: 108 }}>
										Магазин:
									</FormLabel>
									<FormControl fullWidth>
										<Field
											name="shopId"
											component={SelectAutocompleteCreate}
											TextFieldProps={{
												error: Boolean(errors.shopId),
											}}
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
											noOptionsMessage={() => 'Не создано ни одного магазина, введите название, чтобы создать'}
											formatCreateLabel={value => `Создать «${value}»`}
											options={currentStock.productShops}
										/>
										{Boolean(errors.shopId) ? <FormHelperText error>{errors.shopId}</FormHelperText> : null}
									</FormControl>
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
																name={`specifications.${index}.nameId`}
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
																	setFieldValue(`specifications.${index}.nameId`, option ? option._id : '');

																	if (action === 'select-option' || action === 'clear')
																		setFieldValue(`specifications.${index}.valueId`, '');
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
																<FormHelperText error>{errors.specifications[index].nameId}</FormHelperText>
															) : null}
														</Grid>

														<Grid xs={6} item>
															<Grid container spacing={2} alignItems="flex-start">
																<Grid xs={10} item style={{ flexBasis: 'calc(100% - 48px)', maxWidth: 'calc(100% - 48px)' }}>
																	<Field
																		name={`specifications.${index}.valueId`}
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
																			setFieldValue(`specifications.${index}.valueId`, option ? option._id : '')
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
																		<FormHelperText error>{errors.specifications[index].valueId}</FormHelperText>
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
	const { currentStock } = ownProps;

	return {
		getStockStatus: () => dispatch(getStockStatus(currentStock._id)),
		createProductShop: values => dispatch(createProductShop(currentStock._id, values)),
		createProductSpecification: (schemaName, values) =>
			dispatch(createProductSpecification(currentStock._id, schemaName, values)),
		createProduct: values => dispatch(createProduct(currentStock._id, values)),
		editProduct: (productId, newValues) => dispatch(editProduct(productId, newValues)),
	};
};

export default connect(
	null,
	mapDispatchToProps
)(CreateEditProduct);
