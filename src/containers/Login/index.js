import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import queryString from 'query-string';

import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button/Button';
import ButtonBase from '@material-ui/core/ButtonBase/ButtonBase';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

import generateMetaInfo from 'shared/generate-meta-info';

import { SERVER_URL, CLIENT_URL } from 'src/api/constants';

import Head from 'src/components/head';

import { login } from 'src/actions/authentication';

const Login = props => {
	const { title: pageTitle, description: pageDescription } = generateMetaInfo({
		type: 'login',
		data: {
			title: 'Вход',
		},
	});
	const { redirectPath, location } = props;

	let r;
	if (location) {
		const searchObj = queryString.parse(props.location.search);
		r = searchObj.r;
	}

	const postAuthRedirectPath = redirectPath !== undefined || r !== undefined ? `${redirectPath || r}` : `${CLIENT_URL}/projects`;

	return (
		<div className="page__inner-content">
			<Head title={pageTitle} description={pageDescription} />
			<div className="auth-layout__form">
				<h2>Войдите, чтобы начать</h2>
				<div className="auth-layout__social-network-login">
					<div className="auth-layout__social-networks">
						<ButtonBase
							href={`${SERVER_URL}/auth/vk?r=${postAuthRedirectPath}`}
							className="auth-layout__social-networks-item auth-layout__social-networks-item_vk"
						>
							<FontAwesomeIcon icon={['fab', 'vk']} />
							Войти с помощью ВКонтакте
						</ButtonBase>
					</div>
				</div>
				<div className="auth-layout__or">
					<Divider />
					<div className="auth-layout__or-text">или</div>
				</div>
				<div className="auth-layout__form-fields">
					<Formik
						initialValues={{ email: '', password: '' }}
						validateOnBlur={false}
						validateOnChange={false}
						onSubmit={(values, actions) => {
							if (!values.email || !values.password) {
								actions.setFieldError('unknown', 'Email or password is incorrect');
								actions.setSubmitting(false);
								return;
							}

							props.login(values, actions, postAuthRedirectPath);
						}}
						render={({ errors, touched, isSubmitting }) => (
							<Form>
								<FormControl margin="normal" fullWidth>
									<Field
										name="email"
										placeholder="Email"
										component={TextField}
										InputProps={{
											error: Boolean(errors.unknown),
										}}
										autoFocus
									/>
								</FormControl>
								<FormControl margin="normal" fullWidth>
									<Field
										name="password"
										type="password"
										placeholder="Пароль"
										component={TextField}
										InputProps={{
											error: Boolean(errors.unknown),
										}}
									/>
								</FormControl>
								{errors.unknown ? (
									<FormHelperText
										error={true}
										style={{
											textAlign: 'center',
											margin: '-10px 0 10px',
										}}
									>
										{errors.unknown}
									</FormHelperText>
								) : null}
								<Button
									type="submit"
									disabled={isSubmitting}
									className="auth-layout__login-btn"
									variant="contained"
									color="primary"
								>
									{isSubmitting ? <CircularProgress size={20} /> : 'Войти'}
								</Button>
							</Form>
						)}
					/>
					<div className="auth-layout__bottom-form-info">
						<Link to="/password-recovery">Забыли пароль?</Link>
					</div>
				</div>
			</div>
			<div className="auth-layout__bottom-info">
				Нет аккаунта? <Link to="/registration">Создайте его за пару секунд</Link>
			</div>
		</div>
	);
};

const mapDispatchToProps = () => {
	return {
		login: (values, actions, redirect) => login(values, actions, redirect),
	};
};

export default connect(
	null,
	mapDispatchToProps
)(Login);
