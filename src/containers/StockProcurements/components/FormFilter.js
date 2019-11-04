import React from 'react';
import ClassNames from 'classnames';
import { Field, Form } from 'formik';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import InputLabel from '@material-ui/core/InputLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import InputBase from '@material-ui/core/InputBase';
import CircularProgress from '@material-ui/core/CircularProgress';

import { memberRoleTransform } from 'shared/roles-access-rights';

import NumberFormat, { currencyFormatInputProps, currencyFormatProps } from 'src/components/NumberFormat';
import Dropdown from 'src/components/Dropdown';

import { SearchTextField } from './Filter.styles';

import styles from './Filter.module.css';

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
			const member = members.find(member => member.user._id === roleSelected);

			return member ? member.user.name : 'Все роли';
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

const photoImgClasses = member => {
	return ClassNames({
		[styles.memberPhoto]: true,
		[styles.memberPhotoNull]: member.isWaiting || !member.user.profilePhoto,
	});
};

const FormFilter = props => {
	const {
		handlerDropdown,
		onChangeFilterNumber,
		onClearFilterNumber,
		onResetFilterAmount,
		onChangeFilterRole,
		onResetAllFilters,
		members,
		dropdown1: { state: dropdown1, ref: refDropdown1 },
		dropdown4: { state: dropdown4, ref: refDropdown4 },
		refFilterNumberInput,
		formikProps: { errors, isSubmitting, values, setFieldValue, submitForm },
	} = props;

	return (
		<Form>
			<Grid className={styles.topContainer} container>
				<Field
					inputRef={refFilterNumberInput}
					name="number"
					as={SearchTextField}
					inputProps={{
						onChange: event => onChangeFilterNumber(event, setFieldValue, submitForm),
					}}
					disabled={false}
					placeholder="Поиск по номеру чека или накладной"
					fullWidth
				/>
				{values.number && !isSubmitting ? (
					<ButtonBase onClick={() => onClearFilterNumber(setFieldValue, submitForm)} className={styles.textFieldFilterNumberClear}>
						<FontAwesomeIcon icon={['fal', 'times']} />
					</ButtonBase>
				) : null}
				{isSubmitting ? <CircularProgress className={styles.loadingForm} size={20} /> : null}
			</Grid>

			<Grid className={styles.bottomContainer} container>
				{/* Filter 1 */}
				<Grid item>
					<ButtonBase
						ref={refDropdown1}
						className={styles.filterButtonLink}
						onClick={() => handlerDropdown({ name: 'dropdown1' })}
						disableRipple
					>
						{values.amountFromView && values.amountToView ? (
							<span>
								<NumberFormat
									value={values.amountFromView}
									renderText={value => `от ${value}`}
									displayType="text"
									onValueChange={() => {}}
									{...currencyFormatProps}
								/>{' '}
								<NumberFormat
									value={values.amountToView}
									renderText={value => `до ${value}`}
									displayType="text"
									onValueChange={() => {}}
									{...currencyFormatProps}
								/>
							</span>
						) : (
							<span>Любая сумма</span>
						)}
						<FontAwesomeIcon icon={['far', 'angle-down']} />
					</ButtonBase>
				</Grid>

				<Dropdown
					anchor={refDropdown1}
					open={dropdown1}
					onClose={() => handlerDropdown({ name: 'dropdown1' }, values, setFieldValue)}
					placement="bottom-start"
				>
					<Grid className={styles.dropdownContent} alignItems="center" container>
						<Grid className={styles.dropdownContentColumn} item>
							<Field
								className={styles.textFieldErrorHidden}
								name="amountFrom"
								error={Boolean(errors.amountFrom)}
								as={InputBase}
								inputComponent={NumberFormat}
								inputProps={{
									...currencyFormatInputProps,
								}}
								placeholder="от"
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
								as={InputBase}
								inputComponent={NumberFormat}
								inputProps={{
									...currencyFormatInputProps,
								}}
								placeholder="до"
								validate={value => {
									const from = parseFloat(values.amountFrom.replace(/ /g, ''));
									const to = parseFloat(values.amountTo.replace(/ /g, ''));

									if ((!values.amountTo && values.amountFrom) || to < from) return true;
								}}
								fullWidth
							/>
						</Grid>
					</Grid>
					<DropdownFooter onResetHandler={() => onResetFilterAmount(setFieldValue, submitForm)} isSubmitting={isSubmitting} />
				</Dropdown>

				{/* Filter 4 */}
				<Grid item>
					<ButtonBase
						ref={refDropdown4}
						className={styles.filterButtonLink}
						onClick={() => handlerDropdown({ name: 'dropdown4' })}
						disableRipple
					>
						<span>{filterRoleTransform(values.role, members)}</span>
						<FontAwesomeIcon icon={['far', 'angle-down']} />
					</ButtonBase>
				</Grid>

				<Dropdown
					anchor={refDropdown4}
					open={dropdown4}
					onClose={() => handlerDropdown({ name: 'dropdown4' }, values, setFieldValue)}
					placement="bottom-start"
				>
					<List component="nav">
						{roles.map((role, index) => (
							<ListItem
								key={index}
								disabled={isSubmitting}
								selected={values.role === role}
								onClick={() => onChangeFilterRole(role, setFieldValue, submitForm)}
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
								onClick={() => onChangeFilterRole(member.user._id, setFieldValue, submitForm)}
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

				<Grid item style={{ marginLeft: 'auto' }}>
					{values.number || values.amountFromView || values.amountToView || values.role !== 'all' ? (
						<ButtonBase onClick={() => onResetAllFilters(setFieldValue, submitForm)} className={styles.filterButtonLinkRed} disableRipple>
							<span>Сбросить фильтры</span>
						</ButtonBase>
					) : null}
				</Grid>
			</Grid>
		</Form>
	);
};

export default FormFilter;
