import React, { Component, createRef } from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import queryString from 'query-string';
import ClassNames from 'classnames';

import { Formik, Form, Field } from 'formik';
import { InputBase } from 'formik-material-ui';

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
// import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
// import MomentUtils from "@date-io/moment";

import { memberRoleTransform } from 'shared/roles-access-rights';

import { history } from 'src/helpers/history';

// import CardPaper from 'src/components/CardPaper';
import Dropdown from 'src/components/Dropdown';
import NumberFormat from 'src/components/NumberFormat';

import toolbarFilterSchema from './toolbarFilterSchema';

import { SearchTextField } from './Toolbar.styles';
import styles from './Toolbar.module.css';

const initialValues = {
	number: '',
	amountFrom: '',
	amountTo: '',
	amountFromView: '',
	amountToView: '',
	// dateFrom: '',
	// dateTo: '',
	shopName: '',
	shopNameView: '',
	role: 'all',
};

const amountNumberFormat = {
	thousandSeparator: ' ',
	decimalScale: 2,
	allowNegative: false,
	suffix: ' ₽',
	isAllowed: values => {
		const { formattedValue, floatValue } = values;
		return formattedValue === '' || floatValue <= 9999999;
	},
};

const roles = ['all', 'owners', 'admins'];

const filterRoleTransform = (roleSelected, members) => {
	switch (roleSelected) {
		case 'all':
			return 'Все роли';
		case 'owners':
			return 'Только владельцы';
		case 'admins':
			return 'Только администраторы';
		default:
			return members.find(member => member.user._id === roleSelected).user.name;
	}
};

const DropdownFooter = props => {
	const { onResetHandler, isSubmitting } = props;

	return (
		<Grid className={styles.dropdownFooter} alignItems="center" justify="center" container>
			<Grid className={styles.dropdownFooterColumn} item>
				<Button onClick={onResetHandler} disabled={isSubmitting} size="small" variant="outlined">
					Сбросить
				</Button>
			</Grid>
			<Grid className={styles.dropdownFooterColumn} item>
				<Button type="submit" disabled={isSubmitting} size="small" variant="contained" color="primary">
					Сохранить
				</Button>
			</Grid>
		</Grid>
	);
};

let searchTimer;

const photoImgClasses = member => {
	return ClassNames({
		[styles.memberPhoto]: true,
		[styles.memberPhotoNull]: member.isWaiting || !member.user.profilePhoto,
	});
};

class Toolbar extends Component {
	state = {
		dropdown1: false,
		dropdown2: false,
		dropdown3: false,
		dropdown4: false,
	};

	refDropdown1 = createRef();
	refDropdown2 = createRef();
	refDropdown3 = createRef();
	refDropdown4 = createRef();
	refSearchInput = createRef();

	onHandleDropdown = ({ name, value }, values, setFieldValue) => {
		this.setState({ [name]: value === null || value === undefined ? !this.state[name] : value });

		if (values) {
			switch (name) {
				case 'dropdown1':
					if (!values.amountFromView || !values.amountToView) {
						setFieldValue('amountFrom', '', false);
						setFieldValue('amountTo', '', false);
					} else {
						setFieldValue('amountFrom', values.amountFromView, false);
						setFieldValue('amountTo', values.amountToView, false);
					}
					break;
				case 'dropdown2':
					break;
				case 'dropdown3':
					if (!values.shopNameView) {
						setFieldValue('shopName', '', false);
					} else {
						setFieldValue('shopName', values.shopNameView, false);
					}
					break;
				case 'dropdown4':
					break;
				default:
					return;
			}
		}
	};

	onChangeFilterNumber = ({ target: { value } }, setFieldValue, submitForm) => {
		setFieldValue('number', value);

		clearTimeout(searchTimer);

		searchTimer = setTimeout(() => submitForm(), 150);
	};

	onClearSearch = (setFieldValue, submitForm) => {
		setFieldValue('number', '', false);

		this.refSearchInput.current.focus();

		submitForm();
	};

	onResetFilterShopName = (setFieldValue, submitForm) => {
		this.onHandleDropdown({ name: 'dropdown3' });

		setFieldValue('shopName', '', false);
		setFieldValue('shopNameView', '', false);

		submitForm();
	};

	onResetFilterAmount = (setFieldValue, submitForm) => {
		this.onHandleDropdown({ name: 'dropdown1' });

		setFieldValue('amountFrom', '', false);
		setFieldValue('amountTo', '', false);
		setFieldValue('amountFromView', '', false);
		setFieldValue('amountToView', '', false);

		submitForm();
	};

	onChangeFilterRole = (role, setFieldValue, submitForm) => {
		this.onHandleDropdown({ name: 'dropdown4' });

		setFieldValue('role', role, false);
		submitForm();
	};

