import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import * as Yup from 'yup';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

import colorPalette from 'shared/colorPalette';
import { checkPermissions, findMemberInProject } from 'shared/roles-access-rights';

import CardPaper from 'src/components/CardPaper';
import { PDDialogActions, PDDialogTitle } from 'src/components/Dialog';

import { createTopic, editTopic, deleteTopic } from 'src/actions/projects';

import './contentTopics.styl';

const createEditTopicSchema = Yup.object().shape({
	color: Yup.string()
		.oneOf(colorPalette.topicColors, 'Значение отсутствует в списке доступных цветов')
		.required('Обязательное поле'),
	name: Yup.string()
		// eslint-disable-next-line
		.min(2, 'Название темы не может быть короче ${min} символов')
		// eslint-disable-next-line
		.max(50, 'Название темы не может превышать ${max} символов')
		.required('Обязательное поле'),
});

class ContentTopics extends Component {
	state = {
		topicActionsMenuOpen: null,
		selectedTopic: null,
		dialogCreateEditActionType: null,
		dialogCreateEditTopic: false,
		dialogDeleteTopic: false,
	};

	onOpenTopicActionsMenu = (event, topic) =>
		this.setState({
			topicActionsMenuOpen: event.currentTarget,
			selectedTopic: topic,
		});

	onCloseTopicActionsMenu = saveTopic => {
		if (!saveTopic) {
			this.setState({
				topicActionsMenuOpen: null,
				selectedTopic: null,
			});
		} else {
			this.setState({ topicActionsMenuOpen: null });
		}
	};

	onOpenDialogCreateEditTopic = actionType =>
		this.setState({
			dialogCreateEditActionType: actionType,
			dialogCreateEditTopic: true,
		});

	onCloseDialogCreateEditTopic = () =>
		this.setState({
			dialogCreateEditTopic: false,
		});

	onExitedDialogCreateEditTopic = () =>
		this.setState({
			dialogCreateEditActionType: null,
			selectedTopic: null,
		});

	onOpenDialogDeleteTopic = () => {
		this.setState({
			dialogDeleteTopic: true,
		});
	};

	onCloseDialogDeleteTopic = () =>
		this.setState({
			dialogDeleteTopic: false,
		});

	onExitedDialogDeleteTopic = () =>
		this.setState({
			selectedTopic: null,
		});

	render() {
		const {
			currentUser,
			currentProject,
			currentUserRole = findMemberInProject(currentUser._id, currentProject).role,
			topics = currentProject.topics,
		} = this.props;

		const {
			topicActionsMenuOpen,
			selectedTopic,
			dialogCreateEditActionType,
			dialogCreateEditTopic,
			dialogDeleteTopic,
		} = this.state;

		const initialColors = colorPalette.topicColors.filter(color => !~topics.findIndex(topic => topic.color === color));

		return (
			<CardPaper
				elevation={1}
				leftContent="Темы контента"
				title
				rightContent={
					checkPermissions(currentUserRole, ['events.control']) ? (
						<Button variant="outlined" color="primary" onClick={() => this.onOpenDialogCreateEditTopic('create')}>
							Добавить тему
						</Button>
					) : null
				}
			>
				{topics.length ? (
					<div className="ps-content-topics__list">
						{topics.map((topic, index) => (
							<div className="ps-content-topics__item" key={index}>
								<div className="ps-content-topics__color" style={{ backgroundColor: topic.color }} />
								<div className="ps-content-topics__name">{topic.name}</div>
								{checkPermissions(currentUserRole, ['events.control']) ? (
									<IconButton
										className="ps-content-topics__actions"
										aria-haspopup="true"
										onClick={event => this.onOpenTopicActionsMenu(event, topic)}
									>
										<FontAwesomeIcon icon={['far', 'ellipsis-h']} />
									</IconButton>
								) : null}
							</div>
						))}
					</div>
				) : checkPermissions(currentUserRole, ['events.control']) ? (
					<Typography variant="caption" align="center">
						Создавайте и&nbsp;настраивайте темы для группировки публикаций.
					</Typography>
				) : (
					<Typography variant="caption" align="center">
						В проекте еще не создано ни одной темы.
					</Typography>
				)}

				<Popover
					anchorEl={topicActionsMenuOpen}
					open={Boolean(topicActionsMenuOpen)}
					onClose={this.onCloseTopicActionsMenu}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'center',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'center',
					}}
					transitionDuration={150}
					elevation={2}
				>
					<MenuList>
						<MenuItem
							onClick={() => {
								this.onOpenDialogCreateEditTopic('edit');
								this.onCloseTopicActionsMenu(true);
							}}
						>
							Редактировать
						</MenuItem>
						<MenuItem
							onClick={() => {
								this.onOpenDialogDeleteTopic();
								this.onCloseTopicActionsMenu(true);
							}}
						>
							Удалить
						</MenuItem>
					</MenuList>
				</Popover>

