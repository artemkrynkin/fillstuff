import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';

import Dropdown from 'src/components/Dropdown';
import Avatar from 'src/components/Avatar';

import { logout } from 'src/actions/authentication';

import { useStylesAvatar } from './styles';
import styles from './index.module.css';

const HelpPanel = props => {
	const { currentUser } = props;
	const refDropdownProfile = useRef(null);
	const [dropdownProfile, setDropdownProfile] = useState(false);
	const classesAvatar = useStylesAvatar(dropdownProfile);

	const onHandleDropdownProfile = value => setDropdownProfile(value === null || value === undefined ? prevValue => !prevValue : value);

	const onLogout = () => props.logout();

	return (
		<div className={styles.container}>
			<span className={styles.containerShadow} />

			<Grid className={styles.wrapper} direction="column" justify="space-between" alignItems="center" container>
				<Link className={styles.logo} to="/" />
				<Tooltip title={currentUser.name}>
					<div className={styles.userAvatar} ref={refDropdownProfile} onClick={() => onHandleDropdownProfile()}>
						<Avatar classes={classesAvatar} src={currentUser.avatar} />
					</div>
				</Tooltip>
			</Grid>

			<Dropdown
				anchor={refDropdownProfile}
				open={dropdownProfile}
				onClose={() => onHandleDropdownProfile(false)}
				placement="right-end"
				style={{ marginLeft: 10 }}
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
