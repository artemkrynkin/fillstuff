import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik } from 'formik';

import { sleep } from 'shared/utils';
import { receiptCalc } from 'shared/checkPositionAndReceipt';

import { Dialog, DialogTitle } from 'src/components/Dialog';

import { getStudioStore } from 'src/actions/studios';
import { createReceipt } from 'src/actions/receipts';
import { enqueueSnackbar } from 'src/actions/snackbars';

import FormReceiptCreate from './FormReceiptCreate';
import receiptSchema from './receiptSchema';

class DialogReceiptCreate extends Component {
	static propTypes = {
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		onExitedDialog: PropTypes.func,
		onCallback: PropTypes.func,
		selectedPosition: PropTypes.object,
	};

	initialState = {
		checkSellingPrice: true,
	};

	state = this.initialState;

	onSubmit = async (values, actions) => {
		const { onCloseDialog, onCallback } = this.props;
		const { checkSellingPrice } = this.state;
		const receipt = receiptSchema(false).cast(values);

		receiptCalc.unitPurchasePrice(receipt, {
			unitReceipt: receipt.position.unitReceipt,
			unitRelease: receipt.position.unitRelease,
		});

		receiptCalc.sellingPrice(receipt, {
			isFree: receipt.position.isFree,
		});

		if (!checkSellingPrice) {
			await sleep(500);

			actions.setValues(receipt, false);

			this.setState({ checkSellingPrice: true });

			actions.setSubmitting(false);
		} else {
			const { position, quantity, quantityPackages, ...remainingValues } = receiptSchema(true).cast(values);

			const newReceipt = {
				position: position._id,
				initial: {},
				...remainingValues,
			};

			if (!isNaN(quantity)) newReceipt.initial.quantity = quantity;
			if (!isNaN(quantityPackages)) newReceipt.initial.quantityPackages = quantityPackages;

			await this.props.createReceipt({ receipt: newReceipt }).then(response => {
				if (onCallback !== undefined) onCallback(response);

				actions.setSubmitting(false);

				if (response.status === 'success') {
					// this.props.getStudioStore();
					onCloseDialog();
				}

				if (response.status === 'error') {
					this.props.enqueueSnackbar({
						message: response.message || 'Неизвестная ошибка.',
						options: {
							variant: 'error',
						},
					});
				}
			});
		}
	};

	onEnterDialog = () => {
		const { selectedPosition } = this.props;

		if (selectedPosition && !selectedPosition.isFree) {
			this.setState({ checkSellingPrice: false });
		}
	};

	onExitedDialog = () => {
		const { onExitedDialog } = this.props;

		this.setState(this.initialState, () => {
			if (onExitedDialog) onExitedDialog();
		});
	};

	render() {
		const { dialogOpen, onCloseDialog, selectedPosition } = this.props;
		const { checkSellingPrice } = this.state;

		if (!selectedPosition) return null;

		const initialValues = {
			position: selectedPosition,
			quantity: '',
			quantityPackages: '',
			quantityInUnit: '',
			purchasePrice: '',
			unitPurchasePrice: '',
			sellingPrice: '',
			unitSellingPrice: '',
			costDelivery: 0,
			unitCostDelivery: 0,
			markupPercent: '',
			markup: '',
			unitMarkup: '',
		};

		return (
			<Dialog open={dialogOpen} onEnter={this.onEnterDialog} onClose={onCloseDialog} onExited={this.onExitedDialog} maxWidth="lg">
				<DialogTitle onClose={onCloseDialog} theme="white">
					Создание поступления
				</DialogTitle>
				<Formik
					initialValues={initialValues}
					validationSchema={receiptSchema(false)}
					validateOnBlur={false}
					validateOnChange={false}
					onSubmit={(values, actions) => this.onSubmit(values, actions)}
				>
					{props => <FormReceiptCreate onCloseDialog={onCloseDialog} checkSellingPrice={checkSellingPrice} formikProps={props} />}
				</Formik>
			</Dialog>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getStudioStore: () => dispatch(getStudioStore()),
		createReceipt: receipt => dispatch(createReceipt({ data: receipt })),
		enqueueSnackbar: (...args) => dispatch(enqueueSnackbar(...args)),
	};
};

export default connect(null, mapDispatchToProps)(DialogReceiptCreate);
