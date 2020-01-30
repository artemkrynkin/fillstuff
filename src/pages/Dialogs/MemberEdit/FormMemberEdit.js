import React from 'react';
import ClassNames from 'classnames';
import { Form, Field, getIn } from 'formik';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';

import { checkPermissions } from 'shared/roles-access-rights';

import { DialogActions } from 'src/components/Dialog';

import stylesGlobal from 'src/styles/globals.module.css';
import styles from './index.module.css';

const errorsNested = (touched, errors, name, helperText = null) => {
	const error = getIn(errors, name);
	const touch = getIn(touched, name);
	return touch && error ? error : helperText;
};

let photoImgClasses = (member, dialog) => {
	return ClassNames({
		[styles.photo]: dialog,
		[styles.photoEmpty]: dialog ? member.isWaiting || !member.user.avatar : false,
	});
};

const FormMemberEdit = props => {
	const {
		onCloseDialog,
		selectedMember,
		currentUserRole,
		formikProps: { errors, isSubmitting, touched, values },
	} = props;

	return (
		<Form>
			<DialogContent>
				<Grid className={stylesGlobal.formLabelControl} direction="column" alignItems="center" container>
					<div className={photoImgClasses(selectedMember, true)}>
						{selectedMember.user.avatar ? <img src={selectedMember.user.avatar} alt="" /> : <FontAwesomeIcon icon={['fas', 'user-alt']} />}
					</div>
				</Grid>
				<Grid className={stylesGlobal.formLabelControl}>
					<Field
						name="user.name"
						label="Имя:"
						error={Boolean(errorsNested(touched, errors, 'user.name'))}
						helperText={errorsNested(touched, errors, 'user.name')}
						as={TextField}
						fullWidth
					/>
				</Grid>
				<Grid className={stylesGlobal.formLabelControl}>
					<Field
						name="user.email"
						label="Email:"
						error={Boolean(errorsNested(touched, errors, 'user.email'))}
						helperText={errorsNested(touched, errors, 'user.email')}
						as={TextField}
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
					<InputLabel>Роль:</InputLabel>
					<Field name="role" as={RadioGroup} row>
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
						{checkPermissions(currentUserRole, ['studio.full_control']) ? (
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
					{errors.role ? <FormHelperText error>{errors.role}</FormHelperText> : null}
				</Grid>
			</DialogContent>
			<DialogActions
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
	);
};

export default FormMemberEdit;
