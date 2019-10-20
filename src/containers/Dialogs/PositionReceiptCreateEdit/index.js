import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import validator from 'validator';

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
import MuiTextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import translitRu from 'shared/translit/ru';
import { unitTypes, unitTypeTransform, characteristicTypeTransform } from 'shared/checkPositionAndReceipt';

import { onAddCharacteristicInPosition, checkCharacteristicsOnAbsenceInPosition, onUnitSellingPriceCalc } from 'src/helpers/positionUtils';

import { PDDialog, PDDialogTitle, PDDialogActions } from 'src/components/Dialog';
import { SelectAutocompleteCreate } from 'src/components/selectAutocomplete';
import { SelectField } from 'src/components/SelectField';
import Chips from 'src/components/Chips';

import { getStockStatus } from 'src/actions/stocks';
import { createCharacteristic } from 'src/actions/characteristics';
import { createPositionReceipt, editPositionReceipt } from 'src/actions/positions';

import positionSchema from './positionSchema';

import stylesGlobal from 'src/styles/globals.module.css';
import styles from './index.module.css';

let shopNameFieldTimer;

class DialogPositionReceiptCreateEdit extends Component {
	static propTypes = {
		type: PropTypes.oneOf(['create', 'edit']).isRequired,
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		onExitedDialog: PropTypes.func,
		currentStockId: PropTypes.string.isRequired,
		selectedPosition: PropTypes.object,
	};

	initialState = {
		isLoadingCharacteristics: false,
		shopLinkVisible: false,
	};

	state = this.initialState;

	onCreateCharacteristic = (values, setFieldValue) => {
		this.setState({ isLoadingCharacteristics: true }, () => {
			this.props.createCharacteristic(values).then(response => {
				const characteristic = response.data;

				this.setState({ isLoadingCharacteristics: false });

				setFieldValue('characteristicTemp.value', characteristic);
			});
		});
	};

	onChangeShopFields = (value, setFieldValue) => {
		setFieldValue('shopName', value);

		clearTimeout(shopNameFieldTimer);

		shopNameFieldTimer = setTimeout(() => {
			if (validator.isURL(value)) {
				setFieldValue('shopName', '');
				setFieldValue('shopLink', value);

				this.setState({ shopLinkVisible: true });
			}
		}, 300);
	};

	onPositionCreate = (values, actions) => {
		const { type, onCloseDialog, positionAndReceipt = positionSchema(type, true).cast(values) } = this.props;

		const {
			quantity,
			quantityPackages,
			quantityInUnit,
			purchasePrice,
			sellingPrice,
			unitSellingPrice,
			shopName,
			shopLink,
			...position
		} = positionAndReceipt;

		let receipt = {
			initial: {},
		};

		if (!isNaN(quantity)) receipt.initial.quantity = quantity;
		if (!isNaN(quantityPackages)) receipt.initial.quantityPackages = quantityPackages;
		if (!isNaN(quantityInUnit)) receipt.quantityInUnit = quantityInUnit;
		if (!isNaN(purchasePrice)) receipt.purchasePrice = purchasePrice;
		if (!isNaN(sellingPrice)) receipt.sellingPrice = sellingPrice;
		if (!isNaN(unitSellingPrice)) receipt.unitSellingPrice = unitSellingPrice;
		receipt.shopName = shopName;
		receipt.shopLink = shopLink;

		this.props.createPositionReceipt(position, receipt).then(response => {
			if (response.status === 'success') {
				this.props.getStockStatus();
				onCloseDialog();
			} else actions.setSubmitting(false);
		});
	};

