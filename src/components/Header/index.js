import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

import Dropdown from 'src/components/Dropdown';

import ColumnLeft from './components/ColumnLeft';

import { logout } from 'src/actions/authentication';

import styles from './index.module.css';

class Header extends Component {
	state = {
		dropdownProfile: false,
	};

	refDropdownProfile = createRef();

	onHandleDropdownProfile = () => this.setState({ dropdownProfile: !this.state.dropdownProfile });

	onLogout = () => {
		this.props.logout();
	};

	render() {
		const { pageName, pageTitle, theme, position = 'sticky', currentUser, currentStudio, pageParams } = this.props;
		const { dropdownProfile } = this.state;

		let headerClasses = ClassNames({
			[styles.container]: true,
			[styles.container_themeBg]: theme === 'bg',
		});

		return (
			<AppBar className={headerClasses} position={position} elevation={0}>
				<ColumnLeft
					pageName={pageName}
					pageTitle={pageTitle}
					theme={theme}
					currentUser={currentUser}
					currentStudio={currentStudio}
					pageParams={pageParams}
				/>
				<div className={styles.column_right}>
					<div className={styles.columnGroup_right}>
						<div className={styles.profile} ref={this.refDropdownProfile} onClick={this.onHandleDropdownProfile}>
							<div className={styles.profileName}>{currentUser.name ? currentUser.name : currentUser.email}</div>
							<div className={styles.avatar}>
								{currentUser.avatar ? <img src={currentUser.avatar} alt="" /> : <FontAwesomeIcon icon={['fas', 'user-alt']} />}
							</div>
							<FontAwesomeIcon icon={['fas', 'angle-down']} className={dropdownProfile ? 'open' : ''} />
						</div>
					</div>
				</div>

				<Dropdown anchor={this.refDropdownProfile} open={dropdownProfile} onClose={this.onHandleDropdownProfile} placement="bottom-end">
					<MenuList>
						<MenuItem onClick={this.onHandleDropdownProfile} to={'/user-settings'} component={Link}>
							Настройки аккаунта
						</MenuItem>
						<MenuItem onClick={this.onHandleDropdownProfile}>Оплата</MenuItem>
					</MenuList>
					<Divider />
					<MenuList>
						<MenuItem onClick={this.onLogout}>Выйти</MenuItem>
					</MenuList>
				</Dropdown>
			</AppBar>
		);
	}
}

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

export default connect(mapStateToProps, mapDispatchToProps)(Header);
