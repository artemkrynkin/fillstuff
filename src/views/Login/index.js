import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { Formik, Form, Field } from 'formik';

import Button from '@material-ui/core/Button/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
// import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';

import generateMetaInfo from 'shared/generate-meta-info';

import { CLIENT_URL } from 'src/api/constants';

import Head from 'src/components/head';

import { login } from 'src/actions/authentication';

import styles from 'src/components/Layout/index.module.css';

const Login = props => {
	const { redirectPath, location } = props;

	const { title: pageTitle, description: pageDescription } = generateMetaInfo({
		type: 'login',
		data: {
			title: 'Вход',
		},
	});

	let r;
	if (location) {
		const searchObj = queryString.parse(props.location.search);
		r = searchObj.r;
	}

	const postAuthRedirectPath = redirectPath !== undefined || r !== undefined ? `${redirectPath || r}` : `${CLIENT_URL}/dashboard`;

	const onSubmit = (values, actions) => {
		if (!values.email || !values.password) {
			actions.setFieldError('unknown', 'Email or password is incorrect');
			actions.setSubmitting(false);
			return;
		}

		props
			.login(values)
			.then(response => {
				if (actions) actions.setSubmitting(false);

				window.location.href = postAuthRedirectPath || response.data;
			})
			.catch(error => {
				let data = error.response.data;

				data.formErrors.forEach(error => {
					actions.setFieldError(error.field, error.message);
				});

				actions.setSubmitting(false);
			});
	};

	return (
		<div className={styles.wrapper}>
			<Head title={pageTitle} description={pageDescription} />
			<div className={styles.form}>
				<h2>Войдите, чтобы начать</h2>
				{/*<div className={styles.or}>*/}
				{/*	<Divider />*/}
				{/*	<div className={styles.orText}>или</div>*/}
				{/*</div>*/}
				<div className={styles.formFields}>
					<Formik
						initialValues={{ email: '', password: '' }}
						validateOnBlur={false}
						validateOnChange={false}
						onSubmit={(values, actions) => onSubmit(values, actions)}
					>
						{({ errors, isSubmitting, touched }) => {
							return (
								<Form>
									<FormControl margin="normal" fullWidth>
										<Field
											name="email"
											placeholder="Email"
											error={Boolean((touched.email || touched.password) && errors.unknown)}
											as={TextField}
											autoComplete="on"
											autoFocus
										/>
									</FormControl>
									<FormControl margin="normal" fullWidth>
										<Field
											name="password"
											type="password"
											placeholder="Пароль"
											error={Boolean((touched.email || touched.password) && errors.unknown)}
											as={TextField}
										/>
									</FormControl>
									{(touched.email || touched.password) && errors.unknown ? (
										<FormHelperText
											style={{
												textAlign: 'center',
												margin: '-10px 0 10px',
											}}
											error
										>
											{errors.unknown}
										</FormHelperText>
									) : null}
									<Button type="submit" disabled={isSubmitting} variant="contained" color="primary" fullWidth>
										{isSubmitting ? <CircularProgress size={20} style={{ position: 'absolute' }} /> : null}
										<span className="loading-button-label" style={{ opacity: Number(!isSubmitting) }}>
											Войти
										</span>
									</Button>
								</Form>
							);
						}}
					</Formik>
					<div className={styles.bottomFormInfo}>
						<Link to="/password-recovery">Забыли пароль?</Link>
					</div>
				</div>
			</div>
			<div className={styles.bottomInfo}>
				Нет аккаунта? <Link to="/registration">Создайте его за пару секунд</Link>
			</div>
		</div>
	);
};

const mapDispatchToProps = dispatch => {
	return {
		login: data => login({ data }),
	};
};

export default connect(null, mapDispatchToProps)(Login);
