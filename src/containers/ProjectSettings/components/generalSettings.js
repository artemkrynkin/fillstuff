import React, { Component } from 'react';
import { connect } from 'react-redux';
import momentTz from 'moment-timezone';

import { Formik, Form, Field } from 'formik';
import { TextField, Select } from 'formik-material-ui';
import * as Yup from 'yup';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Fade from '@material-ui/core/Fade';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import TextFieldMui from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { checkPermissions, findMemberInProject } from 'shared/roles-access-rights';

import CardPaper from 'src/components/CardPaper';
import { PDDialogActions, PDDialogTitle } from 'src/components/Dialog';

import { editProject, deleteProject } from 'src/actions/projects';

import './generalSettings.styl';

const timezones = require('shared/timezones')
	.map(timezone => {
		return {
			name: timezone,
			offset: `GTM${momentTz.tz(timezone).format('Z')}`,
			offsetNumber: momentTz.tz.zone(timezone).parse(),
		};
	})
	.sort((timezoneA, timezoneB) => {
		return timezoneA.offsetNumber - timezoneB.offsetNumber;
	});

const PersonalDataSchema = Yup.object().shape({
	name: Yup.string()
		// eslint-disable-next-line
		.min(2, 'Название проекта не может быть короче ${min} символов')
		.required('Обязательное поле'),
	timezone: Yup.string().required('Обязательное поле'),
});

class GeneralSettings extends Component {
	state = {
		dialogDeleteProject: false,
	};

	onOpenDialogDeleteProject = () => this.setState({ dialogDeleteProject: true });

	onCloseDialogDeleteProject = () => this.setState({ dialogDeleteProject: false });