	onSubmit = (values, actions) => {
		actions.setFieldValue('amountFromView', values.amountFrom, false);
		actions.setFieldValue('amountToView', values.amountTo, false);
		actions.setFieldValue('shopNameView', values.shopName, false);

		const filterParams = toolbarFilterSchema.cast(values);

		for (let i = 0; i < 4; i++) this.onHandleDropdown({ name: `dropdown${i + 1}`, value: false });

		Object.keys(filterParams).forEach(key => filterParams[key] === '' && delete filterParams[key]);

		// const { endDate, startDate } = queryString.parse(history.location.search);
		history.push({
			search: queryString.stringify(filterParams),
		});

		setTimeout(() => {
			actions.setSubmitting(false);
		}, 500);
	};

	render() {
		const {
			currentStock,
			members = currentStock.members
				.filter(member => member.role.match(/owner|admin/))
				.map(member => {
					return {
						...member,
						roleBitMask: memberRoleTransform(member.role, true),
					};
				})
				.sort((memberA, memberB) => (memberA.roleBitMask > memberB.roleBitMask ? -1 : 1)),
		} = this.props;
		const { dropdown1, dropdown2, dropdown3, dropdown4 } = this.state;

		return (
			<Paper className={styles.container}>
				<Formik
					initialValues={initialValues}
					validationSchema={toolbarFilterSchema}
					validateOnBlur={false}
					validateOnChange={false}
					onSubmit={(values, actions) => this.onSubmit(values, actions)}
					render={({ errors, isSubmitting, values, setFieldValue, submitForm, resetForm }) => (
						<Form>
							<Grid className={styles.topContainer} container>
								<Field
									inputRef={this.refSearchInput}
									name="number"
									component={SearchTextField}
									inputProps={{
										onChange: event => this.onChangeFilterNumber(event, setFieldValue, submitForm),
									}}
									disabled={false}
									placeholder="Поиск по номеру покупки"
									autoComplete="off"
									fullWidth
								/>
								{values.number && !isSubmitting ? (
									<ButtonBase onClick={() => this.onClearSearch(setFieldValue, submitForm)} className={styles.textFieldSearchClear}>
										<FontAwesomeIcon icon={['fal', 'times']} />
									</ButtonBase>
								) : null}
								{isSubmitting ? <CircularProgress className={styles.loadingForm} size={20} /> : null}
							</Grid>
							<Grid className={styles.bottomContainer} container>
								<Grid item>
									<ButtonBase
										ref={this.refDropdown1}
										className={styles.filterButtonLink}
										onClick={() => this.onHandleDropdown({ name: 'dropdown1' })}
										disableRipple
									>
										{values.amountFromView && values.amountToView ? (
											<span>
												<NumberFormat
													value={values.amountFromView}
													renderText={value => `от ${value}`}
													displayType="text"
													onValueChange={() => {}}
													{...amountNumberFormat}
												/>{' '}
												<NumberFormat
													value={values.amountToView}
													renderText={value => `до ${value}`}
													displayType="text"
													onValueChange={() => {}}
													{...amountNumberFormat}
												/>
											</span>
										) : (
											<span>Любая сумма</span>
										)}
										<FontAwesomeIcon icon={['far', 'angle-down']} />
									</ButtonBase>
								</Grid>
								{/*<Grid item>*/}
								{/*  <ButtonBase*/}
								{/*    ref={this.refDropdown2}*/}
								{/*    className={styles.filterButtonLink}*/}
								{/*    onClick={() => this.onHandleDropdown({name: 'dropdown2'})}*/}
								{/*    disableRipple*/}
								{/*  >*/}
								{/*    <span>*/}
								{/*      За всё время*/}
								{/*    </span>*/}
								{/*    <FontAwesomeIcon icon={['far', 'angle-down']} />*/}
								{/*  </ButtonBase>*/}
								{/*</Grid>*/}
								<Grid item>
									<ButtonBase
										ref={this.refDropdown3}
										className={styles.filterButtonLink}
										onClick={() => this.onHandleDropdown({ name: 'dropdown3' })}
										disableRipple
									>
										<span>{values.shopNameView || 'Все магазины'}</span>
										<FontAwesomeIcon icon={['far', 'angle-down']} />
									</ButtonBase>
								</Grid>
								<Grid item>
									<ButtonBase
										ref={this.refDropdown4}
										className={styles.filterButtonLink}
										onClick={() => this.onHandleDropdown({ name: 'dropdown4' })}
										disableRipple
									>
										<span>{filterRoleTransform(values.role, members)}</span>
										<FontAwesomeIcon icon={['far', 'angle-down']} />
									</ButtonBase>
								</Grid>
								<Grid item style={{ marginLeft: 'auto' }}>
									{/*{values.number || values.amountFromView || values.amountToView || values.dateFrom || values.dateTo || values.shopNameView || values.role !== 'all' ? (*/}
									{values.number || values.amountFromView || values.amountToView || values.shopNameView || values.role !== 'all' ? (
										<ButtonBase
											onClick={() => {
												resetForm();
												submitForm();
											}}
											className={styles.filterButtonLinkRed}
											disableRipple
										>
											<span>Сбросить фильтры</span>
										</ButtonBase>
									) : null}
								</Grid>
							</Grid>

							{/* Dropdown 1 */}
							<Dropdown
								anchor={this.refDropdown1}
								open={dropdown1}
								onClose={() => this.onHandleDropdown({ name: 'dropdown1' }, values, setFieldValue)}
								placement="bottom-start"
							>
								<Grid className={styles.dropdownContent} alignItems="center" container>
									<Grid className={styles.dropdownContentColumn} item>
										<Field
											className={styles.textFieldErrorHidden}
											name="amountFrom"
											error={Boolean(errors.amountFrom)}
											component={InputBase}
											inputComponent={NumberFormat}
											inputProps={{
												...amountNumberFormat,
											}}
											placeholder="от"
											autoComplete="off"
											validate={value => {
												const from = parseFloat(values.amountFrom.replace(/ /g, ''));
												const to = parseFloat(values.amountTo.replace(/ /g, ''));

												if ((!values.amountFrom && values.amountTo) || from > to) return true;
											}}
											autoFocus
											fullWidth
										/>
									</Grid>
									<Grid className={styles.dropdownContentSeparated} item>
										<InputLabel>&ndash;</InputLabel>
									</Grid>
									<Grid className={styles.dropdownContentColumn} item>
										<Field
											className={styles.textFieldErrorHidden}
											name="amountTo"
											error={Boolean(errors.amountTo)}
											component={InputBase}
											inputComponent={NumberFormat}
											inputProps={{
												...amountNumberFormat,
											}}
											placeholder="до"
											autoComplete="off"
											validate={value => {
												const from = parseFloat(values.amountFrom.replace(/ /g, ''));
												const to = parseFloat(values.amountTo.replace(/ /g, ''));

												if ((!values.amountTo && values.amountFrom) || to < from) return true;
											}}
											fullWidth
										/>
									</Grid>
								</Grid>
								<DropdownFooter onResetHandler={() => this.onResetFilterAmount(setFieldValue, submitForm)} isSubmitting={isSubmitting} />
							</Dropdown>

							{/* Dropdown 2 */}
							<Dropdown
								anchor={this.refDropdown2}
								open={dropdown2}
								onClose={() => this.onHandleDropdown({ name: 'dropdown2' }, values, setFieldValue)}
								placement="bottom-start"
							>
								<Grid className={styles.dropdownContent} alignItems="center" container>
									{/*<MuiPickersUtilsProvider utils={MomentUtils} locale="ru">*/}
									{/*  <DatePicker*/}
									{/*    // autoOk*/}
									{/*    variant="static"*/}
									{/*    openTo="date"*/}
									{/*    // value={}*/}
									{/*    onChange={date => {*/}
									{/*      // console.log(date);*/}
									{/*    }}*/}
									{/*    disableToolbar*/}
									{/*  />*/}
									{/*</MuiPickersUtilsProvider>*/}
								</Grid>
								<DropdownFooter onResetHandler={() => {}} isSubmitting={isSubmitting} />
							</Dropdown>

							{/* Dropdown 3 */}
							<Dropdown
								anchor={this.refDropdown3}
								open={dropdown3}
								onClose={() => this.onHandleDropdown({ name: 'dropdown3' }, values, setFieldValue)}
								placement="bottom-start"
							>
								<Grid className={styles.dropdownContent} style={{ minWidth: 245 }} alignItems="center" container>
									<Field
										name="shopName"
										component={InputBase}
										placeholder="Поиск по названию магазина"
										autoComplete="off"
										autoFocus
										fullWidth
									/>
								</Grid>
								<DropdownFooter onResetHandler={() => this.onResetFilterShopName(setFieldValue, submitForm)} isSubmitting={isSubmitting} />
							</Dropdown>

							{/* Dropdown 4 */}
							<Dropdown
								anchor={this.refDropdown4}
								open={dropdown4}
								onClose={() => this.onHandleDropdown({ name: 'dropdown4' }, values, setFieldValue)}
								placement="bottom-start"
							>
								<List component="nav">
									{roles.map((role, index) => (
										<ListItem
											key={index}
											disabled={isSubmitting}
											selected={values.role === role}
											onClick={() => this.onChangeFilterRole(role, setFieldValue, submitForm)}
											component={MenuItem}
											button
										>
											{filterRoleTransform(role)}
										</ListItem>
									))}
									{members.map((member, index) => (
										<ListItem
											key={index}
											disabled={isSubmitting}
											selected={values.role === member.user._id}
											onClick={() => this.onChangeFilterRole(member.user._id, setFieldValue, submitForm)}
											component={MenuItem}
											button
										>
											<div className={photoImgClasses(member)}>
												{member.user.profilePhoto ? (
													<img src={member.user.profilePhoto} alt="" />
												) : (
													<FontAwesomeIcon icon={['fas', 'user-alt']} />
												)}
											</div>
											<div className={styles.memberDetails}>
												<div className={styles.memberTitle}>{member.user.name || member.user.email}</div>
												<div className={styles.memberCaption}>{memberRoleTransform(member.role)}</div>
											</div>
										</ListItem>
									))}
								</List>
							</Dropdown>
						</Form>
					)}
				/>
			</Paper>
		);
	}
}

export default Toolbar;
