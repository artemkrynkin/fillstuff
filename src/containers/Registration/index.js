import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import Button from '@material-ui/core/Button/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

import generateMetaInfo from 'shared/generate-meta-info';

import Head from 'src/components/head';

import { registration } from 'src/actions/registration';

import styles from 'src/components/Layout/index.module.css';

const RegistrationSchema = Yup.object().shape({
	email: Yup.string()
		.email('Некорректный Email')
		.required('Обязательное поле'),
	password: Yup.string().required('Обязательное поле'),
});

const initialValues = {
	email: '',
	password: '',
};

class Registration extends Component {
	setRememberRegData = data => {
		this.setState({ rememberRegData: data });
	};

	render() {
		const { title: pageTitle, description: pageDescription } = generateMetaInfo({
			type: 'registration',
			data: {
				title: 'Регистрация',
			},
		});

		return (
			<div className={styles.wrapper}>
				<Head title={pageTitle} description={pageDescription} />

				<div className={styles.form}>
					<h2>Регистрация</h2>
					<div className={styles.formFields}>
						<Formik
							initialValues={initialValues}
							validationSchema={RegistrationSchema}
							validateOnBlur={false}
							validateOnChange={false}
							onSubmit={(values, actions) => {
								this.setRememberRegData(values);
								this.props.registration(values, actions);
							}}
						>
							{({ errors, isSubmitting, touched }) => {
								return (
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
										<Button type="submit" disabled={isSubmitting} className={styles.loginBtn} variant="contained" color="primary">
											{isSubmitting ? <CircularProgress size={20} /> : 'Зарегистрироваться'}
										</Button>
									</Form>
								);
							}}
						</Formik>
					</div>
				</div>
				<div className={styles.bottomInfo}>
					Уже есть аккаунт? <Link to="/login">Войти</Link>
				</div>
			</div>
		);
	}
}

const mapDispatchToProps = () => {
	return {
		registration: (values, actions) => registration(values, actions),
	};
};

export default connect(
	null,
	mapDispatchToProps
)(Registration);
