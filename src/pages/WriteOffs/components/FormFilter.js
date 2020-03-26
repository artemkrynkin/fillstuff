import React, { useState, useRef } from 'react';
import ClassNames from 'classnames';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { Form } from 'formik';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { DatePicker } from '@material-ui/pickers';

import { memberRoleTransform } from 'shared/roles-access-rights';

import { weekActive, monthActive, paginationCalendarFormat } from 'src/components/Pagination/utils';
import Dropdown from 'src/components/Dropdown';
import PositionNameInList from 'src/components/PositionNameInList';
import MenuItem from 'src/components/MenuItem';

import { FilterSearchTextField } from './Filter.styles';
import styles from './Filter.module.css';

const roles = ['all', 'owners', 'admins', 'artists'];
const FilterRoleTransform = (roleSelected, members, loading) => {
	switch (roleSelected) {
		case 'all':
			return 'Все участники';
		case 'owners':
			return 'Только владельцы';
		case 'admins':
			return 'Только администраторы';
		case 'artists':
			return 'Только мастера';
		default:
			if (loading) return <CircularProgress size={13} />;

			if (members && members.length) {
				const member = members.find(member => member._id === roleSelected);

				return member ? member.user.name : null;
			} else {
				return 'Не найдено';
			}
	}
};
const findMemberByName = (member, searchText) => {
	const searchTextLowercase = String(searchText).toLowerCase();

	const memberName = member.user.name.toLowerCase();

	return memberName.indexOf(searchTextLowercase) !== -1;
};