				<Dialog
					open={dialogCreateEditTopic}
					onClose={this.onCloseDialogCreateEditTopic}
					onExited={this.onExitedDialogCreateEditTopic}
					fullWidth
				>
					<PDDialogTitle theme="primary" onClose={this.onCloseDialogCreateEditTopic}>
						{dialogCreateEditActionType === 'create' ? 'Добавление темы' : 'Редактирование темы'}
					</PDDialogTitle>
					<Formik
						initialValues={
							dialogCreateEditActionType === 'create'
								? {
										name: '',
										color: initialColors.length ? initialColors[0] : colorPalette.topicColors[0],
								  }
								: selectedTopic
						}
						validationSchema={createEditTopicSchema}
						validateOnBlur={false}
						validateOnChange={false}
						onSubmit={(values, actions) => {
							switch (dialogCreateEditActionType) {
								case 'create':
									return this.props.createTopic(values).then(response => {
										if (response.status === 'success') this.onCloseDialogCreateEditTopic();
										else actions.setSubmitting(false);
									});
								case 'edit':
									return this.props.editTopic(selectedTopic._id, values).then(response => {
										if (response.status === 'success') this.onCloseDialogCreateEditTopic();
										else actions.setSubmitting(false);
									});
								default:
									return;
							}
						}}
						render={({ errors, touched, isSubmitting, values }) => (
							<Form>
								<DialogContent>
									<Grid className="pd-rowGridFormLabelControl" container={false}>
										<Field
											name="name"
											label="Название темы"
											component={TextField}
											InputLabelProps={{
												shrink: true,
											}}
											autoComplete="off"
											autoFocus
											fullWidth
										/>
									</Grid>
									<Grid container={false}>
										<FormLabel>Цвет:</FormLabel>
										<Grid className="ps-content-topics-dialog__colors-list" wrap="wrap" container>
											{colorPalette.topicColors.map((color, index) => (
												<label key={index} className="ps-content-topics-dialog__color-label">
													<Field type="radio" name="color" value={color} checked={color === values.color} />
													<div className="ps-content-topics-dialog__color" style={{ backgroundColor: color }}>
														<FontAwesomeIcon icon={['far', 'check']} />
													</div>
												</label>
											))}
										</Grid>
										{Boolean(errors.color) ? <FormHelperText error={true}>{errors.color}</FormHelperText> : null}
									</Grid>
								</DialogContent>
								<PDDialogActions
									leftHandleProps={{
										handleProps: {
											onClick: this.onCloseDialogCreateEditTopic,
										},
										text: 'Закрыть',
									}}
									rightHandleProps={{
										handleProps: {
											type: 'submit',
											disabled: isSubmitting,
										},
										text: isSubmitting ? (
											<CircularProgress size={20} />
										) : dialogCreateEditActionType === 'create' ? (
											'Добавить'
										) : (
											'Сохранить'
										),
									}}
								/>
							</Form>
						)}
					/>
				</Dialog>

				<Dialog
					open={dialogDeleteTopic}
					onClose={this.onCloseDialogDeleteTopic}
					onExited={this.onExitedDialogDeleteTopic}
					fullWidth
				>
					<PDDialogTitle theme="primary" onClose={this.onCloseDialogDeleteTopic}>
						Удаление темы
					</PDDialogTitle>
					<DialogContent>
						{selectedTopic ? (
							<DialogContentText>
								Вы уверены, что хотите удалить тему <b style={{ color: selectedTopic.color }}>{selectedTopic.name}</b> из списка?
							</DialogContentText>
						) : null}
					</DialogContent>
					<PDDialogActions
						leftHandleProps={{
							handleProps: {
								onClick: this.onCloseDialogDeleteTopic,
							},
							text: 'Закрыть',
						}}
						rightHandleProps={{
							handleProps: {
								onClick: () => this.props.deleteTopic(selectedTopic._id).then(() => this.onCloseDialogDeleteTopic()),
							},
							text: 'Удалить',
						}}
					/>
				</Dialog>
			</CardPaper>
		);
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentProject } = ownProps;

	return {
		createTopic: values => dispatch(createTopic(currentProject._id, values)),
		editTopic: (topicId, newValues) => dispatch(editTopic(currentProject._id, topicId, newValues)),
		deleteTopic: topicId => dispatch(deleteTopic(currentProject._id, topicId)),
	};
};

export default connect(
	null,
	mapDispatchToProps
)(ContentTopics);
