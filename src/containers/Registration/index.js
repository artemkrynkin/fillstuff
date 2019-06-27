import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import * as Yup from 'yup';

import Button from '@material-ui/core/Button/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';

import generateMetaInfo from 'shared/generate-meta-info';

import Head from 'src/components/head';

import { registration } from 'src/actions/registration';

const RegistrationSchema = Yup.object().shape({
	email: Yup.string()
		.email('Некорректный Email')
		.required('Обязательное поле'),
	password: Yup.string().required('Обязательное поле'),
});

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
			<div className="page__inner-content">
				<Head title={pageTitle} description={pageDescription} />

				<div className="auth-layout__form">
					<h2>Регистрация</h2>
					<div className="auth-layout__form-fields">
						<Formik
							initialValues={{ email: '', password: '' }}
							validationSchema={RegistrationSchema}
							validateOnBlur={false}
							onSubmit={(values, actions) => {
								this.setRememberRegData(values);
								this.props.registration(values, actions);
							}}
							render={({ errors, touched, isSubmitting }) => (
								<Form>
									<FormControl margin="normal" fullWidth>
										<Field name="email" placeholder="Email" component={TextField} autoFocus />
									</FormControl>
									<FormControl margin="normal" fullWidth>
										<Field type="password" name="password" placeholder="Пароль" component={TextField} />
									</FormControl>
									<Button
										type="submit"
										disabled={isSubmitting}
										className="auth-layout__login-btn"
										variant="contained"
										color="primary"
									>
										{isSubmitting ? <CircularProgress size={20} /> : 'Зарегистрироваться'}
									</Button>
								</Form>
							)}
						/>
					</div>
				</div>
				<div className="auth-layout__bottom-info">
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