const positionList = ['all', 'paid', 'free'];
const FilterPositionTransform = (positionSelected, positions, loading) => {
	switch (positionSelected) {
		case 'all':
			return 'Все позиции';
		case 'paid':
			return 'Только платные позиции';
		case 'free':
			return 'Только бесплатные позиции';
		default:
			if (loading) return <CircularProgress size={13} />;

			if (positions && positions.length) {
				const position = positions.find(position => position._id === positionSelected);

				return position ? position.name : null;
			} else {
				return 'Не найдено';
			}
	}
};
const findPositionByFullName = (position, searchText) => {
	const searchTextLowercase = String(searchText).toLowerCase();

	const positionName = position.characteristics
		.reduce((fullName, characteristic) => `${fullName} ${characteristic.label}`, position.name)
		.toLowerCase();

	return positionName.indexOf(searchTextLowercase) !== -1;
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
		onChangeFilterPosition,
		onChangeFilterRole,
		onChangeFilterOnlyCanceled,
		onResetAllFilters,
		members: {
			data: allMembers,
			isFetching: isLoadingAllMembers,
			// error: errorMembers
		},
		positions: {
			data: allPositions,
			isFetching: isLoadingAllPositions,
			// error: errorPositions
		},
		dropdownDate: { state: dropdownDate, ref: refDropdownDate },
		dropdownDateRange: { state: dropdownDateRange, ref: refDropdownDateRange },
		dropdownPosition: { state: dropdownPosition, ref: refDropdownPosition },
		dropdownRole: { state: dropdownRole, ref: refDropdownRole },
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
	const searchTextFieldPosition = useRef(null);
	const [searchTextPosition, setSearchTextPosition] = useState('');

	const onTypeSearchTextMember = ({ target: { value } }) => setSearchTextMember(value);

	const onClearSearchTextMember = () => {
		setSearchTextMember('');

		searchTextFieldMember.current.focus();
	};

	const onTypeSearchTextPosition = ({ target: { value } }) => setSearchTextPosition(value);

	const onClearSearchTextPosition = () => {
		setSearchTextPosition('');

		searchTextFieldPosition.current.focus();
	};

	const members = !isLoadingAllMembers && allMembers ? allMembers.filter(member => findMemberByName(member, searchTextMember)) : [];

	const positions =
		!isLoadingAllPositions && allPositions ? allPositions.filter(position => findPositionByFullName(position, searchTextPosition)) : [];

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
						<List>
							<MenuItem
								disabled={isSubmitting}
								selected={isMonthActive()}
								onClick={() => onChangeFilterDate('currentMonth', setFieldValue, submitForm)}
							>
								Текущий месяц
							</MenuItem>
							<MenuItem
								disabled={isSubmitting}
								selected={isWeekActive()}
								onClick={() => onChangeFilterDate('currentWeek', setFieldValue, submitForm)}
							>
								Текущая неделя
							</MenuItem>
						</List>
						<Divider />
						<List component="nav">
							<MenuItem
								ref={refDropdownDateRange}
								disabled={isSubmitting}
								onClick={() => {
									handlerDropdown('dropdownDate');
									handlerDropdown('dropdownDateRange');
								}}
							>
								Указать период
							</MenuItem>
						</List>
					</Dropdown>

					<Dropdown
						anchor={refDropdownDate}
						open={dropdownDateRange}
						onClose={() => handlerDropdown('dropdownDateRange')}
						placement="bottom-start"
						innerContentStyle={{ width: 190 }}
					>
						<Grid className={styles.dropdownContent} alignItems="center" container>
							<MuiPickersUtilsProvider utils={MomentUtils}>
								<Grid className={styles.dropdownContentColumn} style={{ width: 'auto' }} item>
									<DatePicker
										value={values.dateStart || new Date()}
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
										value={values.dateEnd || new Date()}
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

				{/* Filter Position */}
				<Grid item>
					<ButtonBase
						ref={refDropdownPosition}
						className={styles.filterButtonLink}
						onClick={() => handlerDropdown('dropdownPosition')}
						disableRipple
					>
						<span>{FilterPositionTransform(values.position, allPositions, isLoadingAllPositions)}</span>
						<FontAwesomeIcon icon={['far', 'angle-down']} />
					</ButtonBase>

					<Dropdown
						anchor={refDropdownPosition}
						open={dropdownPosition}
						onClose={() => handlerDropdown('dropdownPosition')}
						placement="bottom-start"
						headerElement={
							<div className={styles.filterSearchTextFieldContainer}>
								<FilterSearchTextField
									inputRef={searchTextFieldPosition}
									placeholder="Введите название позиции"
									value={searchTextPosition}
									onChange={onTypeSearchTextPosition}
									autoFocus
									fullWidth
								/>
								{searchTextPosition ? (
									<ButtonBase onClick={onClearSearchTextPosition} className={styles.filterSearchTextFieldClear}>
										<FontAwesomeIcon icon={['fal', 'times']} />
									</ButtonBase>
								) : null}
							</div>
						}
						innerContentStyle={{ width: 250, maxHeight: 300, overflow: 'auto' }}
					>
						{!isLoadingAllPositions && positions && positions.length ? (
							<List>
								{!searchTextPosition
									? positionList.map((position, index) => (
											<MenuItem
												key={index}
												disabled={isSubmitting}
												selected={values.position === position}
												onClick={() => onChangeFilterPosition(position, setFieldValue, submitForm)}
											>
												{FilterPositionTransform(position)}
											</MenuItem>
									  ))
									: null}
								{positions.map((position, index) => {
									if (position.isArchived && !searchTextPosition) return null;

									return (
										<MenuItem
											key={index}
											disabled={isSubmitting}
											selected={values.position === position._id}
											onClick={() => onChangeFilterPosition(position._id, setFieldValue, submitForm)}
										>
											<PositionNameInList
												className={styles.positionName}
												name={position.name}
												characteristics={position.characteristics}
												isArchived={position.isArchived}
											/>
										</MenuItem>
									);
								})}
							</List>
						) : (
							<div style={{ textAlign: 'center', padding: 15 }}>
								{positions && !positions.length && searchTextPosition ? (
									<Typography variant="caption">Ничего не найдено</Typography>
								) : positions && !positions.length ? (
									<Typography variant="caption">Позиций не создано</Typography>
								) : (
									<CircularProgress size={20} />
								)}
							</div>
						)}
					</Dropdown>
				</Grid>

				{/* Filter Role */}
				<Grid item>
					<ButtonBase
						ref={refDropdownRole}
						className={styles.filterButtonLink}
						onClick={() => handlerDropdown('dropdownRole')}
						disableRipple
					>
						<span>{FilterRoleTransform(values.role, allMembers, isLoadingAllMembers)}</span>
						<FontAwesomeIcon icon={['far', 'angle-down']} />
					</ButtonBase>

					<Dropdown
						anchor={refDropdownRole}
						open={dropdownRole}
						onClose={() => handlerDropdown('dropdownRole')}
						placement="bottom-start"
						headerElement={
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
									<ButtonBase onClick={onClearSearchTextMember} className={styles.filterSearchTextFieldClear}>
										<FontAwesomeIcon icon={['fal', 'times']} />
									</ButtonBase>
								) : null}
							</div>
						}
						innerContentStyle={{ width: 250, maxHeight: 300, overflow: 'auto' }}
					>
						{!isLoadingAllMembers && members && members.length ? (
							<List>
								{!searchTextMember
									? roles.map((role, index) => (
											<MenuItem
												key={index}
												disabled={isSubmitting}
												selected={values.role === role}
												onClick={() => onChangeFilterRole(role, setFieldValue, submitForm)}
											>
												{FilterRoleTransform(role)}
											</MenuItem>
									  ))
									: null}
								{members.map((member, index) => (
									<MenuItem
										key={index}
										disabled={isSubmitting}
										selected={values.role === member._id}
										onClick={() => onChangeFilterRole(member._id, setFieldValue, submitForm)}
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
							</List>
						) : (
							<div style={{ textAlign: 'center', padding: 15 }}>
								{members && !members.length ? <Typography variant="caption">Ничего не найдено</Typography> : <CircularProgress size={20} />}
							</div>
						)}
					</Dropdown>
				</Grid>

				{/* Filter Only Canceled */}
				<Grid item>
					<Tooltip title="Показывать только отменённые списания">
						<ButtonBase
							className={ClassNames({
								[styles.filterButtonOnlyCanceled]: true,
								[styles.filterButtonOnlyCanceledActive]: values.onlyCanceled,
							})}
							onClick={() => onChangeFilterOnlyCanceled(!values.onlyCanceled, setFieldValue, submitForm)}
							disableRipple
						>
							<FontAwesomeIcon icon={['far', 'undo']} />
						</ButtonBase>
					</Tooltip>
				</Grid>

				<Grid item style={{ marginLeft: 'auto' }}>
					{!isMonthActive() || values.position !== 'all' || values.role !== 'all' || values.onlyCanceled !== false ? (
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
