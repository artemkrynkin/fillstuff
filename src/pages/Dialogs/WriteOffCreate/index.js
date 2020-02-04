import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField/TextField';

import { Dialog, DialogActions, DialogTitle } from 'src/components/Dialog';
import NumberFormat from 'src/components/NumberFormat';

import { getStudioStock } from 'src/actions/studio';
import { createWriteOff } from 'src/actions/writeOffs';

import stylesGlobal from 'src/styles/globals.module.css';

const writeOffSchema = Yup.object().shape({
	quantity: Yup.number()
		.min(1)
		.required(),
});

class DialogWriteOffCreate extends Component {
	static propTypes = {
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		onExitedDialog: PropTypes.func,
		selectedPosition: PropTypes.object,
	};

	onSubmit = (values, actions) => {
		const { onCloseDialog, selectedPosition } = this.props;

		this.props.createWriteOff(selectedPosition._id, values).then(response => {
			if (response.status === 'success') this.props.getStudioStock();
			actions.setSubmitting(false);
			onCloseDialog();
		});
	};

	render() {
		const { dialogOpen, onCloseDialog, onExitedDialog, selectedPosition } = this.props;

		if (!selectedPosition) return null;

		return (
			<Dialog open={dialogOpen} onClose={onCloseDialog} onExited={onExitedDialog} maxWidth="md" scroll="body">
				<DialogTitle onClose={onCloseDialog}>Списание количества</DialogTitle>
				<Formik
					initialValues={{ quantity: '' }}
					validationSchema={writeOffSchema}
					validateOnBlur={false}
					validateOnChange={false}
					onSubmit={(values, actions) => this.onSubmit(values, actions)}
				>
					{({ errors, isSubmitting, touched }) => (
						<Form>
							<DialogContent>
								<Grid className={stylesGlobal.formLabelControl}>
									<TextField
										className="none-padding"
										label="Наименование"
										InputProps={{
											value: selectedPosition.name,
											readOnly: true,
										}}
										fullWidth
									/>
								</Grid>
								<Grid className={stylesGlobal.formLabelControl}>
									<Field
										name="quantity"
										label="Количество"
										error={Boolean(touched.quantity && errors.quantity)}
										helperText={(touched.quantity && errors.quantity) || ''}
										as={TextField}
										InputProps={{
											inputComponent: NumberFormat,
											inputProps: {
												allowNegative: false,
											},
										}}
										fullWidth
										autoFocus
									/>
								</Grid>
							</DialogContent>
							<DialogActions
								leftHandleProps={{
									handleProps: {
										onClick: onCloseDialog,
									},
									text: 'Отмена',
								}}
								rightHandleProps={{
									handleProps: {
										type: 'submit',
										disabled: isSubmitting,
									},
									text: 'Списать',
									isLoading: isSubmitting,
								}}
							/>
						</Form>
					)}
				</Formik>
			</Dialog>
		);
	}
}

const mapStateToProps = state => {
	return {
		currentUser: state.user.data,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getStudioStock: () => dispatch(getStudioStock()),
		createWriteOff: (positionId, data) => dispatch(createWriteOff({ params: { positionId }, data })),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DialogWriteOffCreate);
