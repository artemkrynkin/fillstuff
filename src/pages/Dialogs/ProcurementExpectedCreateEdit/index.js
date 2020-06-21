import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import moment from 'moment';

import { formatNumber } from 'shared/utils';

import { DialogStickyFR, DialogTitle } from 'src/components/Dialog';

import { procurementPositionTransform } from 'src/helpers/utils';

import { getShops } from 'src/actions/shops';
import { getPositions } from 'src/actions/positions';
import { createProcurementExpected, editProcurementExpected } from 'src/actions/procurements';
import { enqueueSnackbar } from 'src/actions/snackbars';

import FormProcurementExpectedCreateEdit from './FormProcurementExpectedCreateEdit';
import procurementSchema from './procurementSchema';

import styles from './index.module.css';

class ProcurementExpectedCreateEdit extends Component {
	static propTypes = {
		type: PropTypes.oneOf(['create', 'edit']).isRequired,
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		onExitedDialog: PropTypes.func,
	};

	dialogRef = createRef();

	onSubmit = (values, actions) => {
		const { type, onCloseDialog } = this.props;
		const procurement = procurementSchema(true).cast(values);

		procurement.totalPrice = formatNumber(procurement.pricePositions + procurement.costDelivery);

		if (type === 'create') {
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
		} else {
			this.props.editProcurementExpected(procurement._id, procurement).then(response => {
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
		}
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
		const { type, dialogOpen, onCloseDialog, shops, positions, selectedProcurement } = this.props;

		if (type === 'edit' && !selectedProcurement) return null;

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

		if (selectedProcurement) {
			initialValues = {
				...initialValues,
				...selectedProcurement,
			};

			if (type === 'edit') {
				initialValues.deliveryDate = moment(selectedProcurement.deliveryDate).format();
				initialValues.deliveryTimeFrom = moment(selectedProcurement.deliveryTimeFrom).format();
				initialValues.deliveryTimeTo = moment(selectedProcurement.deliveryTimeTo).format();
			}
		}

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
				<DialogTitle onClose={onCloseDialog}>{type === 'create' ? 'Создание заказа' : 'Редактирование заказа'}</DialogTitle>
				<Formik
					initialValues={initialValues}
					validationSchema={procurementSchema()}
					validateOnBlur={false}
					validateOnChange={false}
					onSubmit={(values, actions) => this.onSubmit(values, actions)}
				>
					{props => (
						<FormProcurementExpectedCreateEdit
							onCloseDialog={onCloseDialog}
							dialogRef={this.dialogRef}
							shops={shops}
							positions={positions}
							type={type}
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
		positions.data = positions.data.filter(position => !position.isArchived).map(position => procurementPositionTransform(position));
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
		editProcurementExpected: (procurementId, procurement) =>
			dispatch(editProcurementExpected({ params: { procurementId }, data: { procurement } })),
		enqueueSnackbar: (...args) => dispatch(enqueueSnackbar(...args)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ProcurementExpectedCreateEdit);