	render() {
		const {
			projects,
			currentUser,
			currentProject,
			currentUserRole = findMemberInProject(currentUser._id, currentProject).role,
		} = this.props;
		const { dialogDeleteProject } = this.state;

		const timezoneIndex = timezones.findIndex(timezone => timezone.name === currentProject.timezone);

		return (
			<CardPaper
				elevation={1}
				leftContent="Общие"
				title
				rightContent={
					checkPermissions(currentUserRole, ['project.full_control']) ? (
						<Button
							className="ps-general-settings__delete-project-btn"
							variant="outlined"
							onClick={this.onOpenDialogDeleteProject}
						>
							Удалить проект
						</Button>
					) : null
				}
				style={{ marginBottom: 16 }}
			>
				<Formik
					initialValues={{
						name: currentProject.name,
						timezone: currentProject.timezone,
					}}
					validationSchema={PersonalDataSchema}
					validateOnBlur={false}
					enableReinitialize
					onSubmit={(values, actions) => {
						this.props.editProject(values).then(response => {
							if (response.status === 'success') {
								actions.resetForm();
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
							<Grid className="pd-rowGridFormLabelControl" wrap="nowrap" container>
								<FormLabel style={{ minWidth: 124 }}>Название проекта:</FormLabel>
								{checkPermissions(currentUserRole, ['project.full_control']) ? (
									<Field
										name="name"
										component={TextField}
										validate={value => {
											if (projects && projects.some(project => project._id !== currentProject._id && project.name === value)) {
												return 'Проект с таким названием уже существует';
											}
										}}
										inputProps={{
											maxLength: 60,
										}}
									/>
								) : (
									<TextFieldMui
										name="name"
										InputProps={{
											readOnly: true,
											value: currentProject.name,
										}}
										fullWidth
									/>
								)}
							</Grid>
							<Grid className="pd-rowGridFormLabelControl" wrap="nowrap" style={{ marginBottom: 0 }} container>
								<FormLabel style={{ minWidth: 124 }}>Часовой пояс:</FormLabel>
								<FormControl fullWidth>
									{checkPermissions(currentUserRole, ['project.full_control']) ? (
										<Field
											name="timezone"
											component={Select}
											IconComponent={() => <FontAwesomeIcon icon={['far', 'angle-down']} className="pd-selectIcon" />}
											error={Boolean(errors.timezone)}
											MenuProps={{
												elevation: 2,
												transitionDuration: 150,
												TransitionComponent: Fade,
											}}
											displayEmpty
										>
											<MenuItem value="">Не выбран</MenuItem>
											{timezones.map((timezone, index) => {
												return (
													<MenuItem key={index} value={timezone.name}>
														({timezone.offset}) {timezone.name}
													</MenuItem>
												);
											})}
										</Field>
									) : (
										<TextFieldMui
											name="timezone"
											InputProps={{
												readOnly: true,
												value: `(${timezones[timezoneIndex].offset}) ${timezones[timezoneIndex].name}`,
											}}
											fullWidth
										/>
									)}
									{Boolean(errors.timezone) ? <FormHelperText error={true}>{errors.timezone}</FormHelperText> : null}
								</FormControl>
							</Grid>
							{checkPermissions(currentUserRole, ['project.full_control']) ? (
								<Grid className="pd-rowGridFormSubmit" justify="flex-end" style={{ marginTop: 20 }} container>
									<Button type="submit" disabled={isSubmitting} variant="contained" color="primary">
										{isSubmitting ? <CircularProgress size={20} style={{ position: 'absolute' }} /> : null}
										<span style={{ opacity: Number(!isSubmitting) }}>Сохранить</span>
									</Button>
								</Grid>
							) : null}
						</Form>
					)}
				/>

				<Dialog
					className="ps-general-settings-dialog"
					open={dialogDeleteProject}
					onClose={this.onCloseDialogDeleteProject}
					fullWidth
				>
					<PDDialogTitle theme="primary" onClose={this.onCloseDialogDeleteProject}>
						Удаление проекта
					</PDDialogTitle>
					<Formik
						initialValues={{
							name: '',
						}}
						validateOnBlur={false}
						validateOnChange={false}
						onSubmit={(values, actions) => {
							this.props.deleteProject().then(response => {
								if (response.data) {
									actions.resetForm();
									this.onCloseDialogDeleteProject();
								}
							});
						}}
						render={({ errors, touched, isSubmitting, values }) => (
							<Form>
								<DialogContent>
									<DialogContentText>
										<b>Внимание!</b> Удалённый проект невозможно восстановить.
									</DialogContentText>
									<br />
									<DialogContentText>
										Вы уверены, что хотите удалить проект: <b>{currentProject.name}</b>?
									</DialogContentText>
									<br />
									<ul className="pd-listing">
										<li>
											<Typography variant="body1" color="inherit">
												Все публикации будут удалены;
											</Typography>
										</li>
										<li>
											<Typography variant="body1" color="inherit">
												Все страницы социальных сетей будут отключены от проекта;
											</Typography>
										</li>
										<li>
											<Typography variant="body1" color="inherit">
												Все события и черновики в контент-плане будут удалены;
											</Typography>
										</li>
										<li>
											<Typography variant="body1" color="inherit">
												Вся статистика по проекту будет удалена;
											</Typography>
										</li>
										<li>
											<Typography variant="body1" color="inherit">
												Вы не сможете восстановить удалённый проект;
											</Typography>
										</li>
									</ul>
									<br />
									<DialogContentText style={{ marginBottom: 5 }}>
										Пожалуйста, введите название проекта для подтверждения.
									</DialogContentText>
									<Field
										name="name"
										placeholder={currentProject.name}
										component={TextField}
										validate={value => {
											if (value !== currentProject.name) return 'Название проекта введено неверно';
										}}
										autoComplete="off"
										autoFocus
										fullWidth
									/>
								</DialogContent>
								<PDDialogActions
									leftHandleProps={{
										handleProps: {
											onClick: this.onCloseDialogDeleteProject,
										},
										text: 'Закрыть',
									}}
									rightHandleProps={{
										handleProps: {
											type: 'submit',
											disabled: values.name !== currentProject.name || isSubmitting,
										},
										text: isSubmitting ? <CircularProgress size={20} /> : 'Удалить',
									}}
								/>
							</Form>
						)}
					/>
				</Dialog>
			</CardPaper>
		);
	}
}

const mapStateToProps = state => {
	return {
		projects: state.projects.data,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentProject } = ownProps;

	return {
		editProject: newValues => dispatch(editProject(currentProject._id, newValues)),
		deleteProject: () => dispatch(deleteProject(currentProject._id)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(GeneralSettings);
