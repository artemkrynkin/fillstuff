import React, { useState, useRef } from 'react';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { Form } from 'formik';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { DatePicker } from '@material-ui/pickers';

import { memberRoleTransform } from 'shared/roles-access-rights';

import { weekActive, monthActive, paginationCalendarFormat } from 'src/components/Pagination/utils';
import Dropdown from 'src/components/Dropdown';

import { FilterSearchTextField } from './Filter.styles';
import styles from './Filter.module.css';

const statusList = ['all', 'unpaid', 'partially-paid', 'paid'];
const FilterStatusTransform = statusSelected => {
	switch (statusSelected) {
		case 'unpaid':
			return 'Только не оплаченные';
		case 'partially-paid':
			return 'Только частично оплаченные';
		case 'paid':
			return 'Только оплаченные';
		case 'all':
		default:
			return 'Все счета';
	}
};

const FilterMemberTransform = (memberSelected, members, loading) => {
	if (memberSelected !== 'all') {
		if (loading) return <CircularProgress size={13} />;

		if (members && members.length) {
			const member = members.find(member => member._id === memberSelected);

			return member ? member.user.name : null;
		} else {
			return 'Не найдено';
		}
	} else {
		return 'Все участники';
	}
};
const findMemberByName = (member, searchText) => {
	const searchTextLowercase = String(searchText).toLowerCase();

	const memberName = member.user.name.toLowerCase();

	return memberName.indexOf(searchTextLowercase) !== -1;
};

const DropdownFooter = props => {
	const { onResetHandler, isSubmitting, disabledSubmit } = props;

	return (
		<Grid className={styles.dropdownFooter} alignItems="center" justify="center" container>
			{typeof onResetHandler === 'function' ? (
				<Grid className={styles.dropdownFooterColumn} item>
					<Button onClick={onResetHandler} disabled={isSubmitting} size="small" variant="outlined">
						Сбросить
					</Button>
				</Grid>
			) : null}
			<Grid className={styles.dropdownFooterColumn} item>
				<Button
					type="submit"
					disabled={disabledSubmit ? isSubmitting || disabledSubmit : isSubmitting}
					size="small"
					variant="contained"
					color="primary"
				>
					Сохранить
				</Button>
			</Grid>
		</Grid>
	);
};

