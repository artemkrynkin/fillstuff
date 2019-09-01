import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import * as Yup from 'yup';

import CircularProgress from '@material-ui/core/CircularProgress';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import MuiTextField from '@material-ui/core/TextField/TextField';

import { Dialog, PDDialogActions, PDDialogTitle } from 'src/components/Dialog';

import { getStockStatus } from 'src/actions/stocks';
import { addQuantityPosition } from 'src/actions/positions';

import './index.styl';

const addQuantitySchema = Yup.object().shape({
	quantity: Yup.number()
		.min(1)
		.required(),
	comment: Yup.string().required(),
});

class DialogPositionAddQuantity extends Component {
	static propTypes = {
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		onExitedDialog: PropTypes.func,
		currentStockId: PropTypes.string.isRequired,
		selectedPosition: PropTypes.object,
	};

	onSubmit = (values, actions) => {
		const { onCloseDialog, selectedPosition } = this.props;

		this.props.addQuantityPosition(selectedPosition._id, values).then(response => {
			if (response.status === 'success') {
				this.props.getStockStatus();
				onCloseDialog();
			} else actions.setSubmitting(false);
		});
	};

	render() {
		const { dialogOpen, onCloseDialog, onExitedDialog, selectedPosition } = this.props;

		if (!selectedPosition) return null;

		return (
			<Dialog open={dialogOpen} onClose={onCloseDialog} onExited={onExitedDialog} maxWidth="md" scroll="body">
				<PDDialogTitle theme="primary" onClose={onCloseDialog}>
					Добавление количества
				</PDDialogTitle>
				<Formik
					initialValues={{ quantity: '', comment: '' }}
					validationSchema={addQuantitySchema}
					validateOnBlur={false}
					validateOnChange={false}
					onSubmit={(values, actions) => this.onSubmit(values, actions)}
					render={({ errors, touched, isSubmitting, values }) => (
						<Form>
							<DialogContent>
								<Grid className="pd-rowGridFormLabelControl">
									<MuiTextField
										label="Наименование"
										InputProps={{
											value: selectedPosition.name,
											readOnly: true,
										}}
										InputLabelProps={{
											shrink: true,
										}}
										fullWidth
									/>
								</Grid>
								<Grid className="pd-rowGridFormLabelControl">
									<Field
										name="quantity"
										type="number"
										label="Количество"
										component={TextField}
										InputLabelProps={{
											shrink: true,
										}}
										autoComplete="off"
										fullWidth
										autoFocus
									/>
								</Grid>
								<Grid className="pd-rowGridFormLabelControl">
									<Field
										name="comment"
										label="Комментарий"
										component={TextField}
										InputLabelProps={{
											shrink: true,
										}}
										autoComplete="off"
										rowsMax={4}
										multiline
										fullWidth
									/>
								</Grid>
							</DialogContent>
							<PDDialogActions
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
									text: isSubmitting ? <CircularProgress size={20} /> : 'Добавить',
								}}
							/>
						</Form>
					)}
				/>
			</Dialog>
		);
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStockId } = ownProps;

	return {
		getStockStatus: () => dispatch(getStockStatus(currentStockId)),
		addQuantityPosition: (positionId, values) => dispatch(addQuantityPosition(currentStockId, positionId, values)),
	};
};

export default connect(
	null,
	mapDispatchToProps
)(DialogPositionAddQuantity);