	onPositionEdit = (values, actions) => {
		const {
			type,
			onCloseDialog,
			selectedPosition: {
				activeReceipt: {
					quantityInUnit: quantityInUnitOld,
					purchasePrice: purchasePriceOld,
					sellingPrice: sellingPriceOld,
					unitSellingPrice: unitSellingPriceOld,
					shopName: shopNameOld,
					shopLink: shopLinkOld,
				},
			},
			positionAndReceipt = positionSchema(type, true).cast(values),
		} = this.props;

		const {
			activeReceipt,
			receipts,
			quantityInUnit,
			purchasePrice,
			sellingPrice,
			unitSellingPrice,
			shopName,
			shopLink,
			...position
		} = positionAndReceipt;

		let receipt = {};

		if (!isNaN(quantityInUnit) && quantityInUnit !== quantityInUnitOld) receipt.quantityInUnit = quantityInUnit;
		if (!isNaN(purchasePrice) && purchasePrice !== purchasePriceOld) receipt.purchasePrice = purchasePrice;
		if (!isNaN(sellingPrice) && sellingPrice !== sellingPriceOld) receipt.sellingPrice = sellingPrice;
		if (!isNaN(unitSellingPrice) && unitSellingPrice !== unitSellingPriceOld) receipt.unitSellingPrice = unitSellingPrice;
		if (!validator.equals(shopName, shopNameOld)) receipt.shopName = shopName;
		if (!validator.equals(shopLink, shopLinkOld)) receipt.shopLink = shopLink;

		this.props.editPositionReceipt(position._id, position, receipt).then(response => {
			if (response.status === 'success') {
				this.props.getStockStatus();
				onCloseDialog();
			} else actions.setSubmitting(false);
		});
	};

	onEnterDialog = () => {
		const { type, selectedPosition } = this.props;

		if (type === 'edit' && selectedPosition) {
			if (validator.isURL(selectedPosition.activeReceipt.shopLink)) this.setState({ shopLinkVisible: true });
		}
	};

	onExitedDialog = () => {
		const { onExitedDialog } = this.props;

		this.setState(this.initialState, () => {
			if (onExitedDialog) onExitedDialog();
		});
	};

