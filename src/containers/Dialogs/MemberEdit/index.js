import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ClassNames from 'classnames';

import { Formik, Form, Field } from 'formik';
import { TextField, RadioGroup } from 'formik-material-ui';
import * as Yup from 'yup';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';

import { checkPermissions } from 'shared/roles-access-rights';

import { PDDialog, PDDialogTitle, PDDialogActions } from 'src/components/Dialog';

import { editMember } from 'src/actions/stocks';

import stylesGlobal from 'src/styles/globals.module.css';
import styles from './index.module.css';

const memberInvitationOrEditSchema = Yup.object().shape({
	user: Yup.object().shape({
		name: Yup.string()
			.min(2)
			.required(),
		email: Yup.string()
			.nullable(true)
			.transform(value => (value === null ? '' : value))
			.email()
			.required(),
	}),
	role: Yup.string()
		.oneOf(['owner', 'admin', 'user'])
		.required(),
});

class MemberEdit extends Component {
	static propTypes = {
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		onExitedDialog: PropTypes.func,
		currentStock: PropTypes.object.isRequired,
		selectedMember: PropTypes.object,
	};

	render() {
		const { dialogOpen, onCloseDialog, onExitedDialog, selectedMember, currentUserRole } = this.props;

		let photoImgClasses = (member, dialog) => {
			return ClassNames({
				[styles.photo]: dialog,
				[styles.photoEmpty]: dialog ? member.isWaiting || !member.user.profilePhoto : false,
			});
		};

		if (!selectedMember) return null;
		else
			return (
				<PDDialog open={dialogOpen} onClose={onCloseDialog} onExited={onExitedDialog} maxWidth="md" scroll="body" stickyActions>
					<PDDialogTitle theme="primary" onClose={onCloseDialog}>
						Изменение роли участника
					</PDDialogTitle>
					<Formik
						initialValues={selectedMember}
						validationSchema={memberInvitationOrEditSchema}
						validateOnBlur={false}
						validateOnChange={false}
						onSubmit={(values, actions) => {
							this.props.editMember(selectedMember._id, values).then(response => {
								if (response.status === 'success') onCloseDialog();
								else actions.setSubmitting(false);
							});
						}}
						render={({ errors, isSubmitting, values }) => (
							<Form>
								<DialogContent>
									<Grid className={stylesGlobal.formLabelControl} direction="column" alignItems="center" container>
										<div className={photoImgClasses(selectedMember, true)}>
											{selectedMember.user.profilePhoto ? (
												<img src={selectedMember.user.profilePhoto} alt="" />
											) : (
												<FontAwesomeIcon icon={['fas', 'user-alt']} />
											)}
										</div>
									</Grid>
									<Grid className={stylesGlobal.formLabelControl}>
										<Field
											name="user.name"
											label="Имя:"
											component={TextField}
											InputLabelProps={{
												shrink: true,
											}}
											autoComplete="off"
											fullWidth
										/>
									</Grid>
									<Grid className={stylesGlobal.formLabelControl}>
										<Field
											name="user.email"
											label="Email:"
											component={TextField}
											InputLabelProps={{
												shrink: true,
											}}
											autoComplete="off"
											fullWidth
										/>
										{Boolean(values.user.email) && Boolean(values.user.email !== (selectedMember.user.email || '')) ? (
											<FormHelperText component="div">
												На {selectedMember.user.email ? <b>новый</b> : null} Email придёт письмо с подтверждением.
												{selectedMember.user.email ? (
													<p style={{ marginTop: 10 }}>
														На <b>старый</b> Email придёт уведомление об изменении.
													</p>
												) : null}
											</FormHelperText>
										) : null}
									</Grid>
									<Grid style={{ marginTop: 20 }}>
										<FormLabel>Роль:</FormLabel>
										<Field name="role" component={RadioGroup} row>
											<FormControlLabel
												className={stylesGlobal.formRadioTitleSubtitle}
												value="user"
												control={
													<Radio
														color="primary"
														disableRipple
														icon={<FontAwesomeIcon icon={['far', 'circle']} />}
														checkedIcon={<FontAwesomeIcon icon={['far', 'dot-circle']} />}
													/>
												}
												label={
													<div className={stylesGlobal.formRadioTitleSubtitleLabel}>
														<div className={stylesGlobal.formRadioTitleSubtitleTitle}>Тату-мастер</div>
													</div>
												}
												disabled={isSubmitting}
											/>
											<FormControlLabel
												className={stylesGlobal.formRadioTitleSubtitle}
												value="admin"
												control={
													<Radio
														color="primary"
														disableRipple
														icon={<FontAwesomeIcon icon={['far', 'circle']} />}
														checkedIcon={<FontAwesomeIcon icon={['far', 'dot-circle']} />}
													/>
												}
												label={
													<div className={stylesGlobal.formRadioTitleSubtitleLabel}>
														<div className={stylesGlobal.formRadioTitleSubtitleTitle}>Администратор</div>
													</div>
												}
												disabled={isSubmitting}
											/>
											{checkPermissions(currentUserRole, ['stock.full_control']) ? (
												<FormControlLabel
													className={stylesGlobal.formRadioTitleSubtitle}
													value="owner"
													control={
														<Radio
															color="primary"
															disableRipple
															icon={<FontAwesomeIcon icon={['far', 'circle']} />}
															checkedIcon={<FontAwesomeIcon icon={['far', 'dot-circle']} />}
														/>
													}
													label={
														<div className={stylesGlobal.formRadioTitleSubtitleLabel}>
															<div className={stylesGlobal.formRadioTitleSubtitleTitle}>Владелец</div>
														</div>
													}
													disabled={isSubmitting}
												/>
											) : null}
										</Field>
										{Boolean(errors.role) ? <FormHelperText error>{errors.role}</FormHelperText> : null}
									</Grid>
								</DialogContent>
								<PDDialogActions
									leftHandleProps={{
										handleProps: {
											onClick: onCloseDialog,
										},
										text: 'Закрыть',
									}}
									rightHandleProps={{
										handleProps: {
											type: 'submit',
											disabled: isSubmitting,
										},
										text: isSubmitting ? <CircularProgress size={20} /> : 'Изменить',
									}}
								/>
							</Form>
						)}
					/>
				</PDDialog>
			);
	}
}

const mapStateToProps = state => {
	return {
		currentUser: state.user.data,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStock } = ownProps;

	return {
		editMember: (memberId, values) => dispatch(editMember(currentStock._id, memberId, values)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MemberEdit);
