import React from 'react';
import { Form } from 'formik';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
// import Typography from '@material-ui/core/Typography';
// import Avatar from '@material-ui/core/Avatar';

// import { memberRoleTransform } from 'shared/roles-access-rights';

import Dropdown from 'src/components/Dropdown';

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
		onChangeFilterRole,
		onResetAllFilters,
		members: {
			data: members,
			isFetching: isLoadingMembers,
			// error: errorMembers
		},
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
			<Grid container>
				{/* Filter Role */}
				<Grid item>
					<ButtonBase
						ref={refDropdownRole}
						className={styles.filterButtonLink}
						onClick={() => handlerDropdown('dropdownRole')}
						disableRipple
					>
						<span>{FilterRoleTransform(values.role, members, isLoadingMembers)}</span>
						<FontAwesomeIcon icon={['far', 'angle-down']} />
					</ButtonBase>

					<Dropdown
						anchor={refDropdownRole}
						open={dropdownRole}
						onClose={() => handlerDropdown('dropdownRole')}
						placement="bottom-start"
						innerContentStyle={{ maxHeight: 300, overflow: 'auto' }}
					>
						{/*{!isLoadingMembers && members && members.length ? (*/}
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
									{FilterRoleTransform(role)}
								</ListItem>
							))}
							{/*{members.map((member, index) => (*/}
							{/*	<ListItem*/}
							{/*		key={index}*/}
							{/*		disabled={isSubmitting}*/}
							{/*		selected={values.role === member._id}*/}
							{/*		onClick={() => onChangeFilterRole(member._id, setFieldValue, submitForm)}*/}
							{/*		component={MenuItem}*/}
							{/*		button*/}
							{/*	>*/}
							{/*		<div className={styles.user}>*/}
							{/*			<Avatar*/}
							{/*				className={styles.userPhoto}*/}
							{/*				src={member.user.avatar}*/}
							{/*				alt={member.user.name}*/}
							{/*				children={<div className={styles.userIcon} children={<FontAwesomeIcon icon={['fas', 'user-alt']} />} />}*/}
							{/*			/>*/}
							{/*			<Grid direction="column" container>*/}
							{/*				<div className={styles.userTitle}>{member.user.name}</div>*/}
							{/*				<div className={styles.userCaption}>{memberRoleTransform(member.roles).join(', ')}</div>*/}
							{/*			</Grid>*/}
							{/*		</div>*/}
							{/*	</ListItem>*/}
							{/*))}*/}
						</List>
						{/*) : (*/}
						{/*	<div style={{ textAlign: 'center', padding: 10 }}>*/}
						{/*		{members && !members.length ? (*/}
						{/*			<Typography variant="caption">В команде нет участников.</Typography>*/}
						{/*		) : (*/}
						{/*			<CircularProgress size={20} />*/}
						{/*		)}*/}
						{/*	</div>*/}
						{/*)}*/}
					</Dropdown>
				</Grid>

				<Grid item style={{ marginLeft: 'auto' }}>
					{values.role !== 'all' ? (
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
