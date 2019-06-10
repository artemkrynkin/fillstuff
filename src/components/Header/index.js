import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';

import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import * as Yup from 'yup';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

import { history } from 'src/helpers/history';
import { changeProjectCurrentUrl } from 'src/helpers/utils';

import { PDDialogTitle, PDDialogActions } from 'src/components/Dialog';

import { logout } from 'src/actions/authentication';
import { createProject } from 'src/actions/projects';
import { changeActiveProject } from 'src/actions/user';

import ColumnLeft from './components/ColumnLeft';

import './index.styl';

const createProjectSchema = Yup.object().shape({
	name: Yup.string()
		// eslint-disable-next-line
		.min(2, 'Название проекта не может быть короче ${min} символов')
		.required('Обязательное поле'),
});

class Header extends Component {
	state = {
		accountLinkMenuOpen: null,
		projectsMenuOpen: null,
		dialogCreateProject: false,
	};

	onOpenProjectsMenu = event => {
		this.setState({ projectsMenuOpen: event.currentTarget });
	};

	onCloseProjectsMenu = () => {
		this.setState({ projectsMenuOpen: null });
	};

	onOpenDialogCreateProject = () => {
		this.setState({ dialogCreateProject: true });
	};

	onCloseDialogCreateProject = () => {
		this.setState({ dialogCreateProject: false });
	};

	onOpenAccountLinkMenu = event => {
		this.setState({ accountLinkMenuOpen: event.currentTarget });
	};

	onCloseAccountLinkMenu = () => {
		this.setState({ accountLinkMenuOpen: null });
	};

	onLogout = () => {
		this.props.logout();
	};

	render() {
		const { projectsMenuOpen, dialogCreateProject, accountLinkMenuOpen } = this.state;
		const { pageName, pageTitle, theme, positionStatic, currentUser, currentProject, projects, calendar } = this.props;

		let headerClasses = ClassNames({
			header: true,
			header_theme_bg: theme === 'bg',
			header_static: positionStatic,
		});

		return (
			<header className={headerClasses}>
				<ColumnLeft pageName={pageName} pageTitle={pageTitle} theme={theme} calendar={calendar} />
				<div className="header__column_right">
					{theme !== 'bg' ? (
						<div className="header__column-group_right">
							<Button
								key="button"
								className="header__project-btn mui-btn-ct400"
								variant="contained"
								color="primary"
								aria-haspopup="true"
								onClick={this.onOpenProjectsMenu}
							>
								{currentProject ? currentProject.name : 'Выберите проект'}
								<FontAwesomeIcon icon={['fas', 'angle-down']} />
							</Button>
						</div>
					) : null}
					<div className="header__column-group_right">
						<div className="header__account-link" aria-haspopup="true" onClick={this.onOpenAccountLinkMenu}>
							{theme === 'bg' ? <div className="header__account-name">{currentUser.name}</div> : null}
							<div className="header__account-link-photo">
								{currentUser.profilePhoto ? (
									<img src={currentUser.profilePhoto} alt="" />
								) : (
									<FontAwesomeIcon icon={['fas', 'user-alt']} />
								)}
							</div>
							<FontAwesomeIcon icon={['fas', 'angle-down']} className={accountLinkMenuOpen ? 'open' : ''} />
						</div>
					</div>
				</div>

				<Popover
					anchorEl={projectsMenuOpen}
					open={Boolean(projectsMenuOpen)}
					onClose={this.onCloseProjectsMenu}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'center',
					}}
					transformOrigin={{
						vertical: -7,
						horizontal: 'center',
					}}
					transitionDuration={150}
					elevation={2}
				>
					{projects.length ? (
						<MenuList>
							{projects.map((project, index) => (
								<MenuItem
									key={index}
									selected={project._id === currentUser.activeProjectId}
									onClick={() => {
										this.onCloseProjectsMenu();

										if (currentUser.activeProjectId === project._id)
											return history.push({ pathname: changeProjectCurrentUrl(project._id) });

										this.props.changeActiveProject(project._id).then(() => {
											history.push({ pathname: changeProjectCurrentUrl(project._id) });
										});
									}}
								>
									{project.name}
								</MenuItem>
							))}
						</MenuList>
					) : (
						<Typography variant="caption" style={{ padding: 20 }}>
							У Вас еще нет ни одного проекта.
						</Typography>
					)}
					<Divider />
					<MenuList>
						<MenuItem
							style={{ justifyContent: projects.length ? 'flex-start' : 'center' }}
							onClick={() => {
								this.onCloseProjectsMenu();
								this.onOpenDialogCreateProject();
							}}
						>
							{projects.length ? 'Новый проект' : 'Создать проект'}
						</MenuItem>
					</MenuList>
				</Popover>

				<Popover
					anchorEl={accountLinkMenuOpen}
					open={Boolean(accountLinkMenuOpen)}
					onClose={this.onCloseAccountLinkMenu}
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
						<MenuItem component={props => <Link to={`/settings`} {...props} />} onClick={this.onCloseAccountLinkMenu}>
							Настройки аккаунта
						</MenuItem>
						<MenuItem onClick={this.onCloseAccountLinkMenu}>Оплата</MenuItem>
					</MenuList>
					<Divider />
					<MenuList>
						<MenuItem onClick={this.onLogout}>Выйти</MenuItem>
					</MenuList>
				</Popover>

				<Dialog open={dialogCreateProject} onClose={this.onCloseDialogCreateProject} maxWidth="xs" fullWidth>
					<PDDialogTitle theme="primary" onClose={this.onCloseDialogCreateProject}>
						Новый проект
					</PDDialogTitle>
					<Formik
						initialValues={{ name: '' }}
						validationSchema={createProjectSchema}
						validateOnBlur={false}
						validateOnChange={false}
						onSubmit={(values, actions) => {
							this.props.createProject(values).then(response => {
								if (response.status === 'success') {
									actions.resetForm();
									this.onCloseDialogCreateProject();
								} else {
									if (response.data.formErrors) {
										response.data.formErrors.forEach(error => {
											actions.setFieldError(error.field, error.message);
										});
									}

									actions.setSubmitting(false);
								}
							});
						}}
						render={({ errors, touched, isSubmitting }) => (
							<Form>
								<DialogContent>
									<Field
										name="name"
										label="Название проекта"
										component={TextField}
										validate={value => {
											if (projects && projects.some(project => project.name === value)) {
												return 'Проект с таким названием уже существует';
											}
										}}
										inputProps={{
											maxLength: 60,
										}}
										InputLabelProps={{
											shrink: true,
										}}
										autoComplete="off"
										autoFocus
										fullWidth
									/>
								</DialogContent>
								<PDDialogActions
									leftHandleProps={{
										handleProps: {
											onClick: this.onCloseDialogCreateProject,
										},
										text: 'Закрыть',
									}}
									rightHandleProps={{
										handleProps: {
											type: 'submit',
											disabled: isSubmitting,
										},
										text: isSubmitting ? <CircularProgress size={20} /> : 'Создать',
									}}
								/>
							</Form>
						)}
					/>
				</Dialog>
			</header>
		);
	}
}

const mapStateToProps = state => {
	const projectIndex = state.projects.data.findIndex(project => project._id === state.user.data.activeProjectId);

	return {
		currentUser: state.user.data,
		currentProject: state.user.data.activeProjectId ? state.projects.data[projectIndex] : null,
		projects: state.projects.data,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		logout: () => logout(),
		changeActiveProject: projectId => dispatch(changeActiveProject(projectId)),
		createProject: values => dispatch(createProject(values)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Header);
