import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';

import Dropdown from 'src/components/Dropdown';

import { logout } from 'src/actions/authentication';

import styles from './index.module.css';

const HelpPanel = props => {
	const { currentUser } = props;
	const refDropdownProfile = useRef(null);
	const [dropdownProfile, setDropdownProfile] = useState(false);

	const onHandleDropdownProfile = value => setDropdownProfile(value === null || value === undefined ? prevValue => !prevValue : value);

	const onLogout = () => props.logout();

	return (
		<div className={styles.container}>
			<span className={styles.containerShadow} />

			<Grid className={styles.wrapper} direction="column" justify="space-between" alignItems="center" container>
				<Link className={styles.logo} to="/" />
				<div className={styles.profile} ref={refDropdownProfile} onClick={() => onHandleDropdownProfile()}>
					<Avatar
						className={ClassNames({
							[styles.avatarImage]: true,
							[styles.avatarImageActive]: dropdownProfile,
						})}
						src={currentUser.avatar}
						alt={currentUser.name}
					>
						<div className={styles.avatarUserIcon}>
							<FontAwesomeIcon icon={['fas', 'user-alt']} />
						</div>
					</Avatar>
				</div>
			</Grid>

			<Dropdown
				anchor={refDropdownProfile}
				open={dropdownProfile}
				onClose={() => onHandleDropdownProfile(false)}
				placement="right-end"
				style={{ marginLeft: 5 }}
			>
				<MenuList>
					<MenuItem onClick={() => onHandleDropdownProfile(false)} to={'/user-settings'} component={Link}>
						Настройки&nbsp;аккаунта
					</MenuItem>
					<MenuItem onClick={() => onHandleDropdownProfile(false)}>Оплата</MenuItem>
				</MenuList>
				<Divider />
				<MenuList>
					<MenuItem
						onClick={() => {
							onHandleDropdownProfile(false);
							onLogout();
						}}
					>
						Выйти
					</MenuItem>
				</MenuList>
			</Dropdown>
		</div>
	);
};

const mapStateToProps = state => {
	return {
		currentUser: state.user.data,
		currentStudio: state.studio.data,
	};
};

const mapDispatchToProps = () => {
	return {
		logout: () => logout(),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(HelpPanel);
