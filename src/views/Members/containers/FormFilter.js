import React from 'react';
import { Field, Form } from 'formik';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ButtonBase from '@material-ui/core/ButtonBase';
import IconButton from '@material-ui/core/IconButton';
import MenuList from '@material-ui/core/MenuList';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';

import Dropdown from 'src/components/Dropdown';
import MenuItem from 'src/components/MenuItem';

import { SearchTextField } from '../components/Filter.styles';
import styles from './Filter.module.css';

const roles = ['all', 'owners', 'admins', 'artists'];
const FilterRoleTransform = roleSelected => {
	switch (roleSelected) {
		case 'all':
			return 'Все роли';
		case 'owners':
			return 'Владельцы';
		case 'admins':
			return 'Администраторы';
		case 'artists':
			return 'Мастера';
		default:
			return null;
	}
};

const FormFilter = props => {
	const {
		handlerDropdown,
		onChangeFilterName,
		onClearFilterName,
		onChangeFilterRole,
		onResetAllFilters,
		refFilterNameInput,
		dropdownRole: { state: dropdownRole, ref: refDropdownRole },
		formikProps: {
			// errors,
			isSubmitting,
			values,
			setFieldValue,
			submitForm,
		},
	} = props;

	return (
		<Form>
			<div className={styles.topContainer}>
				<Field
					inputRef={refFilterNameInput}
					name="name"
					as={SearchTextField}
					inputProps={{
						onChange: event => onChangeFilterName(event, setFieldValue, submitForm),
					}}
					placeholder="Поиск по имени участника"
					fullWidth
				/>
				{values.name && !isSubmitting ? (
					<ButtonBase
						onClick={() => onClearFilterName(setFieldValue, submitForm)}
						className={styles.textFieldFilterNameClear}
						tabIndex={-1}
					>
						<FontAwesomeIcon icon={['fal', 'times']} />
					</ButtonBase>
				) : null}
				{isSubmitting ? <CircularProgress className={styles.loadingForm} size={20} /> : null}
			</div>

			<div className={styles.bottomContainer}>
				{/* Filter Role */}
				<div className={styles.bottomContainerItem}>
					<ButtonBase ref={refDropdownRole} className={styles.filterButtonLink} onClick={() => handlerDropdown('dropdownRole')}>
						<span>{FilterRoleTransform(values.role)}</span>
						{values.role === 'all' ? <FontAwesomeIcon icon={['far', 'angle-down']} /> : null}
					</ButtonBase>
					{values.role !== 'all' ? (
						<ButtonBase
							onClick={() => onChangeFilterRole('all', setFieldValue, submitForm)}
							className={styles.filterButtonLinkReset}
							tabIndex={-1}
						>
							<FontAwesomeIcon icon={['fal', 'times']} />
						</ButtonBase>
					) : null}
				</div>

				<div className={styles.bottomContainerItem} style={{ marginLeft: 'auto', marginRight: 10 }}>
					{values.name || values.role !== 'all' ? (
						<Tooltip title="Сбросить все фильтры">
							<IconButton
								className={ClassNames({
									[styles.filterButtonResetAll]: true,
									destructiveAction: true,
								})}
								onClick={() => onResetAllFilters(setFieldValue, submitForm)}
								color="primary"
							>
								<FontAwesomeIcon icon={['fal', 'times']} />
							</IconButton>
						</Tooltip>
					) : null}
				</div>
			</div>

			{/* Filter Role */}
			<Dropdown
				anchor={refDropdownRole}
				open={dropdownRole}
				onClose={() => handlerDropdown('dropdownRole', false)}
				placement="bottom-start"
				innerContentStyle={{ width: 190, maxHeight: 300, overflow: 'auto' }}
			>
				<MenuList autoFocusItem={dropdownRole}>
					{roles.map((role, index) => (
						<MenuItem
							key={index}
							disabled={isSubmitting}
							selected={values.role === role}
							onClick={() => onChangeFilterRole(role, setFieldValue, submitForm)}
							tabIndex={0}
						>
							{FilterRoleTransform(role)}
						</MenuItem>
					))}
				</MenuList>
			</Dropdown>
		</Form>
	);
};

export default FormFilter;
