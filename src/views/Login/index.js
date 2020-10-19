import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import Button from '@material-ui/core/Button/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
// import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

import generateMetaInfo from 'shared/generate-meta-info';

// import { CLIENT_URL } from 'src/api/constants';

import history from 'src/helpers/history';

import Head from 'src/components/head';

import { login } from 'src/actions/authentication';
import { enqueueSnackbar } from 'src/actions/snackbars';

import styles from 'src/components/Layout/index.module.css';

const LoginSchema = Yup.object().shape({
	email: Yup.string().required('Обязательное поле'),
	password: Yup.string().required('Обязательное поле'),
});

const Login = props => {
	// const { redirectPath, location } = props;

	const { title: pageTitle, description: pageDescription } = generateMetaInfo({
		type: 'login',
		data: {
			title: 'Вход',
		},
	});

	// let r;
	// if (location) {
	// 	const searchObj = queryString.parse(props.location.search);
	// 	r = searchObj.r;
	// }

	// const postAuthRedirectPath = redirectPath !== undefined || r !== undefined ? `${redirectPath || r}` : `${CLIENT_URL}/dashboard`;

	const onSubmit = (values, actions) => {
		props.login(values).then(({ status, data }) => {
			actions.setSubmitting(false);

			if (status === 'error') {
				actions.setErrors({
					email: true,
					password: true,
				});

				props.enqueueSnackbar({
					message: data.error_description || 'Неизвестная ошибка.',
					options: {
						variant: 'error',
					},
				});
			}

			// window.location.href = postAuthRedirectPath || response.data;
		});
	};

	useEffect(() => {
		const query = queryString.parse(window.location.search);

		if (query.snackbarMessage && query.snackbarType) {
			props
				.enqueueSnackbar({
					message: query.snackbarMessage || 'Неизвестная ошибка.',
					options: {
						variant: query.snackbarType,
					},
				})
				.then(() => {
					history.replace('/login');
				});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className={styles.wrapper}>
			<Head title={pageTitle} description={pageDescription} />
			<div className={styles.form}>
				<h2>Войдите в свой аккаунт</h2>
				{/*<div className={styles.or}>*/}
				{/*	<Divider />*/}
				{/*	<div className={styles.orText}>или</div>*/}
				{/*</div>*/}
				<div className={styles.formFields}>
					<Formik
						initialValues={{
							email: '',
							password: '',
						}}
						validationSchema={LoginSchema}
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
											placeholder="Введите адрес электронной почты"
											error={Boolean(touched.email && errors.email)}
											as={TextField}
											autoComplete="username"
											autoFocus
										/>
									</FormControl>
									<FormControl margin="normal" fullWidth>
										<Field
											name="password"
											type="password"
											placeholder="Введите пароль"
											error={Boolean(touched.password && errors.password)}
											as={TextField}
										/>
									</FormControl>
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
				Нет аккаунта? <Link to="/signup">Создайте его за пару секунд</Link>
			</div>
		</div>
	);
};

const mapDispatchToProps = dispatch => {
	return {
		login: data => dispatch(login({ data })),
		enqueueSnackbar: (...args) => dispatch(enqueueSnackbar(...args)),
	};
};

export default connect(null, mapDispatchToProps)(Login);
