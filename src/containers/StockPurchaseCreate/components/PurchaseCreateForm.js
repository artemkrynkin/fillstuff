import React, { Component, createRef } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import queryString from 'query-string';
import ClassNames from 'classnames';
import moment from 'moment';
import loadable from '@loadable/component';

import { Formik, Form, Field, FieldArray } from 'formik';
import { CheckboxWithLabel, InputBase, TextField } from 'formik-material-ui';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputLabel from '@material-ui/core/InputLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import MenuItem from '@material-ui/core/MenuItem';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import { memberRoleTransform } from 'shared/roles-access-rights';

import { history } from 'src/helpers/history';

// import CardPaper from 'src/components/CardPaper';
import NumberFormat, { currencyFormatProps, currencyFormatInputProps } from 'src/components/NumberFormat';
import { SelectAutocomplete } from 'src/components/selectAutocomplete';
import Dropdown from 'src/components/Dropdown';
import CardPaper from 'src/components/CardPaper';

import { getCharacteristics } from 'src/actions/characteristics';
import { getPositions } from 'src/actions/positions';

import purchaseSchema from './purchaseSchema';

import stylesGlobal from 'src/styles/globals.module.css';
import styles from './PurchaseCreateForm.module.css';
import FormControl from '@material-ui/core/FormControl';
import MuiTextField from '@material-ui/core/TextField/TextField';

const DialogPositionCreate = loadable(() =>
	import('src/containers/Dialogs/PositionCreateEdit' /* webpackChunkName: "Dialog_PositionCreateEdit" */)
);

const initialValues = {
	shopName: '',
	fare: '',
	date: new Date(),
	positions: [
		{
			position: '',
			positionTemp: '',
			receipt: {
				quantity: '',
				quantityPackages: '',
				quantityInUnit: '',
				purchasePrice: '',
				sellingPrice: '',
				unitSellingPrice: '',
			},
		},
	],
};

class PurchaseCreateForm extends Component {
	state = {
		dropdownDate: false,
		dialogPositionCreate: false,
		dialogPositionCreateInitialValues: {},
		isLoadingCharacteristics: false,
	};

	refDropdownDate = createRef();

	handlerDropdown = ({ name, value }) => this.setState({ [name]: value === null || value === undefined ? !this.state[name] : value });

	onOpenDialogPositionCreate = async initialValues => {
		await this.props.getCharacteristics();

		this.setState({
			dialogPositionCreate: true,
			dialogPositionCreateInitialValues: initialValues,
		});
	};

	onCloseDialogPositionCreate = () => this.setState({ dialogPositionCreate: false });

	onChangeDate = (date, setFieldValue) => setFieldValue('date', date);

	componentDidMount() {
		this.props.getPositions();
	}

