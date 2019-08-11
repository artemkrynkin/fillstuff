import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import * as Yup from 'yup';

import CircularProgress from '@material-ui/core/CircularProgress';
import { DialogContent } from '@material-ui/core';

import { PDDialog, PDDialogActions, PDDialogTitle } from 'src/components/Dialog';

import { getStockStatus } from 'src/actions/stocks';
import { createWriteOff } from 'src/actions/writeOffs';

import './index.styl';

const writeOffSchema = Yup.object().shape({
	quantity: Yup.number()
		.min(1, 'Введите количество')
		.required(),
});

class CreateWriteOff extends Component {
	static propTypes = {
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		currentStock: PropTypes.object.isRequired,
		selectedProduct: PropTypes.object,
		selectedMarker: PropTypes.object,
	};

	render() {
		const { dialogOpen, onCloseDialog, onExitedDialog, currentUser, selectedProduct, selectedMarker } = this.props;

		if (!selectedProduct || !selectedMarker) return null;

		return (
			<PDDialog open={dialogOpen} onClose={onCloseDialog} onExited={onExitedDialog} maxWidth="md" scroll="body" stickyActions>
				<PDDialogTitle theme="primary" onClose={onCloseDialog}>
					Списание количества
				</PDDialogTitle>
				<Formik
					initialValues={{ quantity: '' }}
					validationSchema={writeOffSchema}
					validateOnBlur={false}
					validateOnChange={false}
					onSubmit={(values, actions) => {
						this.props.createWriteOff(selectedMarker._id, currentUser._id, values).then(response => {
							if (response.status === 'success') {
								this.props.getStockStatus();
								onCloseDialog();
							} else actions.setSubmitting(false);
						});
					}}
					render={({ errors, touched, isSubmitting, values }) => (
						<Form>
							<DialogContent>
								Позиция: {selectedProduct.name}
								<br />
								Маркер: {selectedMarker.mainCharacteristic.label}
								<br />
								<br />
								<Field
									name="quantity"
									type="number"
									component={TextField}
									InputLabelProps={{
										shrink: true,
									}}
									autoComplete="off"
									validate={value => {
										if (value > selectedMarker.quantity) {
											return `Максимум для списания: ${selectedMarker.quantity}`;
										}
									}}
									fullWidth
									autoFocus
								/>
							</DialogContent>
							<PDDialogActions
								leftHandleProps={{
									handleProps: {
										onClick: onCloseDialog,
									},
									text: 'Закрыть',
								}}
								rightHandleProps={{
									handleProps: {
										type: 'submit',
										disabled: isSubmitting,
									},
									text: isSubmitting ? <CircularProgress size={20} /> : 'Списать',
								}}
							/>
						</Form>
					)}
				/>
			</PDDialog>
		);
	}
}

const mapStateToProps = state => {
	return {
		currentUser: state.user.data,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStock } = ownProps;

	return {
		getStockStatus: () => dispatch(getStockStatus(currentStock._id)),
		createWriteOff: (markerId, userId, values) => dispatch(createWriteOff(currentStock._id, markerId, userId, values)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CreateWriteOff);
