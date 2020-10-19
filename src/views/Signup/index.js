import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import queryString from 'query-string';

import Button from '@material-ui/core/Button/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

import generateMetaInfo from 'shared/generate-meta-info';

import history from 'src/helpers/history';
// import { CLIENT_URL } from 'src/api/constants';

import Head from 'src/components/head';

import { signup } from 'src/actions/signup';

import styles from 'src/components/Layout/index.module.css';

const SignupSchema = Yup.object().shape({
	email: Yup.string()
		.email('Некорректный Email')
		.required('Обязательное поле'),
	name: Yup.string().required('Обязательное поле'),
	password: Yup.string().required('Обязательное поле'),
});

const Signup = props => {
	// const [rememberRegData, setRememberRegData] = useState(null);

	const { title: pageTitle, description: pageDescription } = generateMetaInfo({
		type: 'signup',
		data: {
			title: 'Регистрация',
		},
	});

	const onSubmit = (values, actions) => {
		// setRememberRegData(values);
		props.signup(values).then(({ status }) => {
			actions.setSubmitting(false);

			if (status === 'success') {
				// window.location.href = `${CLIENT_URL}/dashboard`;
			} else {
				history.push({
					pathname: '/login',
					search: queryString.stringify({
						email: values.email,
						infoCode: 'existingUser',
					}),
				});
			}
		});
	};

	return (
		<div className={styles.wrapper}>
			<Head title={pageTitle} description={pageDescription} />

			<div className={styles.form}>
				<h2>Регистрация аккаунта</h2>
				<div className={styles.formFields}>
					<Formik
						initialValues={{
							email: '',
							name: '',
							password: '',
						}}
						validationSchema={SignupSchema}
						validateOnBlur={false}
						validateOnChange={false}
						onSubmit={(values, actions) => onSubmit(values, actions)}
					>
						{({ errors, isSubmitting, touched }) => (
							<Form>
								<FormControl margin="normal" fullWidth>
									<Field
										name="email"
										placeholder="Введите адрес электронной почты"
										error={Boolean(touched.email && errors.email)}
										helperText={(touched.email && errors.email) || ''}
										as={TextField}
										autoComplete="username"
										autoFocus
									/>
								</FormControl>
								<FormControl margin="normal" fullWidth>
									<Field
										name="name"
										placeholder="Введите полное имя"
										error={Boolean(touched.name && errors.name)}
										helperText={(touched.name && errors.name) || ''}
										as={TextField}
										autoComplete="name"
									/>
								</FormControl>
								<FormControl margin="normal" fullWidth>
									<Field
										type="password"
										name="password"
										placeholder="Придумайте пароль"
										error={Boolean(touched.password && errors.password)}
										helperText={(touched.password && errors.password) || ''}
										as={TextField}
										autoComplete="off"
									/>
								</FormControl>

								<Button type="submit" disabled={isSubmitting} variant="contained" color="primary" fullWidth>
									{isSubmitting ? <CircularProgress size={20} style={{ position: 'absolute' }} /> : null}
									<span className="loading-button-label" style={{ opacity: Number(!isSubmitting) }}>
										Зарегистрироваться
									</span>
								</Button>
							</Form>
						)}
					</Formik>
				</div>
			</div>
			<div className={styles.bottomInfo}>
				<Link to="/login">Уже есть аккаунт Blikside? Войти</Link>
			</div>
		</div>
	);
};

const mapDispatchToProps = dispatch => {
	return {
		signup: data => dispatch(signup({ data })),
	};
};

export default connect(null, mapDispatchToProps)(Signup);
