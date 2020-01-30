import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import Button from '@material-ui/core/Button/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

import generateMetaInfo from 'shared/generate-meta-info';

import { CLIENT_URL } from 'src/api/constants';

import Head from 'src/components/head';

import { registration } from 'src/actions/registration';

import styles from 'src/components/Layout/index.module.css';

const RegistrationSchema = Yup.object().shape({
	email: Yup.string()
		.email('Некорректный Email')
		.required('Обязательное поле'),
	password: Yup.string().required('Обязательное поле'),
});

const Registration = props => {
	const [rememberRegData, setRememberRegData] = useState(null);

	console.log(rememberRegData);

	const { title: pageTitle, description: pageDescription } = generateMetaInfo({
		type: 'registration',
		data: {
			title: 'Регистрация',
		},
	});

	const onSubmit = (values, actions) => {
		setRememberRegData(values);
		this.props
			.registration(values, actions)
			.then(() => {
				actions.setSubmitting(false);
				window.location.href = `${CLIENT_URL}/dashboard`;
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
				<h2>Регистрация</h2>
				<div className={styles.formFields}>
					<Formik
						initialValues={{
							email: '',
							password: '',
						}}
						validationSchema={RegistrationSchema}
						validateOnBlur={false}
						validateOnChange={false}
						onSubmit={(values, actions) => onSubmit(values, actions)}
					>
						{({ errors, isSubmitting, touched }) => (
							<Form>
								<FormControl margin="normal" fullWidth>
									<Field
										name="email"
										placeholder="Email"
										error={Boolean(touched.email && errors.email)}
										helperText={(touched.email && errors.email) || ''}
										as={TextField}
										autoFocus
									/>
								</FormControl>
								<FormControl margin="normal" fullWidth>
									<Field
										type="password"
										name="password"
										placeholder="Пароль"
										error={Boolean(touched.password && errors.password)}
										helperText={(touched.password && errors.password) || ''}
										as={TextField}
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
				Уже есть аккаунт? <Link to="/login">Войти</Link>
			</div>
		</div>
	);
};

const mapDispatchToProps = () => {
	return {
		registration: data => registration({ data }),
	};
};

export default connect(null, mapDispatchToProps)(Registration);
