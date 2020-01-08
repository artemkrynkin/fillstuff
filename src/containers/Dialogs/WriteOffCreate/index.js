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

import { getStockStatus } from 'src/actions/stocks';
import { createWriteOff } from 'src/actions/writeOffs';

import stylesGlobal from 'src/styles/globals.module.css';

const writeOffSchema = Yup.object().shape({
	quantity: Yup.number()
		.min(1)
		.required(),
	comment: Yup.string().required(),
});

class DialogWriteOffCreate extends Component {
	static propTypes = {
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		onExitedDialog: PropTypes.func,
		currentStockId: PropTypes.string.isRequired,
		selectedPosition: PropTypes.object,
	};

	onSubmit = (values, actions) => {
		const { onCloseDialog, currentUser, selectedPosition } = this.props;

		this.props.createWriteOff(currentUser._id, selectedPosition._id, values).then(response => {
			if (response.status === 'success') this.props.getStockStatus();
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
					initialValues={{ quantity: '', comment: '' }}
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
								<Grid className={stylesGlobal.formLabelControl}>
									<Field
										name="comment"
										label="Комментарий"
										error={Boolean(touched.comment && errors.comment)}
										helperText={(touched.comment && errors.comment) || ''}
										as={TextField}
										rows={2}
										rowsMax={4}
										multiline
										fullWidth
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

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStockId } = ownProps;

	return {
		getStockStatus: () => dispatch(getStockStatus(currentStockId)),
		createWriteOff: (userId, positionId, values) => dispatch(createWriteOff(currentStockId, userId, positionId, values)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DialogWriteOffCreate);
