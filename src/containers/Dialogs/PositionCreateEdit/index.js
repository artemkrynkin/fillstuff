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
import { unitTypes, unitTypeTransform, characteristicTypeTransform } from 'shared/checkPositionAndReceipt';

import { onAddCharacteristicInPosition, checkCharacteristicsOnAbsenceInPosition } from 'src/helpers/positionUtils';

import { PDDialog, PDDialogTitle, PDDialogActions } from 'src/components/Dialog';
import { SelectAutocompleteCreate } from 'src/components/selectAutocomplete';
import { SelectField } from 'src/components/SelectField';
import Chips from 'src/components/Chips';

import { getStockStatus } from 'src/actions/stocks';
import { createCharacteristic } from 'src/actions/characteristics';
import { createPosition, editPosition } from 'src/actions/positions';

import positionSchema from './positionSchema';

import stylesGlobal from 'src/styles/globals.module.css';
import styles from './index.module.css';

class DialogPositionCreateEdit extends Component {
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

	onPositionCreateEdit = (values, actions) => {
		const { type, onCloseDialog, position = positionSchema(true).cast(values) } = this.props;

		if (type === 'create') {
			this.props.createPosition(position).then(response => {
				if (response.status === 'success') {
					this.props.getStockStatus();
					onCloseDialog();
				} else actions.setSubmitting(false);
			});
		} else {
			this.props.editPosition(position._id, position).then(response => {
				if (response.status === 'success') {
					this.props.getStockStatus();
					onCloseDialog();
				} else actions.setSubmitting(false);
			});
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
		const { isLoadingCharacteristics } = this.state;

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
						characteristics: [],
						characteristicTemp: {
							type: '',
							value: '',
							valueTemp: '',
						},
				  }
				: {
						characteristicTemp: {
							type: '',
							value: '',
							valueTemp: '',
						},
						...selectedPosition,
				  };

		return (
			<PDDialog open={dialogOpen} onClose={onCloseDialog} onExited={this.onExitedDialog} maxWidth="lg" scroll="body" stickyActions>
				<PDDialogTitle theme="primary" onClose={onCloseDialog}>
					{type === 'create' ? 'Создание новой позиции' : 'Редактирование позиции'}
				</PDDialogTitle>
				<Formik
					initialValues={initialValues}
					validationSchema={() => positionSchema()}
					validateOnBlur={false}
					validateOnChange={false}
					onSubmit={(values, actions) => this.onPositionCreateEdit(values, actions)}
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
								</Grid>

								<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" container>
									<InputLabel error={Boolean(errors.unitIssue)} style={{ minWidth: 146 }}>
										Единица отпуска:
									</InputLabel>
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
										<Field name="isFree" Label={{ label: 'Бесплатный отпуск позиции' }} component={CheckboxWithLabel} />
									</FormControl>
								</Grid>

								<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" container>
									<InputLabel error={Boolean(errors.unitIssue)} style={{ minWidth: 146 }}>
										Мин. остаток
										<br />
										{`в ${values.unitReceipt === 'nmp' && values.unitIssue !== 'pce' ? 'упаковках' : 'штуках'}:`}
									</InputLabel>
									<Field name="minimumBalance" type="number" placeholder="0" component={TextField} fullWidth />
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
		createPosition: position => dispatch(createPosition(currentStockId, position)),
		editPosition: (positionId, position) => dispatch(editPosition(positionId, position)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DialogPositionCreateEdit);
