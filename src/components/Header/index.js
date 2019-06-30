import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Popover from '@material-ui/core/Popover';

import { logout } from 'src/actions/authentication';

import ColumnLeft from './components/ColumnLeft';

import './index.styl';

class Header extends Component {
	state = {
		profileMenuOpen: null,
	};

	onOpenProfileMenu = event => {
		this.setState({ profileMenuOpen: event.currentTarget });
	};

	onCloseProfileMenu = () => {
		this.setState({ profileMenuOpen: null });
	};

	onLogout = () => {
		this.props.logout();
	};

	render() {
		const { profileMenuOpen } = this.state;
		const { pageName, pageTitle, theme, position = 'sticky', currentUser, currentStock } = this.props;

		let headerClasses = ClassNames({
			header: true,
			header_theme_bg: theme === 'bg',
		});

		return (
			<AppBar className={headerClasses} position={position}>
				<ColumnLeft
					pageName={pageName}
					pageTitle={pageTitle}
					theme={theme}
					currentUser={currentUser}
					currentStock={currentStock}
				/>
				<div className="header__column_right">
					<div className="header__column-group_right">
						<div className="header__profile" aria-haspopup="true" onClick={this.onOpenProfileMenu}>
							<div className="header__profile-name">{currentUser.name ? currentUser.name : currentUser.email}</div>
							<div className="header__profile-photo">
								{currentUser.profilePhoto ? (
									<img src={currentUser.profilePhoto} alt="" />
								) : (
									<FontAwesomeIcon icon={['fas', 'user-alt']} />
								)}
							</div>
							<FontAwesomeIcon icon={['fas', 'angle-down']} className={profileMenuOpen ? 'open' : ''} />
						</div>
					</div>
				</div>

				<Popover
					anchorEl={profileMenuOpen}
					open={Boolean(profileMenuOpen)}
					onClose={this.onCloseProfileMenu}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'right',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					transitionDuration={150}
					elevation={2}
				>
					<MenuList>
						<MenuItem
							to={'/settings'}
							component={React.forwardRef((props, ref) => (
								<Link innerRef={ref} {...props} />
							))}
							onClick={this.onCloseProfileMenu}
						>
							Настройки аккаунта
						</MenuItem>
						<MenuItem onClick={this.onCloseProfileMenu}>Оплата</MenuItem>
					</MenuList>
					<Divider />
					<MenuList>
						<MenuItem onClick={this.onLogout}>Выйти</MenuItem>
					</MenuList>
				</Popover>
			</AppBar>
		);
	}
}

const mapStateToProps = state => {
	const stockIndex = state.stocks.data.findIndex(stock => stock._id === state.user.data.activeStockId);

	return {
		currentUser: state.user.data,
		currentStock: state.user.data.activeStockId ? state.stocks.data[stockIndex] : null,
		stocks: state.stocks.data,
	};
};

const mapDispatchToProps = () => {
	return {
		logout: () => logout(),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Header);
