import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik } from 'formik';

import { formatNumber } from 'shared/utils';

import { DialogStickyFR, DialogTitle } from 'src/components/Dialog';

import { getShops } from 'src/actions/shops';
import { getPositions } from 'src/actions/positions';
import { createProcurementExpected } from 'src/actions/procurements';
import { enqueueSnackbar } from 'src/actions/snackbars';

import { positionTransform } from './utils';
import FormProcurementExpectedCreate from './FormProcurementExpectedCreate';
import procurementSchema from './procurementSchema';

import styles from './index.module.css';

class ProcurementExpectedCreate extends Component {
	static propTypes = {
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		onExitedDialog: PropTypes.func,
	};

	dialogRef = createRef();

	onSubmit = (values, actions) => {
		const { onCloseDialog } = this.props;
		const procurement = procurementSchema(true).cast(values);

		procurement.totalPrice = formatNumber(procurement.pricePositions + procurement.costDelivery);

		this.props.createProcurementExpected(procurement).then(response => {
			actions.setSubmitting(false);

			if (response.status === 'success') {
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
	};

	onEnterDialog = () => {
		this.props.getShops();
		this.props.getPositions();
	};

	onExitedDialog = () => {
		const { onExitedDialog } = this.props;

		if (onExitedDialog) onExitedDialog();
	};

	render() {
		const { dialogOpen, onCloseDialog, shops, positions } = this.props;

		let initialValues = {
			shop: '',
			deliveryDate: undefined,
			deliveryTimeFrom: '',
			deliveryTimeTo: '',
			costDelivery: '',
			pricePositions: '',
			totalPrice: '',
			positions: [],
		};

		return (
			<DialogStickyFR
				ref={this.dialogRef}
				open={dialogOpen}
				onEnter={this.onEnterDialog}
				onClose={onCloseDialog}
				onExited={this.onExitedDialog}
				maxWidth="lg"
				scroll="body"
				stickyAnyone={[
					{
						stickySelector: styles.addPositionContainer,
						position: 'top',
						sentinelAdditionalText: 'AddPositionContainer',
					},
				]}
				stickyActions
			>
				<DialogTitle onClose={onCloseDialog}>Создание заказа</DialogTitle>
				<Formik
					initialValues={initialValues}
					validationSchema={procurementSchema()}
					validateOnBlur={false}
					validateOnChange={false}
					onSubmit={(values, actions) => this.onSubmit(values, actions)}
				>
					{props => (
						<FormProcurementExpectedCreate
							onCloseDialog={onCloseDialog}
							dialogRef={this.dialogRef}
							shops={shops}
							positions={positions}
							formikProps={props}
						/>
					)}
				</Formik>
			</DialogStickyFR>
		);
	}
}

const mapStateToProps = state => {
	const positions = { ...state.positions };

	if (positions.data && positions.data.length > 0) {
		positions.data = positions.data.filter(position => !position.isArchived).map(position => positionTransform(position));
	}

	return {
		shops: state.shops,
		positions: positions,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getShops: () => dispatch(getShops()),
		getPositions: () => dispatch(getPositions({ showRequest: false })),
		createProcurementExpected: procurement => dispatch(createProcurementExpected({ data: { procurement } })),
		enqueueSnackbar: (...args) => dispatch(enqueueSnackbar(...args)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ProcurementExpectedCreate);