const FormFilter = props => {
	const {
		handlerDropdown,
		onChangeFilterDate,
		onChangeFilterStatus,
		onChangeFilterMember,
		onResetAllFilters,
		members: {
			data: allMembers,
			isFetching: isLoadingAllMembers,
			// error: errorMembers
		},
		dropdownDate: { state: dropdownDate, ref: refDropdownDate },
		dropdownDateRange: { state: dropdownDateRange, ref: refDropdownDateRange },
		dropdownStatus: { state: dropdownStatus, ref: refDropdownStatus },
		dropdownMember: { state: dropdownMember, ref: refDropdownMember },
		formikProps: {
			// errors,
			isSubmitting,
			values,
			setFieldValue,
			submitForm,
		},
	} = props;
	const searchTextFieldMember = useRef(null);
	const [searchTextMember, setSearchTextMember] = useState('');

	const onTypeSearchTextMember = ({ target: { value } }) => setSearchTextMember(value);

	const onClearSearchTextMember = () => {
		setSearchTextMember('');

		searchTextFieldMember.current.focus();
	};

	const members = !isLoadingAllMembers && allMembers ? allMembers.filter(member => findMemberByName(member, searchTextMember)) : [];

	const isWeekActive = currentWeek => weekActive(values.dateStartView, values.dateEndView, currentWeek);
	const isMonthActive = currentMonth => monthActive(values.dateStartView, values.dateEndView, currentMonth);

	return (
		<Form>
			<Grid container>
				{/* Filter Date */}
				<Grid item>
					<ButtonBase
						ref={refDropdownDate}
						className={styles.filterButtonLink}
						onClick={() => {
							handlerDropdown('dropdownDate');
							handlerDropdown('dropdownDateRange', false);
						}}
						disableRipple
					>
						{isWeekActive() ? (
							<span>За текущую неделю</span>
						) : isMonthActive() ? (
							<span>За текущий месяц</span>
						) : !isNaN(values.dateStartView) && !isNaN(values.dateEndView) ? (
							<span>
								{isMonthActive(false)
									? moment(values.dateStartView).calendar(null, paginationCalendarFormat(isMonthActive(false)))
									: moment(values.dateStartView).isSame(values.dateEndView, 'day')
									? moment(values.dateStartView).calendar(null, paginationCalendarFormat(false))
									: moment(values.dateStartView).calendar(null, paginationCalendarFormat(false)) +
									  ' - ' +
									  moment(values.dateEndView).calendar(null, paginationCalendarFormat(false))}
							</span>
						) : (
							'Некорректная дата'
						)}
						<FontAwesomeIcon icon={['far', 'angle-down']} />
					</ButtonBase>

					<Dropdown anchor={refDropdownDate} open={dropdownDate} onClose={() => handlerDropdown('dropdownDate')} placement="bottom-start">
						<List component="nav">
							<ListItem
								disabled={isSubmitting}
								selected={isWeekActive()}
								onClick={() => onChangeFilterDate('currentWeek', setFieldValue, submitForm)}
								component={MenuItem}
								button
							>
								За текущую неделю
							</ListItem>
							<ListItem
								disabled={isSubmitting}
								selected={isMonthActive()}
								onClick={() => onChangeFilterDate('currentMonth', setFieldValue, submitForm)}
								component={MenuItem}
								button
							>
								За текущий месяц
							</ListItem>
						</List>
						<Divider />
						<List component="nav">
							<ListItem
								ref={refDropdownDateRange}
								disabled={isSubmitting}
								onClick={() => {
									handlerDropdown('dropdownDate');
									handlerDropdown('dropdownDateRange');
								}}
								component={MenuItem}
								button
							>
								Указать период
							</ListItem>
						</List>
					</Dropdown>

					<Dropdown
						anchor={refDropdownDate}
						open={dropdownDateRange}
						onClose={() => handlerDropdown('dropdownDateRange')}
						placement="bottom-start"
					>
						<Grid className={styles.dropdownContent} alignItems="center" container>
							<MuiPickersUtilsProvider utils={MomentUtils}>
								<Grid className={styles.dropdownContentColumn} style={{ width: 'auto' }} item>
									<DatePicker
										value={values.dateStart}
										onChange={date => {
											setFieldValue('dateStart', date.valueOf(), false);

											if (moment(values.dateEnd).isBefore(date)) {
												setFieldValue('dateEnd', date.valueOf(), false);
											}
										}}
										variant="static"
										leftArrowButtonProps={{
											size: 'small',
										}}
										leftArrowIcon={<FontAwesomeIcon icon={['far', 'angle-left']} />}
										rightArrowButtonProps={{
											size: 'small',
										}}
										rightArrowIcon={<FontAwesomeIcon icon={['far', 'angle-right']} />}
										maxDate={values.dateEnd}
										disableFuture
										disableToolbar
									/>
								</Grid>
								<Grid className={styles.dropdownContentColumn} style={{ width: 'auto' }} item>
									<DatePicker
										value={values.dateEnd}
										onChange={date => {
											const dateEnd = date.set({ second: 59, millisecond: 999 });

											setFieldValue('dateEnd', dateEnd.valueOf(), false);

											if (moment(values.dateStart).isAfter(dateEnd)) {
												setFieldValue('dateStart', dateEnd.valueOf(), false);
											}
										}}
										variant="static"
										leftArrowButtonProps={{
											size: 'small',
										}}
										leftArrowIcon={<FontAwesomeIcon icon={['far', 'angle-left']} />}
										rightArrowButtonProps={{
											size: 'small',
										}}
										rightArrowIcon={<FontAwesomeIcon icon={['far', 'angle-right']} />}
										minDate={values.dateStart}
										disableFuture
										disableToolbar
									/>
								</Grid>
							</MuiPickersUtilsProvider>
						</Grid>
						<DropdownFooter isSubmitting={isSubmitting} disabledSubmit={!values.dateStart || !values.dateEnd} />
					</Dropdown>
				</Grid>

				{/* Filter Status */}
				<Grid item>
					<ButtonBase
						ref={refDropdownStatus}
						className={styles.filterButtonLink}
						onClick={() => handlerDropdown('dropdownStatus')}
						disableRipple
					>
						<span>{FilterStatusTransform(values.status)}</span>
						<FontAwesomeIcon icon={['far', 'angle-down']} />
					</ButtonBase>

					<Dropdown
						anchor={refDropdownStatus}
						open={dropdownStatus}
						onClose={() => handlerDropdown('dropdownStatus')}
						placement="bottom-start"
						innerContentStyle={{ maxHeight: 300, overflow: 'auto' }}
					>
						<List component="nav">
							{statusList.map((status, index) => (
								<ListItem
									key={index}
									disabled={isSubmitting}
									selected={values.status === status}
									onClick={() => onChangeFilterStatus(status, setFieldValue, submitForm)}
									component={MenuItem}
									button
								>
									{FilterStatusTransform(status)}
								</ListItem>
							))}
						</List>
					</Dropdown>
				</Grid>

				{/* Filter Member */}
				<Grid item>
					<ButtonBase
						ref={refDropdownMember}
						className={styles.filterButtonLink}
						onClick={() => handlerDropdown('dropdownMember')}
						disableRipple
					>
						<span>{FilterMemberTransform(values.member, allMembers, isLoadingAllMembers)}</span>
						<FontAwesomeIcon icon={['far', 'angle-down']} />
					</ButtonBase>

					<Dropdown
						anchor={refDropdownMember}
						open={dropdownMember}
						onClose={() => handlerDropdown('dropdownMember')}
						placement="bottom-start"
						headerElement={
							<div className={styles.filterSearchTextFieldContainer}>
								<FilterSearchTextField
									inputRef={searchTextFieldMember}
									placeholder="Введите имя"
									value={searchTextMember}
									onChange={onTypeSearchTextMember}
									fullWidth
								/>
								{searchTextMember ? (
									<ButtonBase onClick={onClearSearchTextMember} className={styles.filterSearchTextFieldClear}>
										<FontAwesomeIcon icon={['fal', 'times']} />
									</ButtonBase>
								) : null}
							</div>
						}
						innerContentStyle={{ width: 200, maxHeight: 300, overflow: 'auto' }}
					>
						{!isLoadingAllMembers && members && members.length ? (
							<List component="nav">
								{!searchTextMember ? (
									<ListItem
										disabled={isSubmitting}
										selected={values.member === 'all'}
										onClick={() => onChangeFilterMember('all', setFieldValue, submitForm)}
										component={MenuItem}
										button
									>
										Все участники
									</ListItem>
								) : null}
								{members.map((member, index) => (
									<ListItem
										key={index}
										disabled={isSubmitting}
										selected={values.member === member._id}
										onClick={() => onChangeFilterMember(member._id, setFieldValue, submitForm)}
										component={MenuItem}
										button
									>
										<div className={styles.user}>
											<Avatar
												className={styles.userPhoto}
												src={member.user.avatar}
												alt={member.user.name}
												children={<div className={styles.userIcon} children={<FontAwesomeIcon icon={['fas', 'user-alt']} />} />}
											/>
											<Grid className={styles.userInfo} direction="column" container>
												<div className={styles.userTitle}>{member.user.name}</div>
												<div className={styles.userCaption}>{memberRoleTransform(member.roles).join(', ')}</div>
											</Grid>
										</div>
									</ListItem>
								))}
							</List>
						) : (
							<div style={{ textAlign: 'center', padding: 15 }}>
								{members && !members.length ? <Typography variant="caption">Ничего не найдено</Typography> : <CircularProgress size={20} />}
							</div>
						)}
					</Dropdown>
				</Grid>

				<Grid item style={{ marginLeft: 'auto' }}>
					{!isMonthActive() || values.status !== 'all' || values.member !== 'all' ? (
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
