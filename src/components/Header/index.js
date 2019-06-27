import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';

// import { Formik, Form, Field } from 'formik';
// import { TextField } from 'formik-material-ui';
// import * as Yup from 'yup';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import Button from '@material-ui/core/Button';
// import CircularProgress from '@material-ui/core/CircularProgress';
// import Dialog from '@material-ui/core/Dialog';
// import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Popover from '@material-ui/core/Popover';
// import Typography from '@material-ui/core/Typography';

// import { history } from 'src/helpers/history';
// import { changeStockCurrentUrl } from 'src/helpers/utils';

// import { PDDialogTitle, PDDialogActions } from 'src/components/Dialog';

import { logout } from 'src/actions/authentication';
// import { createStock } from 'src/actions/stocks';
// import { changeActiveStock } from 'src/actions/user';

import ColumnLeft from './components/ColumnLeft';

import './index.styl';

// const createStockSchema = Yup.object().shape({
// 	name: Yup.string()
// 		// eslint-disable-next-line
// 		.min(2, 'Название склада не может быть короче ${min} символов')
// 		.required('Обязательное поле'),
// });

class Header extends Component {
	state = {
		profileMenuOpen: null,
		// stocksMenuOpen: null,
		// dialogCreateStock: false,
	};

	// onOpenStocksMenu = event => {
	// 	this.setState({ stocksMenuOpen: event.currentTarget });
	// };
	//
	// onCloseStocksMenu = () => {
	// 	this.setState({ stocksMenuOpen: null });
	// };
	//
	// onOpenDialogCreateStock = () => {
	// 	this.setState({ dialogCreateStock: true });
	// };

	// onCloseDialogCreateStock = () => {
	// 	this.setState({ dialogCreateStock: false });
	// };

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
		const {
			// stocksMenuOpen,
			// dialogCreateStock,
			profileMenuOpen,
		} = this.state;
		const {
			pageName,
			pageTitle,
			theme,
			position = 'sticky',
			currentUser,
			currentStock,
			// stocks
		} = this.props;

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
					{/*{theme !== 'bg' ? (*/}
					{/*	<div className="header__column-group_right">*/}
					{/*		<Button*/}
					{/*			key="button"*/}
					{/*			className="header__stock-btn mui-btn-ct400"*/}
					{/*			variant="contained"*/}
					{/*			color="primary"*/}
					{/*			aria-haspopup="true"*/}
					{/*			onClick={this.onOpenStocksMenu}*/}
					{/*		>*/}
					{/*			{currentStock ? currentStock.name : 'Выберите склад'}*/}
					{/*			<FontAwesomeIcon icon={['fas', 'angle-down']} />*/}
					{/*		</Button>*/}
					{/*	</div>*/}
					{/*) : null}*/}
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

				{/*<Popover*/}
				{/*	anchorEl={stocksMenuOpen}*/}
				{/*	open={Boolean(stocksMenuOpen)}*/}
				{/*	onClose={this.onCloseStocksMenu}*/}
				{/*	anchorOrigin={{*/}
				{/*		vertical: 'bottom',*/}
				{/*		horizontal: 'center',*/}
				{/*	}}*/}
				{/*	transformOrigin={{*/}
				{/*		vertical: -7,*/}
				{/*		horizontal: 'center',*/}
				{/*	}}*/}
				{/*	transitionDuration={150}*/}
				{/*	elevation={2}*/}
				{/*>*/}
				{/*	{stocks.length ? (*/}
				{/*		<MenuList>*/}
				{/*			{stocks.map((stock, index) => (*/}
				{/*				<MenuItem*/}
				{/*					key={index}*/}
				{/*					selected={stock._id === currentUser.activeStockId}*/}
				{/*					onClick={() => {*/}
				{/*						this.onCloseStocksMenu();*/}

				{/*						if (currentUser.activeStockId === stock._id)*/}
				{/*							return history.push({ pathname: changeStockCurrentUrl(stock._id) });*/}

