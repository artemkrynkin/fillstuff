import React from 'react';
import { connect } from 'react-redux';
import { StatusBar, Text, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { authentication } from '../../actions/authentication';

import styles from './styles';

const LoginSchema = Yup.object().shape({
	email: Yup.string()
		.email()
		.required('Обязательное поле'),
	password: Yup.string().required('Обязательное поле'),
});

function Login(props) {
	const initialValues = {
		email: '',
		password: '',
	};

	const onSubmit = (values, actions) => {
		console.log(1);
	};

	return (
		<>
			<StatusBar barStyle="light-content" animated />
			<View style={styles.container}>
				<Formik
					initialValues={initialValues}
					validationSchema={LoginSchema}
					validateOnBlur={false}
					validateOnChange={false}
					onSubmit={onSubmit}
				>
					{formikProps => null}
				</Formik>
			</View>
		</>
	);
}

const mapDispatchToProps = dispatch => {
	return {
		authentication: values => dispatch(authentication(values)),
	};
};

export default connect(null, mapDispatchToProps)(Login);