	render() {
		const { type, dialogOpen, onCloseDialog, currentStockId, characteristics, selectedPosition } = this.props;
		const { isLoadingCharacteristics, shopLinkVisible } = this.state;

		if (type === 'edit' && !selectedPosition) return null;

		let initialValues =
			type === 'create'
				? {
						name: '',
						divided: true,
						unitReceipt: '',
						unitIssue: '',
						minimumBalance: '',
						isFree: false,
						shopName: '',
						shopLink: '',
						characteristics: [],
						characteristicTemp: {
							type: '',
							value: '',
							valueTemp: '',
						},
						quantity: '',
						quantityPackages: '',
						quantityInUnit: '',
						purchasePrice: '',
						sellingPrice: '',
						unitSellingPrice: '',
				  }
				: {
						characteristicTemp: {
							type: '',
							value: '',
							valueTemp: '',
						},
						quantityInUnit: selectedPosition.activeReceipt.quantityInUnit,
						purchasePrice: selectedPosition.activeReceipt.purchasePrice,
						sellingPrice: selectedPosition.activeReceipt.sellingPrice,
						unitSellingPrice: selectedPosition.activeReceipt.unitSellingPrice,
						shopName: selectedPosition.activeReceipt.shopName,
						shopLink: selectedPosition.activeReceipt.shopLink,
						...selectedPosition,
				  };

		return (
			<PDDialog
				open={dialogOpen}
				onEnter={this.onEnterDialog}
				onClose={onCloseDialog}
				onExited={this.onExitedDialog}
				maxWidth="lg"
				scroll="body"
				stickyActions
			>
				<PDDialogTitle theme="primary" onClose={onCloseDialog}>
					{type === 'create' ? 'Создание новой позиции' : 'Редактирование позиции'}
				</PDDialogTitle>
				<Formik
					initialValues={initialValues}
					validationSchema={() => positionSchema(type)}
					validateOnBlur={false}
					validateOnChange={false}
					onSubmit={(values, actions) =>
						type === 'create' ? this.onPositionCreate(values, actions) : this.onPositionEdit(values, actions)
					}
					render={({ errors, isSubmitting, values, setFieldValue }) => (
						<Form>
							<DialogContent>
								<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" container>
									<InputLabel error={Boolean(errors.name)} style={{ minWidth: 146 }}>
										Наименование:
									</InputLabel>
									<Field name="name" component={TextField} autoFocus fullWidth />
								</Grid>

								<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" container>
									<InputLabel error={Boolean(errors.unitReceipt)} style={{ minWidth: 146 }}>
										Единица поступления:
									</InputLabel>
									{type === 'create' ? (
										<FormControl fullWidth>
											<SelectField
												name="unitReceipt"
												inputProps={{
													onChange: ({ target: { value } }) => {
														setFieldValue('unitReceipt', value);

														if (value === 'pce') setFieldValue('unitIssue', value);
													},
												}}
												error={Boolean(errors.unitReceipt)}
											>
												<MenuItem value="" disabled>
													Выберите
												</MenuItem>
												{unitTypes.map((unitType, index) => (
													<MenuItem key={index} value={unitType}>
														{unitTypeTransform(unitType)}
													</MenuItem>
												))}
											</SelectField>
											{Boolean(errors.unitReceipt) ? <FormHelperText error>{errors.unitReceipt}</FormHelperText> : null}
										</FormControl>
									) : (
										<MuiTextField name="unitReceipt" defaultValue={unitTypeTransform(values.unitReceipt)} disabled fullWidth />
									)}
								</Grid>

								<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" container>
									<InputLabel error={Boolean(errors.unitIssue)} style={{ minWidth: 146 }}>
										Единица отпуска:
									</InputLabel>
									{type === 'create' ? (
										<FormControl fullWidth>
											<SelectField
												name="unitIssue"
												inputProps={{
													onChange: ({ target: { value } }) => {
														setFieldValue('unitIssue', value);

														if (value === 'nmp') setFieldValue('unitReceipt', value);
													},
												}}
												error={Boolean(errors.unitIssue)}
											>
												<MenuItem value="" disabled>
													Выберите
												</MenuItem>
												{unitTypes.map((unitType, index) => (
													<MenuItem key={index} value={unitType}>
														{unitTypeTransform(unitType)}
													</MenuItem>
												))}
											</SelectField>
											{Boolean(errors.unitIssue) ? <FormHelperText error>{errors.unitIssue}</FormHelperText> : null}
										</FormControl>
									) : (
										<MuiTextField name="unitIssue" defaultValue={unitTypeTransform(values.unitIssue)} disabled fullWidth />
									)}
								</Grid>

								<Grid className={stylesGlobal.formLabelControl} style={{ marginBottom: 12 }} container spacing={2}>
									{values.unitReceipt === 'pce' || values.unitIssue !== 'pce' ? (
										<Grid xs={6} item>
											{type === 'create' ? (
												<Field
													name="quantity"
													type="number"
													label={`Количество ${values.unitReceipt === 'nmp' && values.unitIssue !== 'pce' ? 'упаковок' : 'штук'}:`}
													placeholder="0"
													component={TextField}
													fullWidth
												/>
											) : (
												<MuiTextField
													name="quantity"
													label={`Количество ${values.unitReceipt === 'nmp' && values.unitIssue !== 'pce' ? 'упаковок' : 'штук'}:`}
													defaultValue={values.activeReceipt.current.quantity}
													disabled
													fullWidth
												/>
											)}
										</Grid>
									) : (
										<Grid xs={values.unitReceipt === 'nmp' && values.unitIssue === 'pce' ? 4 : 6} item>
											{type === 'create' ? (
												<Field
													name="quantityPackages"
													type="number"
													label="Количество упаковок:"
													placeholder="0"
													component={TextField}
													fullWidth
												/>
											) : (
												<MuiTextField
													name="quantityPackages"
													label="Количество упаковок:"
													defaultValue={Math.ceil(values.activeReceipt.current.quantityPackages)}
													disabled
													fullWidth
												/>
											)}
										</Grid>
									)}

									{values.unitReceipt === 'nmp' && values.unitIssue === 'pce' ? (
										<Grid xs={4} item>
											<Field
												name="quantityInUnit"
												type="number"
												label="Штук в упаковке:"
												placeholder="0"
												component={TextField}
												inputProps={{
													onChange: ({ target: { value } }) => onUnitSellingPriceCalc(value, 'quantityInUnit', values, setFieldValue),
												}}
												disabled={type === 'edit'}
												fullWidth
											/>
										</Grid>
									) : null}

									<Grid xs={values.unitReceipt === 'nmp' && values.unitIssue === 'pce' ? 4 : 6} item>
										{values.divided ? (
											<Field
												name="minimumBalance"
												type="number"
												label={`Мин. остаток в ${values.unitReceipt === 'nmp' && values.unitIssue !== 'pce' ? 'упаковках' : 'штуках'}:`}
												placeholder="0"
												component={TextField}
												fullWidth
											/>
										) : (
											<Grid alignItems="flex-end" style={{ height: '100%', paddingBottom: 1 }} container>
												<Typography variant="caption">Вы можете изменить минимальный остаток в группе позиции.</Typography>
											</Grid>
										)}
									</Grid>
								</Grid>

								<Grid
									className={stylesGlobal.formLabelControl}
									alignItems={values.isFree ? (Boolean(errors.purchasePrice) && values.isFree ? 'center' : 'flex-end') : 'stretch'}
									spacing={2}
									style={{ marginBottom: 12 }}
									container
								>
									<Grid xs={6} item>
										<Field
											name="purchasePrice"
											type="number"
											label={`Цена закупки${values.unitReceipt === 'nmp' && values.unitIssue === 'pce' ? ' упаковки' : ''}:`}
											placeholder="0"
											component={TextField}
											inputProps={
												values.unitReceipt === 'nmp' && values.unitIssue === 'pce'
													? {
															onChange: ({ target: { value } }) => onUnitSellingPriceCalc(value, 'purchasePrice', values, setFieldValue),
													  }
													: {
															onChange: ({ target: { value } }) => {
																setFieldValue('purchasePrice', value);
																setFieldValue('sellingPrice', value);
															},
													  }
											}
											fullWidth
										/>
									</Grid>

									<Grid xs={6} item>
										{!values.isFree ? (
											values.unitReceipt === 'nmp' && values.unitIssue === 'pce' ? (
												<Field
													name="unitSellingPrice"
													type="number"
													label="Цена продажи штуки:"
													placeholder="0"
													component={TextField}
													fullWidth
												/>
											) : (
												<Field
													name="sellingPrice"
													type="number"
													label="Цена продажи:"
													placeholder={String(values.purchasePrice || 0)}
													component={TextField}
													fullWidth
												/>
											)
										) : null}

										<Field name="isFree" Label={{ label: 'Бесплатный отпуск позиции' }} component={CheckboxWithLabel} />
									</Grid>
								</Grid>

								<Grid
									className={stylesGlobal.formLabelControl}
									style={{ marginBottom: 12 }}
									wrap="nowrap"
									alignItems="flex-start"
									spacing={2}
									container
								>
									<Grid className={stylesGlobal.formLabelControl} xs={shopLinkVisible ? 6 : 12} style={{ marginBottom: 0 }} item>
										<InputLabel error={Boolean(errors.shopLink)} style={{ display: 'inline-flex', minWidth: 146 }}>
											Магазин / Ссылка:
										</InputLabel>
										<Field
											name="shopName"
											component={TextField}
											placeholder={shopLinkVisible ? 'Название' : 'Ссылка на товар или название магазина'}
											inputProps={{
												onChange: ({ target: { value } }) => this.onChangeShopFields(value, setFieldValue),
											}}
											style={{ width: 'calc(100% - 156px)' }}
											fullWidth
										/>
									</Grid>
									{shopLinkVisible ? (
										<Grid className={stylesGlobal.formLabelControl} xs={6} style={{ marginBottom: 0 }} item>
											<Field
												name="shopLink"
												component={TextField}
												placeholder="Ссылка на товар"
												autoFocus={type === 'create'}
												style={{ width: 'calc(100% - 42px)' }}
												fullWidth
											/>
											<div className={styles.externalLink}>
												<IconButton
													aria-haspopup="true"
													size="small"
													disabled={!validator.isURL(values.shopLink)}
													disableRipple
													disableFocusRipple
												>
													{validator.isURL(values.shopLink) ? (
														<a
															// eslint-disable-next-line
															href={!~values.shopLink.search(/^http[s]?\:\/\//) ? `//${values.shopLink}` : `${values.shopLink}`}
															target="_blank"
															rel="noreferrer noopener"
														>
															<FontAwesomeIcon icon={['fal', 'external-link-square']} />
														</a>
													) : (
														<FontAwesomeIcon icon={['fal', 'external-link-square']} />
													)}
												</IconButton>
											</div>
										</Grid>
									) : null}
								</Grid>

								<FieldArray
									name="characteristics"
									validateOnChange={false}
									render={arrayHelpersCharacteristics => (
										<Grid>
											{values.characteristics.length ? (
												<Grid
													className={stylesGlobal.formLabelControl}
													style={{ marginBottom: 11 }}
													wrap="nowrap"
													alignItems="flex-start"
													container
												>
													<InputLabel style={{ display: 'inline-flex', minWidth: 146 }}>Характеристики:</InputLabel>
													<Grid style={{ marginTop: 7, width: 'calc(100% - 120px)' }} container>
														<Chips
															chips={values.characteristics}
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

											{checkCharacteristicsOnAbsenceInPosition(values).length ? (
												<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" spacing={2} container>
													<Grid className={stylesGlobal.formLabelControl} xs={6} style={{ marginBottom: 0 }} item>
														{!values.characteristics.length ? (
															<InputLabel style={{ display: 'inline-flex', minWidth: 146 }}>Характеристики:</InputLabel>
														) : (
															<InputLabel style={{ display: 'inline-flex', minWidth: 146 }} />
														)}
														<FormControl style={{ width: 'calc(100% - 156px)' }}>
															<SelectField
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
															>
																<MenuItem value="" disabled>
																	Выберите
																</MenuItem>
																{checkCharacteristicsOnAbsenceInPosition(values).map((characteristicType, index) => (
																	<MenuItem key={index} value={characteristicType}>
																		{characteristicTypeTransform(characteristicType)}
																	</MenuItem>
																))}
															</SelectField>
														</FormControl>
													</Grid>

													<Grid xs={6} item>
														<FormControl style={{ width: 'calc(100% - 42px)' }}>
															<Field
																name="characteristicTemp.value"
																component={SelectAutocompleteCreate}
																isClearable
																isDisabled={isSubmitting || isLoadingCharacteristics || !values.characteristicTemp.type}
																isLoading={isLoadingCharacteristics}
																value={values.characteristicTemp.value}
																inputValue={values.characteristicTemp.valueTemp}
																onChange={option => {
																	setFieldValue('characteristicTemp.value', option || '');

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
																			stock: currentStockId,
																			type: values.characteristicTemp.type,
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
																options={characteristics.filter(value => value.type === values.characteristicTemp.type)}
															/>
														</FormControl>
														<div className={styles.addCharacteristic}>
															<IconButton
																aria-haspopup="true"
																size="small"
																onClick={() => onAddCharacteristicInPosition(values, setFieldValue, arrayHelpersCharacteristics)}
																disabled={values.characteristicTemp.type === '' || values.characteristicTemp.value === ''}
																disableRipple
																disableFocusRipple
															>
																<FontAwesomeIcon icon={['fal', 'check-circle']} />
															</IconButton>
														</div>
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
										onClick: onCloseDialog,
									},
									text: 'Отмена',
								}}
								rightHandleProps={{
									handleProps: {
										type: 'submit',
										disabled: isSubmitting,
									},
									text: isSubmitting ? <CircularProgress size={20} /> : type === 'create' ? 'Создать' : 'Сохранить',
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
	const { currentStockId } = ownProps;

	return {
		getStockStatus: () => dispatch(getStockStatus(currentStockId)),
		createCharacteristic: values => dispatch(createCharacteristic(values)),
		createPositionReceipt: (position, receipt) => dispatch(createPositionReceipt(currentStockId, position, receipt)),
		editPositionReceipt: (positionId, position, receipt) => dispatch(editPositionReceipt(positionId, position, receipt)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DialogPositionReceiptCreateEdit);
