import React, { useState, useRef } from 'react';
import moment from 'moment';
import { Form } from 'formik';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import MenuList from '@material-ui/core/MenuList';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import MomentUtils from '@material-ui/pickers/adapter/moment';
import { StaticDateRangePicker, LocalizationProvider } from '@material-ui/pickers';

import { memberRoleTransform } from 'shared/roles-access-rights';

import { weekActive, monthActive, paginationCalendarFormat } from 'src/components/Pagination/utils';
import Dropdown from 'src/components/Dropdown';
import MenuItem from 'src/components/MenuItem';

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
					>
						{!values.dateStartView && !values.dateEndView ? (
							<span>Всё время</span>
						) : isMonthActive() ? (
							<span>Текущий месяц</span>
						) : isWeekActive() ? (
							<span>Текущая неделя</span>
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
				</Grid>

				{/* Filter Status */}
				<Grid item>
					<ButtonBase ref={refDropdownStatus} className={styles.filterButtonLink} onClick={() => handlerDropdown('dropdownStatus')}>
						<span>{FilterStatusTransform(values.status)}</span>
						<FontAwesomeIcon icon={['far', 'angle-down']} />
					</ButtonBase>
				</Grid>

				{/* Filter Member */}
				<Grid item>
					<ButtonBase
						ref={refDropdownMember}
						className={styles.filterButtonLink}
						onClick={() => handlerDropdown('dropdownMember', null, onClearSearchTextMember)}
					>
						<span>{FilterMemberTransform(values.member, allMembers, isLoadingAllMembers)}</span>
						<FontAwesomeIcon icon={['far', 'angle-down']} />
					</ButtonBase>
				</Grid>

				<Grid item style={{ marginLeft: 'auto' }}>
					{values.dateStartView || values.dateEndView || values.status !== 'all' || values.member !== 'all' ? (
						<ButtonBase onClick={() => onResetAllFilters(setFieldValue, submitForm)} className={styles.filterButtonLinkRed}>
							<span>Сбросить фильтры</span>
						</ButtonBase>
					) : null}
				</Grid>
			</Grid>

			{/* Filter Date */}
			<Dropdown
				anchor={refDropdownDate}
				open={dropdownDate}
				onClose={() => handlerDropdown('dropdownDate', false)}
				placement="bottom-start"
				innerContentStyle={{ minWidth: 190 }}
			>
				<MenuList autoFocusItem={dropdownDate} disablePadding>
					<List tabIndex={-1}>
						<MenuItem
							disabled={isSubmitting}
							selected={!values.dateStartView && !values.dateEndView}
							onClick={() => onChangeFilterDate('allTime', setFieldValue, submitForm)}
							tabIndex={0}
						>
							Всё время
						</MenuItem>
						<MenuItem
							disabled={isSubmitting}
							selected={isMonthActive()}
							onClick={() => onChangeFilterDate('currentMonth', setFieldValue, submitForm)}
							tabIndex={0}
						>
							Текущий месяц
						</MenuItem>
						<MenuItem
							disabled={isSubmitting}
							selected={isWeekActive()}
							onClick={() => onChangeFilterDate('currentWeek', setFieldValue, submitForm)}
							tabIndex={0}
						>
							Текущая неделя
						</MenuItem>
					</List>
					<Divider />
					<List tabIndex={-1}>
						<MenuItem
							ref={refDropdownDateRange}
							disabled={isSubmitting}
							onClick={() => {
								handlerDropdown('dropdownDate');
								handlerDropdown('dropdownDateRange');
							}}
							tabIndex={0}
						>
							Указать период
						</MenuItem>
					</List>
				</MenuList>
			</Dropdown>

			<Dropdown
				anchor={refDropdownDate}
				open={dropdownDateRange}
				onClose={() => handlerDropdown('dropdownDateRange', false)}
				placement="bottom-start"
				innerContentStyle={{ minWidth: 190 }}
			>
				<Grid className={styles.dropdownContent} alignItems="center" container>
					<LocalizationProvider dateAdapter={MomentUtils}>
						<StaticDateRangePicker
							calendars={1}
							displayStaticWrapperAs="desktop"
							reduceAnimations
							value={[moment(values.dateStart), moment(values.dateEnd)]}
							onChange={date => {
								const dateStartValue = date[0] ? date[0].valueOf() : null;
								const dateEndValue = date[1] ? date[1].valueOf() : null;

								setFieldValue('dateStart', dateStartValue, false);
								setFieldValue('dateEnd', dateEndValue, false);
							}}
							leftArrowButtonProps={{
								size: 'small',
							}}
							leftArrowIcon={<FontAwesomeIcon icon={['far', 'angle-left']} />}
							rightArrowButtonProps={{
								size: 'small',
							}}
							rightArrowIcon={<FontAwesomeIcon icon={['far', 'angle-right']} />}
						/>
					</LocalizationProvider>
				</Grid>
				<DropdownFooter isSubmitting={isSubmitting} disabledSubmit={!values.dateStart || !values.dateEnd} />
			</Dropdown>

			{/* Filter Status */}
			<Dropdown
				anchor={refDropdownStatus}
				open={dropdownStatus}
				onClose={() => handlerDropdown('dropdownStatus', false)}
				placement="bottom-start"
				innerContentStyle={{ width: 250, maxHeight: 300, overflow: 'auto' }}
			>
				<MenuList autoFocusItem={dropdownStatus}>
					{statusList.map((status, index) => (
						<MenuItem
							key={index}
							disabled={isSubmitting}
							selected={values.status === status}
							onClick={() => onChangeFilterStatus(status, setFieldValue, submitForm)}
							tabIndex={0}
						>
							{FilterStatusTransform(status)}
						</MenuItem>
					))}
				</MenuList>
			</Dropdown>

			{/* Filter Member */}
			<Dropdown
				anchor={refDropdownMember}
				open={dropdownMember}
				onClose={() => handlerDropdown('dropdownMember', false)}
				placement="bottom-start"
				header={
					<div className={styles.filterSearchTextFieldContainer}>
						<FilterSearchTextField
							inputRef={searchTextFieldMember}
							placeholder="Введите имя"
							value={searchTextMember}
							onChange={onTypeSearchTextMember}
							autoFocus
							fullWidth
						/>
						{searchTextMember ? (
							<ButtonBase onClick={onClearSearchTextMember} className={styles.filterSearchTextFieldClear} tabIndex={-1}>
								<FontAwesomeIcon icon={['fal', 'times']} />
							</ButtonBase>
						) : null}
					</div>
				}
				innerContentStyle={{ width: 250, maxHeight: 300, overflow: 'auto' }}
			>
				{!isLoadingAllMembers && members && members.length ? (
					<MenuList autoFocusItem={dropdownMember && !searchTextFieldMember.current}>
						{!searchTextMember ? (
							<MenuItem
								disabled={isSubmitting}
								selected={values.member === 'all'}
								onClick={() => onChangeFilterMember('all', setFieldValue, submitForm)}
								tabIndex={0}
							>
								Все участники
							</MenuItem>
						) : null}
						{members.map((member, index) => (
							<MenuItem
								key={index}
								disabled={isSubmitting}
								selected={values.member === member._id}
								onClick={() => onChangeFilterMember(member._id, setFieldValue, submitForm)}
								tabIndex={0}
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
							</MenuItem>
						))}
					</MenuList>
				) : (
					<div style={{ textAlign: 'center', padding: 15 }}>
						{members && !members.length ? <Typography variant="caption">Ничего не найдено</Typography> : <CircularProgress size={20} />}
					</div>
				)}
			</Dropdown>
		</Form>
	);
};

export default FormFilter;
