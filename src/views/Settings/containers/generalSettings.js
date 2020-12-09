import React from 'react';
import { connect } from 'react-redux';

import { Formik } from 'formik';
import * as Yup from 'yup';

// import { findMemberInStock } from 'shared/roles-access-rights';

import CardPaper from 'src/components/CardPaper';

import { editStudio } from 'src/actions/studios';
import { enqueueSnackbar } from 'src/actions/snackbars';

import FormGeneralSettings from './FormGeneralSettings';

const PersonalDataSchema = Yup.object().shape({
	name: Yup.string()
		.min(2)
		.required(),
	timezone: Yup.string().required(),
});

const GeneralSettings = props => {
	const {
		// currentUser,
		currentStudio,
		// currentUserRole = findMemberInStock(currentUser._id, currentStudio).role
	} = props;

	const initialValues = {
		name: currentStudio.name,
		timezone: currentStudio.timezone,
		settings: currentStudio.settings,
	};

	const onSubmit = async (values, actions) => {
		try {
			await props.editStudio(values);
		} catch (error) {
			if (error.status === 'error') {
				if (error.data.formErrors) {
					error.data.formErrors.forEach(error => {
						actions.setFieldError(error.field, error.message);
					});
				} else {
					if (error.status === 'error') {
						props.enqueueSnackbar({
							message: error.message || 'Неизвестная ошибка.',
							options: {
								variant: 'error',
							},
						});
					}
				}
			}
		}
	};

	return (
		<CardPaper elevation={1} leftContent="Общие" title style={{ marginBottom: 16 }}>
			<Formik
				initialValues={initialValues}
				validationSchema={PersonalDataSchema}
				validateOnChange={false}
				validateOnBlur={false}
				enableReinitialize
				onSubmit={onSubmit}
			>
				{props => (
					<FormGeneralSettings
						currentStudio={currentStudio}
						// currentUserRole={currentUserRole}
						formikProps={props}
					/>
				)}
			</Formik>
		</CardPaper>
	);
};

const mapDispatchToProps = dispatch => {
	return {
		editStudio: data => dispatch(editStudio({ data: { studio: data } })),
		enqueueSnackbar: (...args) => dispatch(enqueueSnackbar(...args)),
	};
};

export default connect(null, mapDispatchToProps)(GeneralSettings);
