import React, { Component } from 'react';
import { connect } from 'react-redux';
import ClassNames from 'classnames';
import moment from 'moment';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import { sleep } from 'shared/utils';

import CardPaper from 'src/components/CardPaper';

import { editUser } from 'src/actions/user';

import stylesGlobal from 'src/styles/globals.module.css';
import styles from './ProfileSettings.module.css';

const PersonalDataSchema = Yup.object().shape({
	name: Yup.string()
		.min(2)
		.required(),
});

const EmailSchema = Yup.object().shape({
	newEmail: Yup.string()
		.email()
		.required(),
});

const SetPasswordSchema = Yup.object().shape({
	newPassword: Yup.string()
		// eslint-disable-next-line
		.min(6, 'Пароль должен состоять минимум из ${min} символов')
		.required(),
});

const ChangePasswordSchema = Yup.object().shape({
	oldPassword: Yup.string().required(),
	newPassword: Yup.string()
		// eslint-disable-next-line
		.min(6, 'Новый пароль должен состоять минимум из ${min} символов')
		.required(),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref('newPassword')], 'Новый пароль повторён неправильно')
		.required(),
});

class ProfileSettings extends Component {
	state = {
		visibleEmailFields: false,
		visiblePasswordFields: false,
		newProfilePhoto: {
			file: null,
			base64: null,
		},
	};

	onToggleEmailFields = () => {
		this.setState({
			visibleEmailFields: !this.state.visibleEmailFields,
		});

		if (this.state.visiblePasswordFields) this.onTogglePasswordFields();
	};

	onTogglePasswordFields = () => {
		this.setState({
			visiblePasswordFields: !this.state.visiblePasswordFields,
		});

		if (this.state.visibleEmailFields) this.onToggleEmailFields();
	};

	onChangeProfilePhoto = event => {
		const file = event.target.files[0];
		const Reader = new FileReader();

		Reader.onload = item => {
			this.setState({
				newProfilePhoto: {
					file: file,
					base64: item.target.result,
				},
			});
		};

		if (file) Reader.readAsDataURL(file);
	};

	onResetNewProfilePhoto = () => {
		this.setState({
			newProfilePhoto: {
				file: null,
				base64: null,
			},
		});
	};

