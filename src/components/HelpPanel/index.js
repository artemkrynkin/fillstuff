import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Grid from '@material-ui/core/Grid';

import Dropdown from 'src/components/Dropdown';

import { logout } from 'src/actions/authentication';

import styles from './index.module.css';

const HelpPanel = props => {
	const { currentUser } = props;
	const refDropdownProfile = useRef(null);
	const [dropdownProfile, setDropdownProfile] = useState(false);

	const onHandleDropdownProfile = () => setDropdownProfile(prevValue => !prevValue);

	const onLogout = () => props.logout();

	return (
		<div className={styles.container}>
			<span className={styles.containerShadow} />

			<Grid className={styles.wrapper} direction="column" justify="space-between" alignItems="center" container>
				<Link className={styles.logo} to="/" />
				<div className={styles.profile} ref={refDropdownProfile} onClick={onHandleDropdownProfile}>
					<div
						className={ClassNames({
							[styles.avatar]: true,
							[styles.avatarActive]: dropdownProfile,
						})}
					>
						{currentUser.avatar ? <img src={currentUser.avatar} alt="" /> : <FontAwesomeIcon icon={['fas', 'user-alt']} />}
					</div>
				</div>
			</Grid>

			<Dropdown
				anchor={refDropdownProfile}
				open={dropdownProfile}
				onClose={onHandleDropdownProfile}
				placement="right-end"
				style={{ marginLeft: 5, width: 150 }}
			>
				<MenuList>
					<MenuItem onClick={onHandleDropdownProfile} to={'/user-settings'} component={Link}>
						Настройки аккаунта
					</MenuItem>
					<MenuItem onClick={onHandleDropdownProfile}>Оплата</MenuItem>
				</MenuList>
				<Divider />
				<MenuList>
					<MenuItem onClick={onLogout}>Выйти</MenuItem>
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
