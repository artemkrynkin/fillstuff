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

import styles from 'src/components/Layout/index.module.css';

const PasswordRecovery = () => {
	const { title: pageTitle, description: pageDescription } = generateMetaInfo({
		type: 'password-recovery',
		data: {
			title: 'Восстановление пароля',
		},
	});

	return (
		<div className={styles.wrapper}>
			<Head title={pageTitle} description={pageDescription} />

			<div className={styles.form}>
				<h2>Восстановление пароля</h2>
				<div className={styles.formFields}>
					<Formik
						initialValues={{ email: '', password: '' }}
						validateOnBlur={false}
						// onSubmit={(values, actions) => this.props.dispatch(authenticate(values, actions))}
						render={({ errors, touched, isSubmitting }) => (
							<Form>
								<FormControl margin="normal" fullWidth>
									<Field name="email" placeholder="Email" component={TextField} autoFocus />
								</FormControl>
								<Button type="submit" disabled={isSubmitting} className={styles.loginBtn} variant="contained" color="primary">
									{isSubmitting ? <CircularProgress size={20} /> : 'Восстановить пароль'}
								</Button>
							</Form>
						)}
					/>
				</div>
			</div>
			<div className={styles.bottomInfo}>
				<Link to="/login">Я помню пароль!</Link>
			</div>
		</div>
	);
};

export default PasswordRecovery;