	render() {
		const { user } = this.props;
		const { visibleEmailFields, visiblePasswordFields, newProfilePhoto } = this.state;

		let photoImgClasses = ClassNames({
			[styles.photoImg]: true,
			[styles.photoImg_null]: !user.profilePhoto,
		});

		let labelStyles = { minWidth: 52 };

		return (
			<CardPaper leftContent="Профиль" title style={{ marginBottom: 16 }}>
				<Grid direction="row" alignItems="flex-start" spacing={3} container>
					<Grid className={styles.photo} item>
						<div className={photoImgClasses}>
							{newProfilePhoto.base64 || user.profilePhoto ? (
								<img src={newProfilePhoto.base64 || user.profilePhoto} alt="" />
							) : (
								<FontAwesomeIcon icon={['fas', 'user-alt']} />
							)}
						</div>
						<input id="profile-photo" type="file" accept="image/*" onChange={this.onChangeProfilePhoto} style={{ display: 'none' }} />
						<label htmlFor="profile-photo">
							<ButtonBase className={styles.buttonLink} component="span" disableRipple>
								{user.profilePhoto ? 'Изменить' : 'Загрузить'} фотографию
							</ButtonBase>
						</label>
					</Grid>
					<Grid className={styles.personalData} item xs>
						<Formik
							initialValues={{
								name: user.name,
							}}
							validationSchema={PersonalDataSchema}
							validateOnBlur={false}
							onSubmit={async (values, actions) => {
								await sleep(500);

								let valuesFormData;

								if (newProfilePhoto.file && newProfilePhoto.base64) {
									valuesFormData = new FormData();

									valuesFormData.append('profilePhoto', newProfilePhoto.file);

									Object.keys(values).forEach(key => {
										valuesFormData.append(key, values[key]);
									});
								}

								this.props.editUser(valuesFormData ? valuesFormData : values).then(response => {
									if (response.status === 'success') {
										actions.resetForm();
										this.onResetNewProfilePhoto();
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
						>
							{({ errors, isSubmitting, touched }) => (
								<Form>
									<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" container>
										<FormLabel style={labelStyles}>Имя:</FormLabel>
										<Field
											name="name"
											error={Boolean(touched.name && errors.name)}
											helperText={(touched.name && errors.name) || ''}
											as={TextField}
										/>
									</Grid>
									<Grid justify="flex-end" container>
										<Button type="submit" disabled={isSubmitting} variant="contained" color="primary">
											{isSubmitting ? <CircularProgress size={20} style={{ position: 'absolute' }} /> : null}
											<span className="loading-button-label" style={{ opacity: Number(!isSubmitting) }}>
												Сохранить
											</span>
										</Button>
									</Grid>
								</Form>
							)}
						</Formik>

						<Divider style={{ margin: '20px 0' }} />
						<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" container>
							<FormLabel style={labelStyles}>Email:</FormLabel>
							<Grid item>
								{visibleEmailFields ? (
									<Formik
										initialValues={{ newEmail: '' }}
										validationSchema={EmailSchema}
										validateOnBlur={false}
										onSubmit={async (values, actions) => {
											await sleep(500);

											this.props.editUser(values).then(response => {
												if (response.status === 'success') {
													actions.resetForm();
													this.onToggleEmailFields();
												} else {
													response.data.formErrors.forEach(error => {
														actions.setFieldError(error.field, error.message);
													});

													actions.setSubmitting(false);
												}
											});
										}}
									>
										{({ errors, isSubmitting, touched, values }) => (
											<Form>
												<FormControl margin="dense" fullWidth>
													<Field
														name="newEmail"
														error={Boolean(touched.newEmail && errors.newEmail)}
														helperText={(touched.newEmail && errors.newEmail) || ''}
														as={TextField}
														placeholder="Новый Email"
														autoFocus
													/>
													{!errors.newEmail && Boolean(values.newEmail) && Boolean(values.newEmail !== (user.email || '')) ? (
														<FormHelperText component="div">
															На {user.email ? <b>новый</b> : null} Email придёт письмо с подтверждением.
															{user.email ? (
																<p style={{ marginTop: 10 }}>
																	На <b>старый</b> Email придёт уведомление об изменении.
																</p>
															) : null}
														</FormHelperText>
													) : null}
												</FormControl>
												<FormControl>
													<Button type="submit" disabled={isSubmitting} variant="contained" color="primary">
														{isSubmitting ? <CircularProgress size={20} style={{ position: 'absolute' }} /> : null}
														<span className="loading-button-label" style={{ opacity: Number(!isSubmitting) }}>
															{user.email ? 'Сохранить' : 'Установить'}
														</span>
													</Button>
												</FormControl>
											</Form>
										)}
									</Formik>
								) : (
									<TextField
										InputProps={{
											readOnly: true,
											value: user.email ? user.email : 'ещё не установлен',
										}}
										fullWidth
									/>
								)}
							</Grid>
							<ButtonBase
								className={styles.buttonLink}
								component="span"
								disableRipple
								onClick={this.onToggleEmailFields}
								style={{ marginLeft: 10, marginTop: 10 }}
							>
								{!visibleEmailFields ? (user.email ? 'Изменить' : 'Установить') : 'Отмена'}
							</ButtonBase>
						</Grid>

						{user.email ? <Divider style={{ margin: '20px 0' }} /> : null}
						{user.email ? (
							<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" style={{ margin: 0 }} container>
								<FormLabel style={labelStyles}>Пароль:</FormLabel>
								<Grid item>
									{visiblePasswordFields ? (
										<Formik
											initialValues={{
												oldPassword: '',
												newPassword: '',
												confirmPassword: '',
											}}
											validationSchema={user.hasPassword ? ChangePasswordSchema : SetPasswordSchema}
											validateOnBlur={false}
											onSubmit={async (values, actions) => {
												await sleep(500);

												let newValues = JSON.parse(JSON.stringify(values));

												if (!user.hasPassword) {
													delete newValues.oldPassword;
													delete newValues.confirmPassword;
												}

												this.props.editUser(newValues).then(response => {
													if (response.status === 'success') {
														actions.resetForm();
														this.onTogglePasswordFields();
													} else {
														response.data.formErrors.forEach(error => {
															actions.setFieldError(error.field, error.message);
														});

														actions.setSubmitting(false);
													}
												});
											}}
										>
											{({ errors, isSubmitting, touched }) => (
												<Form>
													{user.hasPassword ? (
														<FormControl margin="dense" fullWidth>
															<Field
																name="oldPassword"
																type="password"
																error={Boolean(touched.oldPassword && errors.oldPassword)}
																helperText={(touched.oldPassword && errors.oldPassword) || ''}
																as={TextField}
																placeholder="Старый пароль"
																autoFocus={user.hasPassword}
															/>
														</FormControl>
													) : null}
													<FormControl margin="dense" fullWidth>
														<Field
															name="newPassword"
															type="password"
															error={Boolean(touched.newPassword && errors.newPassword)}
															helperText={(touched.newPassword && errors.newPassword) || ''}
															as={TextField}
															placeholder={user.hasPassword ? 'Новый пароль' : ''}
															autoFocus={!user.hasPassword}
														/>
													</FormControl>
													{user.hasPassword ? (
														<FormControl margin="dense" fullWidth>
															<Field
																name="confirmPassword"
																type="password"
																error={Boolean(touched.confirmPassword && errors.confirmPassword)}
																helperText={(touched.confirmPassword && errors.confirmPassword) || ''}
																as={TextField}
																placeholder="Повторите пароль"
															/>
														</FormControl>
													) : null}
													<FormControl>
														<Button type="submit" disabled={isSubmitting} variant="contained" color="primary">
															{isSubmitting ? <CircularProgress size={20} style={{ position: 'absolute' }} /> : null}
															<span className="loading-button-label" style={{ opacity: Number(!isSubmitting) }}>
																{user.hasPassword ? 'Изменить пароль' : 'Установить'}
															</span>
														</Button>
													</FormControl>
												</Form>
											)}
										</Formik>
									) : (
										<TextField
											InputProps={{
												readOnly: true,
												value: user.hasPassword ? `обновлён ${moment(user.passwordUpdate).fromNow()}` : 'ещё не установлен',
											}}
											fullWidth
										/>
									)}
								</Grid>
								<ButtonBase
									className={styles.buttonLink}
									component="span"
									disableRipple
									onClick={this.onTogglePasswordFields}
									style={{ marginLeft: 10, marginTop: 10 }}
								>
									{!visiblePasswordFields ? (user.hasPassword ? 'Изменить' : 'Установить') : 'Отмена'}
								</ButtonBase>
							</Grid>
						) : null}
					</Grid>
				</Grid>
			</CardPaper>
		);
	}
}

const mapStateToProps = state => {
	return {
		user: state.user.data,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		editUser: values => dispatch(editUser(values)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ProfileSettings);
