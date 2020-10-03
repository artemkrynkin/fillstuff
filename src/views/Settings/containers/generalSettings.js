import React from 'react';
import { connect } from 'react-redux';

import { Formik } from 'formik';
import * as Yup from 'yup';

// import { findMemberInStock } from 'shared/roles-access-rights';
import { sleep } from 'shared/utils';

import CardPaper from 'src/components/CardPaper';

import { editStudio } from 'src/actions/studio';
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
		await sleep(500);

		props.editStudio(values).then(response => {
			actions.setSubmitting(false);

			if (response.status === 'error') {
				if (response.data.formErrors) {
					response.data.formErrors.forEach(error => {
						actions.setFieldError(error.field, error.message);
					});
				} else {
					if (response.status === 'error') {
						props.enqueueSnackbar({
							message: response.message || 'Неизвестная ошибка.',
							options: {
								variant: 'error',
							},
						});
					}
				}
			}
		});
	};

	return (
		<CardPaper elevation={1} leftContent="Общие" title style={{ marginBottom: 16 }}>
			<Formik
				initialValues={initialValues}
				validationSchema={PersonalDataSchema}
				validateOnChange={false}
				validateOnBlur={false}
				enableReinitialize
				onSubmit={(values, actions) => onSubmit(values, actions)}
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
		editStudio: data => dispatch(editStudio({ data })),
		enqueueSnackbar: (...args) => dispatch(enqueueSnackbar(...args)),
	};
};

export default connect(null, mapDispatchToProps)(GeneralSettings);
