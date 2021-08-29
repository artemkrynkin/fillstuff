import React, { useState, useRef } from 'react';
import ClassNames from 'classnames';
import moment from 'moment';
import { Form } from 'formik';
import DatePicker from 'react-datepicker';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import MenuList from '@material-ui/core/MenuList';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormLabel from '@material-ui/core/FormLabel';

import { memberRoleTransform } from 'shared/roles-access-rights';

import { weekActive, monthActive, paginationCalendarFormat } from 'src/components/Pagination/utils';
import Dropdown from 'src/components/Dropdown';
import PositionSummary from 'src/components/PositionSummary';
import MenuItem from 'src/components/MenuItem';
import UserSummary from 'src/components/UserSummary';
import HeaderDatepicker from 'src/components/Datepicker/Header';

import { FilterSearchTextField } from '../components/Filter.styles';
import styles from './Filter.module.css';

const roles = ['all', 'owners', 'admins', 'artists'];
const FilterRoleTransform = (roleSelected, members, loading) => {
	switch (roleSelected) {
		case 'all':
			return 'Все участники';
		case 'owners':
			return 'Владельцы';
		case 'admins':
			return 'Администраторы';
		case 'artists':
			return 'Мастера';
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
			return 'Платные позиции';
		case 'free':
			return 'Бесплатные позиции';
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
		.reduce((fullName, characteristic) => `${fullName} ${characteristic.name}`, position.name)
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

	const members = !isLoadingAllMembers && allMembers ? allMembers.filter(member => findMemberByName(member, searchTextMember)) : null;

	const positions =
		!isLoadingAllPositions && allPositions ? allPositions.filter(position => findPositionByFullName(position, searchTextPosition)) : null;

	const isWeekActive = currentWeek => weekActive(values.dateStartView, values.dateEndView, currentWeek);
	const isMonthActive = currentMonth => monthActive(values.dateStartView, values.dateEndView, currentMonth);

	return (
		<Form>
			<div className={styles.bottomContainer}>
				{/* Filter Date */}
				<div className={styles.bottomContainerItem}>
					<ButtonBase
						ref={refDropdownDate}
						className={styles.filterButtonLink}
						onClick={() => {
							handlerDropdown('dropdownDate');
							handlerDropdown('dropdownDateRange', false);
						}}
					>
						{!values.dateStartView && !values.dateEndView ? (
							<span>За всё время</span>
						) : isMonthActive() ? (
							<span>За текущий месяц</span>
						) : isWeekActive() ? (
							<span>За текущую неделю</span>
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
						{!values.dateStartView && !values.dateEndView ? <FontAwesomeIcon icon={['far', 'angle-down']} fixedWidth /> : null}
					</ButtonBase>
					{values.dateStartView || values.dateEndView ? (
						<ButtonBase
							onClick={() => onChangeFilterDate('allTime', setFieldValue, submitForm)}
							className={styles.filterButtonLinkReset}
							tabIndex={-1}
						>
							<FontAwesomeIcon icon={['far', 'times']} fixedWidth />
						</ButtonBase>
					) : null}
				</div>

				{/* Filter Position */}
				<div className={styles.bottomContainerItem}>
					<ButtonBase
						ref={refDropdownPosition}
						className={styles.filterButtonLink}
						onClick={() => handlerDropdown('dropdownPosition', null)}
					>
						<span>{FilterPositionTransform(values.position, allPositions, isLoadingAllPositions)}</span>
						{values.position === 'all' ? <FontAwesomeIcon icon={['far', 'angle-down']} fixedWidth /> : null}
					</ButtonBase>
					{values.position !== 'all' ? (
						<ButtonBase
							onClick={() => onChangeFilterPosition('all', setFieldValue, submitForm)}
							className={styles.filterButtonLinkReset}
							tabIndex={-1}
						>
							<FontAwesomeIcon icon={['far', 'times']} fixedWidth />
						</ButtonBase>
					) : null}
				</div>

				{/* Filter Role */}
				<div className={styles.bottomContainerItem}>
					<ButtonBase ref={refDropdownRole} className={styles.filterButtonLink} onClick={() => handlerDropdown('dropdownRole', null)}>
						<span>{FilterRoleTransform(values.role, allMembers, isLoadingAllMembers)}</span>
						{values.role === 'all' ? <FontAwesomeIcon icon={['far', 'angle-down']} fixedWidth /> : null}
					</ButtonBase>
					{values.role !== 'all' ? (
						<ButtonBase
							onClick={() => onChangeFilterRole('all', setFieldValue, submitForm)}
							className={styles.filterButtonLinkReset}
							tabIndex={-1}
						>
							<FontAwesomeIcon icon={['far', 'times']} fixedWidth />
						</ButtonBase>
					) : null}
				</div>

				{/* Filter Only Canceled */}
				<div className={styles.bottomContainerItem}>
					<Tooltip title="Показывать только отменённые списания">
						<IconButton
							className={ClassNames({
								[styles.filterButtonOnlyCanceled]: true,
								[styles.filterButtonOnlyCanceledActive]: values.onlyCanceled,
							})}
							onClick={() => onChangeFilterOnlyCanceled(!values.onlyCanceled, setFieldValue, submitForm)}
							disableRipple
						>
							<FontAwesomeIcon icon={['far', 'undo']} />
						</IconButton>
					</Tooltip>
				</div>

				<div className={styles.bottomContainerItem} style={{ marginLeft: 'auto', marginRight: 10 }}>
					{values.dateStartView ||
					values.dateEndView ||
					values.position !== 'all' ||
					values.role !== 'all' ||
					values.onlyCanceled !== false ? (
						<Tooltip title="Сбросить все фильтры">
							<IconButton
								className={ClassNames({
									[styles.filterButtonResetAll]: true,
									destructiveAction: true,
								})}
								onClick={() => onResetAllFilters(setFieldValue, submitForm)}
							>
								<FontAwesomeIcon icon={['fal', 'times']} fixedWidth />
							</IconButton>
						</Tooltip>
					) : null}
				</div>
			</div>

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
							За всё время
						</MenuItem>
						<MenuItem
							disabled={isSubmitting}
							selected={isMonthActive()}
							onClick={() => onChangeFilterDate('currentMonth', setFieldValue, submitForm)}
							tabIndex={0}
						>
							За текущий месяц
						</MenuItem>
						<MenuItem
							disabled={isSubmitting}
							selected={isWeekActive()}
							onClick={() => onChangeFilterDate('currentWeek', setFieldValue, submitForm)}
							tabIndex={0}
						>
							За текущую неделю
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
        <DatePicker
          selected={values.dateStart}
          renderCustomHeader={HeaderDatepicker}
          onChange={dates => {
            const dateStartValue = dates[0] ? moment(dates[0])
              .set({ hour: 0, minute: 0, second: 0 })
              .valueOf() : null;
            const dateEndValue = dates[1] ? moment(dates[1])
              .set({ hour: 23, minute: 59, second: 59 })
              .valueOf() : null;

            setFieldValue('dateStart', dateStartValue);
            setFieldValue('dateEnd', dateEndValue);
          }}
          startDate={values.dateStart}
          endDate={values.dateEnd}
          disabledKeyboardNavigation
          selectsRange
          inline
        />
				<DropdownFooter isSubmitting={isSubmitting} disabledSubmit={!values.dateStart || !values.dateEnd} />
			</Dropdown>

			{/* Filter Position */}
			<Dropdown
				anchor={refDropdownPosition}
				open={dropdownPosition}
				onClose={() => handlerDropdown('dropdownPosition', false)}
				placement="bottom-start"
				header={
					<div className={styles.filterSearchTextFieldContainer}>
						<FilterSearchTextField
							inputRef={searchTextFieldPosition}
							placeholder="Введите название позиции"
							value={searchTextPosition}
							onChange={onTypeSearchTextPosition}
							fullWidth
						/>
						{searchTextPosition ? (
							<ButtonBase onClick={onClearSearchTextPosition} className={styles.filterSearchTextFieldClear} tabIndex={-1}>
								<FontAwesomeIcon icon={['fal', 'times']} />
							</ButtonBase>
						) : null}
					</div>
				}
				innerContentStyle={{ width: 250, maxHeight: 300, overflow: 'auto' }}
			>
				{!isLoadingAllPositions && positions && positions.length ? (
					<MenuList autoFocusItem={dropdownPosition && !searchTextFieldPosition.current}>
						{!searchTextPosition
							? positionList.map((position, index) => (
									<MenuItem
										key={index}
										disabled={isSubmitting}
										selected={values.position === position}
										onClick={() => onChangeFilterPosition(position, setFieldValue, submitForm)}
										tabIndex={0}
									>
										{FilterPositionTransform(position)}
									</MenuItem>
							  ))
							: null}
						{positions.map((position, index) => {
							if (position.isArchived && !searchTextPosition) return null;

							const positionBadges = (badges = []) => {
								if (position.isArchived) badges.push('archived');

								return badges;
							};

							return (
								<MenuItem
									key={index}
									disabled={isSubmitting}
									selected={values.position === position._id}
									onClick={() => onChangeFilterPosition(position._id, setFieldValue, submitForm)}
									tabIndex={0}
								>
									<PositionSummary name={position.name} characteristics={position.characteristics} badges={positionBadges()} avatar />
								</MenuItem>
							);
						})}
					</MenuList>
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

			{/* Filter Role */}
			<Dropdown
				anchor={refDropdownRole}
				open={dropdownRole}
				onClose={() => handlerDropdown('dropdownRole', false)}
				placement="bottom-start"
				header={
					<div className={styles.filterSearchTextFieldContainer}>
						<FilterSearchTextField
							inputRef={searchTextFieldMember}
							placeholder="Введите имя"
							value={searchTextMember}
							onChange={onTypeSearchTextMember}
							fullWidth
						/>
						{searchTextMember ? (
							<ButtonBase onClick={onClearSearchTextMember} className={styles.filterSearchTextFieldClear} tabIndex={-1}>
								<FontAwesomeIcon icon={['fal', 'times']} />
							</ButtonBase>
						) : null}
					</div>
				}
				innerContentStyle={{ width: 250, maxHeight: 305, overflow: 'auto' }}
			>
				{!isLoadingAllMembers && members && members.length ? (
					<>
						{members.filter(member => !member.deactivated).length ? (
							<MenuList autoFocusItem={dropdownRole && !searchTextFieldMember.current}>
								{!searchTextMember
									? roles.map((role, index) => (
											<MenuItem
												key={index}
												disabled={isSubmitting}
												selected={values.role === role}
												onClick={() => onChangeFilterRole(role, setFieldValue, submitForm)}
												tabIndex={0}
											>
												{FilterRoleTransform(role)}
											</MenuItem>
									  ))
									: null}
								{members
									.filter(member => !member.deactivated)
									.map((member, index) => (
										<MenuItem
											key={index}
											disabled={isSubmitting}
											selected={values.role === member._id}
											onClick={() => onChangeFilterRole(member._id, setFieldValue, submitForm)}
											tabIndex={0}
										>
											<UserSummary
												src={member.user.picture}
												title={member.user.name}
												subtitle={memberRoleTransform(member.roles).join(', ')}
											/>
										</MenuItem>
									))}
							</MenuList>
						) : null}
						{members.filter(member => member.deactivated).length ? (
							<MenuList>
								<FormLabel style={{ padding: '0 8px 8px' }} component="div">
									Отключённые участники
								</FormLabel>
								{members
									.filter(member => member.deactivated)
									.map((member, index) => (
										<MenuItem
											key={index}
											disabled={isSubmitting}
											selected={values.role === member._id}
											onClick={() => onChangeFilterRole(member._id, setFieldValue, submitForm)}
											tabIndex={0}
										>
											<UserSummary
												src={member.user.picture}
												title={member.user.name}
												subtitle={memberRoleTransform(member.roles).join(', ')}
											/>
										</MenuItem>
									))}
							</MenuList>
						) : null}
					</>
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
