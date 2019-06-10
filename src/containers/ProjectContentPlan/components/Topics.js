import React, { Component } from 'react';
import { connect } from 'react-redux';
import ClassNames from 'classnames';

import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import * as Yup from 'yup';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import colorPalette from 'shared/colorPalette';
import { checkPermissions } from 'shared/roles-access-rights';

import SliderScroller from 'src/components/SliderScroller';
import { PDDialogActions, PDDialogTitle } from 'src/components/Dialog';

import { isDark, declensionNumber } from 'src/helpers/utils';

import { createTopic } from 'src/actions/projects';

import 'src/containers/ProjectSettings/components/contentTopics.styl';
import './Topics.styl';

const createTopicSchema = Yup.object().shape({
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

class Topics extends Component {
	state = {
		dialogCreateTopic: false,
	};

	onOpenDialogCreateTopic = () => {
		this.setState({ dialogCreateTopic: true });
	};

	onCloseDialogCreateTopic = () => {
		this.setState({ dialogCreateTopic: false });
	};

	render() {
		const { currentProject, currentUserRole, topics = currentProject.topics, contentPlanEditing, selectedTopics } = this.props;
		const { dialogCreateTopic } = this.state;

		let topicsClasses = ClassNames({
			'pcp-topics': true,
			'pcp-topics_editing': contentPlanEditing,
		});

		let topicsItemClasses = topicId => {
			return ClassNames({
				'pcp-topics__item': true,
				'pcp-topics__item_selected': selectedTopics.some(selectedTopic => selectedTopic._id === topicId),
			});
		};

		const initialColors = colorPalette.topicColors.filter(color => !~topics.findIndex(topic => topic.color === color));

		return (
			<div className={topicsClasses}>
				<div className="pcp-topics__aside">
					{selectedTopics.length === 0 ? (
						<div className="pcp-topics__title">Темы контента:</div>
					) : (
						<button className="pcp-topics__selected-remove" onClick={this.props.onRemoveSelectedTopic}>
							{selectedTopics.length} {declensionNumber(selectedTopics.length, ['тема', 'темы', 'тем'])}
							<FontAwesomeIcon icon={['far', 'times']} />
						</button>
					)}
				</div>
				{topics.length ? (
					<SliderScroller className="pcp-topics__items" offsetLeft={15} offsetRight={15} shadows>
						{topics.map((topic, index) => (
							<button className={topicsItemClasses(topic._id)} key={index} onClick={() => this.props.onSelectTopic(topic)}>
								<div className="pcp-topics__item-wrap">
									<div className="pcp-topics__item-color" style={{ backgroundColor: topic.color }} />
									<div
										className="pcp-topics__item-name"
										style={{ color: isDark(topic.color) ? 'white' : colorPalette.blueGrey.cBg600 }}
									>
										{topic.name}
									</div>
								</div>
							</button>
						))}
					</SliderScroller>
				) : checkPermissions(currentUserRole, ['events.control']) ? (
					<Typography variant="caption" style={{ marginLeft: 30 }}>
						Создавайте и&nbsp;настраивайте темы для группировки публикаций.
					</Typography>
				) : (
					<Typography variant="caption" style={{ marginLeft: 30 }}>
						В проекте еще не создано ни одной темы.
					</Typography>
				)}

				{checkPermissions(currentUserRole, ['events.control']) ? (
					<div className="pcp-topics__actions">
						{!contentPlanEditing ? (
							<Button variant="outlined" color="primary" size="small" onClick={this.props.onToggleContentPlanEditing}>
								Редактировать контент-план
							</Button>
						) : (
							<div className="pcp-topics__actions-editing">
								<Button variant="contained" color="primary" size="small" onClick={this.props.onToggleContentPlanEditing}>
									Сохранить
								</Button>
								<Button variant="outlined" size="small" style={{ marginLeft: 8 }} onClick={this.props.onToggleContentPlanEditing}>
									Отменить
								</Button>
								<Button
									variant="outlined"
									color="primary"
									size="small"
									style={{ marginLeft: 24 }}
									onClick={this.onOpenDialogCreateTopic}
								>
									Добавить тему
								</Button>
							</div>
						)}
					</div>
				) : null}

				<Dialog open={dialogCreateTopic} onClose={this.onCloseDialogCreateTopic} fullWidth>
					<PDDialogTitle theme="primary" onClose={this.onCloseDialogCreateTopic}>
						Добавление темы
					</PDDialogTitle>
					<Formik
						initialValues={{
							name: '',
							color: initialColors.length ? initialColors[0] : colorPalette.topicColors[0],
						}}
						validationSchema={createTopicSchema}
						validateOnBlur={false}
						validateOnChange={false}
						onSubmit={(values, actions) => {
							return this.props.createTopic(values).then(response => {
								if (response.status === 'success') this.onCloseDialogCreateTopic();
								else actions.setSubmitting(false);
							});
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
											onClick: this.onCloseDialogCreateTopic,
										},
										text: 'Закрыть',
									}}
									rightHandleProps={{
										handleProps: {
											type: 'submit',
											disabled: isSubmitting,
										},
										text: isSubmitting ? <CircularProgress size={20} /> : 'Добавить',
									}}
								/>
							</Form>
						)}
					/>
				</Dialog>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentProject } = ownProps;

	return {
		createTopic: values => dispatch(createTopic(currentProject._id, values)),
	};
};

export default connect(
	null,
	mapDispatchToProps
)(Topics);
