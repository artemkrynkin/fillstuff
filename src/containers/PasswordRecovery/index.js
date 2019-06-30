import React from 'react';
import { Link } from 'react-router-dom';

import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';

import Button from '@material-ui/core/Button/Button';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import FormControl from '@material-ui/core/FormControl/FormControl';

import generateMetaInfo from 'shared/generate-meta-info';

import Head from 'src/components/head';

// import { authenticate } from 'src/actions/auth';

const PasswordRecovery = () => {
	const { title: pageTitle, description: pageDescription } = generateMetaInfo({
		type: 'password-recovery',
		data: {
			title: 'Восстановление пароля',
		},
	});

	return (
		<div className="page__inner-content">
			<Head title={pageTitle} description={pageDescription} />

			<div className="layout-auth__form">
				<h2>Восстановление пароля</h2>
				<div className="layout-auth__form-fields">
					<Formik
						initialValues={{ email: '', password: '' }}
						validateOnBlur={false}
						// onSubmit={(values, actions) => this.props.dispatch(authenticate(values, actions))}
						render={({ errors, touched, isSubmitting }) => (
							<Form>
								<FormControl margin="normal" fullWidth>
									<Field name="email" placeholder="Email" component={TextField} autoFocus />
								</FormControl>
								<Button
									type="submit"
									disabled={isSubmitting}
									className="layout-auth__login-btn"
									variant="contained"
									color="primary"
								>
									{isSubmitting ? <CircularProgress size={20} /> : 'Восстановить пароль'}
								</Button>
							</Form>
						)}
					/>
				</div>
			</div>
			<div className="layout-auth__bottom-info">
				<Link to="/login">Я помню пароль!</Link>
			</div>
		</div>
	);
};

export default PasswordRecovery;
