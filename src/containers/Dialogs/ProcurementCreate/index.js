import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import loadable from '@loadable/component';

import { Formik } from 'formik';

import { UnitCostDeliveryCalc } from 'shared/checkPositionAndReceipt';
import { sleep } from 'shared/utils';

import { PDDialog, PDDialogTitle } from 'src/components/Dialog';

import { getStockStatus } from 'src/actions/stocks';
import { getCharacteristics } from 'src/actions/characteristics';
import { createProcurement } from 'src/actions/procurements';

import FormProcurementCreate from './FormProcurementCreate';
import procurementSchema from './procurementSchema';

const DialogPositionCreate = loadable(() =>
	import('src/containers/Dialogs/PositionCreateEdit' /* webpackChunkName: "Dialog_PositionCreateEdit" */)
);

const receiptInitialValues = position => ({
	position,
	quantity: '',
	quantityPackages: '',
	quantityInUnit: '',
	purchasePrice: '',
	sellingPrice: '',
	unitSellingPrice: '',
	costDelivery: '',
	unitCostDelivery: '',
});

const initialValues = {
	number: '',
	costDelivery: '',
	purchasePricePositions: 0,
	totalPurchasePrice: 0,
	divideCostDeliverySellingPositions: false,
	receipts: [],
	comment: '',
};

class ProcurementCreate extends Component {
	static propTypes = {
		type: PropTypes.oneOf(['create']).isRequired,
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		onExitedDialog: PropTypes.func,
		currentStockId: PropTypes.string.isRequired,
	};

	initialState = {
		dialogPositionCreate: false,
		formEditable: true,
		formRecounted: true,
	};

	state = this.initialState;

	onOpenDialogPositionCreate = async () => {
		await this.props.getCharacteristics();

		this.setState({ dialogPositionCreate: true });
	};

	onCloseDialogPositionCreate = () => this.setState({ dialogPositionCreate: false });

	onHandleEditFormProcurement = value => this.setState({ formEditable: value });

	onFormRecounted = value => this.setState({ formRecounted: value });

	onSubmit = (values, actions) => {
		const { onCloseDialog, procurement = procurementSchema.cast(values) } = this.props;
		const { formEditable, formRecounted } = this.state;

		if (formEditable && !formRecounted) {
			let totalPurchaseCost = 0;
			let totalPurchaseCostSellingPositions = 0;
			let numberAllPositions = 0;
			let numberPaidPositions = 0;
			let numberZeroPositions = 0;

			procurement.receipts.forEach(receipt => {
				const quantityPackagesOrQuantity = receipt.quantityPackages ? receipt.quantityPackages : receipt.quantity;

				totalPurchaseCost += quantityPackagesOrQuantity * receipt.purchasePrice;
				if (!receipt.position.isFree) totalPurchaseCostSellingPositions += quantityPackagesOrQuantity * receipt.purchasePrice;
				numberAllPositions += quantityPackagesOrQuantity;

				if (receipt.purchasePrice) numberPaidPositions += quantityPackagesOrQuantity;
				else numberZeroPositions += quantityPackagesOrQuantity;
			});

			if (totalPurchaseCost) {
				procurement.receipts.forEach(receipt => {
					if (receipt.purchasePrice) {
						if (numberZeroPositions && !procurement.divideCostDeliverySellingPositions) {
							receipt.costDelivery = UnitCostDeliveryCalc.mixed.paid(
								receipt.purchasePrice,
								totalPurchaseCost,
								procurement.costDelivery,
								numberAllPositions,
								numberPaidPositions
							);
						} else {
							receipt.costDelivery = !procurement.divideCostDeliverySellingPositions
								? UnitCostDeliveryCalc.paid(receipt.purchasePrice, totalPurchaseCost, procurement.costDelivery)
								: !receipt.position.isFree
								? UnitCostDeliveryCalc.selling(receipt.purchasePrice, totalPurchaseCostSellingPositions, procurement.costDelivery)
								: 0;
						}

						receipt.unitCostDelivery =
							receipt.position.unitReceipt === 'nmp' && receipt.position.unitIssue === 'pce'
								? Number((receipt.costDelivery / receipt.quantityInUnit).toFixed(2))
								: receipt.costDelivery;
					}
				});

				if (!procurement.divideCostDeliverySellingPositions) {
					const paidPositions = procurement.receipts
						.filter(receipt => receipt.purchasePrice)
						.map(receipt => ({
							costDelivery: receipt.costDelivery,
							quantity: receipt.quantityPackages ? receipt.quantityPackages : receipt.quantity,
						}));

					procurement.receipts.forEach(receipt => {
						if (!receipt.purchasePrice) {
							receipt.costDelivery = UnitCostDeliveryCalc.mixed.zero(procurement.costDelivery, paidPositions, numberZeroPositions);

							receipt.unitCostDelivery =
								receipt.position.unitReceipt === 'nmp' && receipt.position.unitIssue === 'pce'
									? Number((receipt.costDelivery / receipt.quantityInUnit).toFixed(2))
									: receipt.costDelivery;
						}
					});
				}
			} else {
				procurement.receipts.forEach(receipt => {
					receipt.costDelivery = UnitCostDeliveryCalc.zeroTotalPrice(procurement.costDelivery, numberAllPositions);

					receipt.unitCostDelivery =
						receipt.position.unitReceipt === 'nmp' && receipt.position.unitIssue === 'pce'
							? Number((receipt.costDelivery / receipt.quantityInUnit).toFixed(2))
							: receipt.costDelivery;
				});
			}

			let purchasePricePositions = 0;
			let totalPurchasePrice = 0;

			procurement.receipts.forEach(receipt => {
				purchasePricePositions += (receipt.quantityPackages ? receipt.quantityPackages : receipt.quantity) * receipt.purchasePrice;
			});

			totalPurchasePrice += purchasePricePositions + procurement.costDelivery;

			actions.setFieldValue('purchasePricePositions', purchasePricePositions);
			actions.setFieldValue('totalPurchasePrice', totalPurchasePrice);

			actions.setFieldValue('receipts', procurement.receipts);

			this.setState({
				formEditable: false,
				formRecounted: true,
			});

			actions.setSubmitting(false);
		} else {
			procurement.receipts = procurement.receipts.map(receiptValues => {
				const {
					position,
					quantity,
					quantityPackages,
					quantityInUnit,
					purchasePrice,
					sellingPrice,
					unitSellingPrice,
					costDelivery,
					unitCostDelivery,
				} = receiptValues;

				let receipt = {
					position: position._id,
					initial: {},
				};

				if (!isNaN(quantity)) receipt.initial.quantity = quantity;
				if (!isNaN(quantityPackages)) receipt.initial.quantityPackages = quantityPackages;
				if (!isNaN(quantityInUnit)) receipt.quantityInUnit = quantityInUnit;
				if (!isNaN(purchasePrice)) receipt.purchasePrice = purchasePrice;
				if (!isNaN(sellingPrice)) receipt.sellingPrice = sellingPrice;
				if (!isNaN(unitSellingPrice)) receipt.unitSellingPrice = unitSellingPrice;
				if (!isNaN(costDelivery)) receipt.costDelivery = costDelivery;
				if (!isNaN(unitCostDelivery)) receipt.unitCostDelivery = unitCostDelivery;

				return receipt;
			});

			this.props.createProcurement(procurement).then(response => {
				if (response.status === 'success') {
					this.props.getStockStatus();
					onCloseDialog();
				} else actions.setSubmitting(false);
			});
		}
	};