	render() {
		const {
			currentStock,
			positions: {
				data: positions,
				isFetching: isLoadingPositions,
				// error: errorPositions
			},
		} = this.props;
		const { dropdownDate, dialogPositionCreate, dialogPositionCreateInitialValues, isLoadingCharacteristics } = this.state;

		return (
			<CardPaper elevation={1} header={false}>
				<Formik
					initialValues={initialValues}
					validationSchema={purchaseSchema}
					validateOnBlur={false}
					validateOnChange={false}
					enableReinitialize
					onSubmit={(values, actions) => this.onSubmit(values, actions)}
					render={({ errors, isSubmitting, values, setFieldValue }) => {
						console.log(values);

						return (
							<Form className={styles.form}>
								<Grid className={stylesGlobal.formLabelControl} alignItems="center" style={{ marginBottom: 12 }} container>
									<InputLabel>Дата покупки:</InputLabel>
									<ButtonBase
										ref={this.refDropdownDate}
										className={styles.filterButtonLink}
										onClick={() => this.handlerDropdown({ name: 'dropdownDate' })}
										disableRipple
									>
										{moment(values.date).format('DD MMMM YYYY')}
										<FontAwesomeIcon icon={['far', 'angle-down']} />
									</ButtonBase>

									{/* Dropdown Date */}
									<Dropdown
										anchor={this.refDropdownDate}
										open={dropdownDate}
										onClose={() => this.handlerDropdown({ name: 'dropdownDate' })}
										placement="bottom-start"
										offset={10}
									>
										<Grid alignItems="center" container>
											<MuiPickersUtilsProvider utils={MomentUtils}>
												<DatePicker
													label="Дата покупки:"
													variant="static"
													value={values.date}
													format="DD MMMM YYYY"
													onChange={date => this.onChangeDate(date, setFieldValue)}
													disableToolbar
												/>
											</MuiPickersUtilsProvider>
										</Grid>
									</Dropdown>
								</Grid>

								<Grid className={stylesGlobal.formLabelControl} spacing={2} style={{ marginBottom: 12 }} container>
									<Grid xs={9} item>
										<Field name="shopName" label="Название магазина:" component={TextField} autoFocus fullWidth />
									</Grid>
									<Grid xs={3} item>
										<Field
											name="fare"
											label="Транспортные расходы:"
											placeholder="0 ₽"
											component={TextField}
											InputProps={{
												inputComponent: NumberFormat,
												inputProps: {
													...currencyFormatInputProps,
												},
											}}
											fullWidth
										/>
									</Grid>
								</Grid>

								<FieldArray
									name="positions"
									render={arrayHelpers =>
										values.positions && values.positions.length > 0
											? values.positions.map((position, index) => (
													<div key={index}>
														<Grid
															className={stylesGlobal.formLabelControl}
															spacing={2}
															alignItems="flex-end"
															style={{ marginBottom: 12 }}
															container
														>
															<Grid xs={9} item>
																<FormControl fullWidth>
																	<InputLabel>Позиция:</InputLabel>
																	<Field
																		name={`positions.${index}.position`}
																		component={SelectAutocomplete}
																		isClearable
																		isDisabled={isSubmitting || isLoadingCharacteristics}
																		isLoading={isLoadingCharacteristics}
																		value={values.positions[index].position}
																		inputValue={values.positions[index].positionTemp}
																		onChange={option => {
																			setFieldValue(`positions.${index}.position`, option);

																			if (values.positions[index].positionTemp) {
																				setFieldValue(`positions.${index}.positionTemp`, '');
																			}
																		}}
																		onInputChange={(value, { action }) => {
																			if (action !== 'input-blur' && action !== 'menu-close') {
																				setFieldValue(`positions.${index}.positionTemp`, value);

																				if (values.positions[index].position) {
																					setFieldValue(`positions.${index}.position`, '');
																				}
																			}
																		}}
																		menuPlacement="auto"
																		menuPosition="fixed"
																		placeholder="Выберите позицию"
																		noOptionsMessage={() => 'Не создано ни одной позиции'}
																		options={positions}
																	/>
																</FormControl>
															</Grid>
															<Grid xs={3} item>
																<Button onClick={this.onOpenDialogPositionCreate} variant="outlined" color="primary" fullWidth>
																	Создать позицию
																</Button>
															</Grid>
														</Grid>

														{values.positions[index].position ? (
															<Grid
																className={stylesGlobal.formLabelControl}
																spacing={2}
																alignItems="flex-end"
																style={{ marginBottom: 12 }}
																container
															>
																{position.unitReceipt === 'pce' || position.unitIssue !== 'pce' ? (
																	<Grid xs={6} item>
																		<Field
																			name={`positions.${index}.position.receipt.quantity`}
																			type="number"
																			label={`Количество ${
																				position.unitReceipt === 'nmp' && position.unitIssue !== 'pce' ? 'упаковок' : 'штук'
																			}:`}
																			placeholder="0"
																			component={TextField}
																			fullWidth
																		/>
																	</Grid>
																) : (
																	<Grid xs={6} item>
																		<Field
																			name={`positions.${index}.position.receipt.quantityPackages`}
																			type="number"
																			label="Количество упаковок:"
																			placeholder="0"
																			component={TextField}
																			fullWidth
																		/>
																	</Grid>
																)}
																{position.unitReceipt === 'nmp' && position.unitIssue === 'pce' ? (
																	<Grid xs={4} item>
																		<Field
																			name={`positions.${index}.position.receipt.quantityInUnit`}
																			type="number"
																			label="Штук в упаковке:"
																			placeholder="0"
																			component={TextField}
																			// inputProps={{
																			//   onChange: ({ target: { value } }) => onUnitSellingPriceCalc(value, 'quantityInUnit', values, setFieldValue),
																			// }}
																			fullWidth
																		/>
																	</Grid>
																) : null}
															</Grid>
														) : null}

														<Grid justify="center" container>
															<Button variant="text" startIcon={<FontAwesomeIcon icon={['far', 'plus']} />}>
																Позиция по чеку
															</Button>
														</Grid>
													</div>
											  ))
											: null
									}
								/>
							</Form>
						);
					}}
				/>

				<DialogPositionCreate
					type="create"
					dialogOpen={dialogPositionCreate}
					onCloseDialog={this.onCloseDialogPositionCreate}
					currentStockId={currentStock._id}
					shareInitialValues={dialogPositionCreateInitialValues}
				/>
			</CardPaper>
		);
	}
}

const mapStateToProps = state => {
	if (state.positions.data && state.positions.data.length > 0) {
		state.positions.data = state.positions.data.map(position => {
			return {
				...position,
				label: position.name,
				value: position._id,
			};
		});
	}

	return {
		positions: state.positions,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStock } = ownProps;

	return {
		getCharacteristics: () => dispatch(getCharacteristics(currentStock._id)),
		getPositions: () => dispatch(getPositions(currentStock._id)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PurchaseCreateForm);
