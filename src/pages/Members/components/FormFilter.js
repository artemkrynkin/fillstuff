import React from 'react';
import { Field, Form } from 'formik';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';

import Dropdown from 'src/components/Dropdown';
import MenuItem from 'src/components/MenuItem';

import { SearchTextField } from './Filter.styles';
import styles from './Filter.module.css';

const roles = ['all', 'owners', 'admins', 'artists'];
const FilterRoleTransform = (roleSelected, members, loading) => {
	switch (roleSelected) {
		case 'all':
			return 'Все роли';
		case 'owners':
			return 'Только владельцы';
		case 'admins':
			return 'Только администраторы';
		case 'artists':
			return 'Только мастера';
		default:
			if (!loading) {
				if (members && members.length) {
					const member = members.find(member => member._id === roleSelected);

					return member ? member.user.name : null;
				} else {
					return 'Не найдено';
				}
			} else {
				return <CircularProgress size={13} />;
			}
	}
};

const FormFilter = props => {
	const {
		handlerDropdown,
		onChangeFilterName,
		onClearFilterName,
		onChangeFilterRole,
		onResetAllFilters,
		members: {
			data: members,
			isFetching: isLoadingMembers,
			// error: errorMembers
		},
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
			<Grid className={styles.topContainer} container>
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
					<ButtonBase onClick={() => onClearFilterName(setFieldValue, submitForm)} className={styles.textFieldFilterNameClear}>
						<FontAwesomeIcon icon={['fal', 'times']} />
					</ButtonBase>
				) : null}
				{isSubmitting ? <CircularProgress className={styles.loadingForm} size={20} /> : null}
			</Grid>

			<Grid className={styles.bottomContainer} container>
				{/* Filter Role */}
				<Grid item>
					<ButtonBase ref={refDropdownRole} className={styles.filterButtonLink} onClick={() => handlerDropdown('dropdownRole')}>
						<span>{FilterRoleTransform(values.role, members, isLoadingMembers)}</span>
						<FontAwesomeIcon icon={['far', 'angle-down']} />
					</ButtonBase>

					<Dropdown
						anchor={refDropdownRole}
						open={dropdownRole}
						onClose={() => handlerDropdown('dropdownRole')}
						placement="bottom-start"
						innerContentStyle={{ width: 220, maxHeight: 300, overflow: 'auto' }}
					>
						<List>
							{roles.map((role, index) => (
								<MenuItem
									key={index}
									disabled={isSubmitting}
									selected={values.role === role}
									onClick={() => onChangeFilterRole(role, setFieldValue, submitForm)}
								>
									{FilterRoleTransform(role)}
								</MenuItem>
							))}
						</List>
					</Dropdown>
				</Grid>

				<Grid item style={{ marginLeft: 'auto' }}>
					{values.name || values.role !== 'all' ? (
						<ButtonBase onClick={() => onResetAllFilters(setFieldValue, submitForm)} className={styles.filterButtonLinkRed}>
							<span>Сбросить фильтры</span>
						</ButtonBase>
					) : null}
				</Grid>
			</Grid>
		</Form>
	);
};

export default FormFilter;