	onExitedDialog = () => {
		const { onExitedDialog } = this.props;

		this.setState(this.initialState, () => {
			if (onExitedDialog) onExitedDialog();
		});
	};

	render() {
		const { dialogOpen, onCloseDialog, currentStockId, positions } = this.props;
		const { dialogPositionCreate, formEditable, formRecounted } = this.state;

		return (
			<PDDialog
				open={dialogOpen}
				onEnter={this.onEnterDialog}
				onClose={onCloseDialog}
				onExited={this.onExitedDialog}
				maxWidth="xl"
				scroll="body"
				stickyActions
			>
				<PDDialogTitle theme="primary" onClose={onCloseDialog}>
					Создание новой закупки
				</PDDialogTitle>
				<Formik
					initialValues={initialValues}
					validationSchema={procurementSchema}
					validateOnBlur={false}
					validateOnChange={false}
					onSubmit={async (values, actions) => {
						await sleep(500);
						this.onSubmit(values, actions);
					}}
				>
					{props => (
						<FormProcurementCreate
							onOpenDialogPositionCreate={this.onOpenDialogPositionCreate}
							receiptInitialValues={receiptInitialValues}
							onHandleEditFormProcurement={this.onHandleEditFormProcurement}
							onFormRecounted={this.onFormRecounted}
							positions={positions}
							formEditable={formEditable}
							formRecounted={formRecounted}
							formikProps={props}
						/>
					)}
				</Formik>

				<DialogPositionCreate
					type="create"
					dialogOpen={dialogPositionCreate}
					onCloseDialog={this.onCloseDialogPositionCreate}
					currentStockId={currentStockId}
				/>
			</PDDialog>
		);
	}
}

const mapStateToProps = state => {
	let positions = { ...state.positions };

	if (positions.data && positions.data.length > 0) {
		positions.data = positions.data.map(position => {
			return {
				_id: position._id,
				unitIssue: position.unitIssue,
				unitReceipt: position.unitReceipt,
				isFree: position.isFree,
				label:
					position.name +
					' ' +
					position.characteristics.reduce((fullCharacteristics, characteristic) => `${fullCharacteristics} ${characteristic.label}`, ''),
				value: position._id,
			};
		});
	}

	return {
		positions: positions,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStockId } = ownProps;

	return {
		getStockStatus: () => dispatch(getStockStatus(currentStockId)),
		getCharacteristics: () => dispatch(getCharacteristics(currentStockId)),
		createProcurement: procurement => dispatch(createProcurement(currentStockId, procurement)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ProcurementCreate);
