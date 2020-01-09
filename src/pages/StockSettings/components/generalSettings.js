import React from 'react';
import { connect } from 'react-redux';

import { Formik } from 'formik';
import * as Yup from 'yup';

import { findMemberInStock } from 'shared/roles-access-rights';
import { sleep } from 'shared/utils';

import CardPaper from 'src/components/CardPaper';

import { editStock } from 'src/actions/stocks';

import FormGeneralSettings from './FormGeneralSettings';

const PersonalDataSchema = Yup.object().shape({
	name: Yup.string()
		.min(2)
		.required(),
	timezone: Yup.string().required(),
});

const GeneralSettings = props => {
	const { stocks, currentUser, currentStock, currentUserRole = findMemberInStock(currentUser._id, currentStock).role } = props;

	const initialValues = {
		name: currentStock.name,
		timezone: currentStock.timezone,
		settings: currentStock.settings,
	};

	return (
		<CardPaper elevation={1} leftContent="Общие" title style={{ marginBottom: 16 }}>
			<Formik
				initialValues={initialValues}
				validationSchema={PersonalDataSchema}
				validateOnChange={false}
				validateOnBlur={false}
				enableReinitialize
				onSubmit={async (values, actions) => {
					await sleep(500);

					props.editStock(values).then(response => {
						if (response.status === 'error') {
							if (response.data.formErrors) {
								response.data.formErrors.forEach(error => {
									actions.setFieldError(error.field, error.message);
								});
							}

							actions.setSubmitting(false);
						}
					});
				}}
			>
				{props => <FormGeneralSettings stocks={stocks} currentStock={currentStock} currentUserRole={currentUserRole} formikProps={props} />}
			</Formik>
		</CardPaper>
	);
};

const mapStateToProps = state => {
	return {
		stocks: state.stocks.data,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStock } = ownProps;

	return {
		editStock: newValues => dispatch(editStock(currentStock._id, newValues)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(GeneralSettings);