				{/*						this.props.changeActiveStock(stock._id).then(() => {*/}
				{/*							history.push({ pathname: changeStockCurrentUrl(stock._id) });*/}
				{/*						});*/}
				{/*					}}*/}
				{/*				>*/}
				{/*					{stock.name}*/}
				{/*				</MenuItem>*/}
				{/*			))}*/}
				{/*		</MenuList>*/}
				{/*	) : (*/}
				{/*		<Typography variant="caption" style={{ padding: 20 }}>*/}
				{/*			У Вас еще нет ни одного склада.*/}
				{/*		</Typography>*/}
				{/*	)}*/}
				{/*	<Divider />*/}
				{/*	<MenuList>*/}
				{/*		<MenuItem*/}
				{/*			style={{ justifyContent: stocks.length ? 'flex-start' : 'center' }}*/}
				{/*			onClick={() => {*/}
				{/*				this.onCloseStocksMenu();*/}
				{/*				this.onOpenDialogCreateStock();*/}
				{/*			}}*/}
				{/*		>*/}
				{/*			{stocks.length ? 'Новый склад' : 'Создать склад'}*/}
				{/*		</MenuItem>*/}
				{/*	</MenuList>*/}
				{/*</Popover>*/}

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

				{/*<Dialog open={dialogCreateStock} onClose={this.onCloseDialogCreateStock} maxWidth="xs" fullWidth>*/}
				{/*	<PDDialogTitle theme="primary" onClose={this.onCloseDialogCreateStock}>*/}
				{/*		Новый склад*/}
				{/*	</PDDialogTitle>*/}
				{/*	<Formik*/}
				{/*		initialValues={{ name: '' }}*/}
				{/*		validationSchema={createStockSchema}*/}
				{/*		validateOnBlur={false}*/}
				{/*		validateOnChange={false}*/}
				{/*		onSubmit={(values, actions) => {*/}
				{/*			this.props.createStock(values).then(response => {*/}
				{/*				if (response.status === 'success') {*/}
				{/*					actions.resetForm();*/}
				{/*					this.onCloseDialogCreateStock();*/}
				{/*				} else {*/}
				{/*					if (response.data.formErrors) {*/}
				{/*						response.data.formErrors.forEach(error => {*/}
				{/*							actions.setFieldError(error.field, error.message);*/}
				{/*						});*/}
				{/*					}*/}

				{/*					actions.setSubmitting(false);*/}
				{/*				}*/}
				{/*			});*/}
				{/*		}}*/}
				{/*		render={({ errors, touched, isSubmitting }) => (*/}
				{/*			<Form>*/}
				{/*				<DialogContent>*/}
				{/*					<Field*/}
				{/*						name="name"*/}
				{/*						label="Название склада"*/}
				{/*						component={TextField}*/}
				{/*						validate={value => {*/}
				{/*							if (stocks && stocks.some(stock => stock.name === value)) {*/}
				{/*								return 'Склад с таким названием уже существует';*/}
				{/*							}*/}
				{/*						}}*/}
				{/*						inputProps={{*/}
				{/*							maxLength: 60,*/}
				{/*						}}*/}
				{/*						InputLabelProps={{*/}
				{/*							shrink: true,*/}
				{/*						}}*/}
				{/*						autoComplete="off"*/}
				{/*						autoFocus*/}
				{/*						fullWidth*/}
				{/*					/>*/}
				{/*				</DialogContent>*/}
				{/*				<PDDialogActions*/}
				{/*					leftHandleProps={{*/}
				{/*						handleProps: {*/}
				{/*							onClick: this.onCloseDialogCreateStock,*/}
				{/*						},*/}
				{/*						text: 'Закрыть',*/}
				{/*					}}*/}
				{/*					rightHandleProps={{*/}
				{/*						handleProps: {*/}
				{/*							type: 'submit',*/}
				{/*							disabled: isSubmitting,*/}
				{/*						},*/}
				{/*						text: isSubmitting ? <CircularProgress size={20} /> : 'Создать',*/}
				{/*					}}*/}
				{/*				/>*/}
				{/*			</Form>*/}
				{/*		)}*/}
				{/*	/>*/}
				{/*</Dialog>*/}
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
		// changeActiveStock: stockId => dispatch(changeActiveStock(stockId)),
		// createStock: values => dispatch(createStock(values)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Header);
