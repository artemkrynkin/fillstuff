import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Formik } from 'formik';

import { UnitCostDelivery } from 'shared/checkPositionAndReceipt';
import { sleep } from 'shared/utils';

import { observeActions, PDDialog, PDDialogTitle } from 'src/components/Dialog';

import { getStockStatus } from 'src/actions/stocks';
import { createProcurement } from 'src/actions/procurements';

import FormProcurementCreate from './FormProcurementCreate';
import procurementSchema from './procurementSchema';

import styles from './index.module.css';

const receiptInitialValues = (position, remainingValues) => ({
	position,
	quantity: '',
	quantityPackages: '',
	quantityInUnit: '',
	purchasePrice: '',
	sellingPrice: '',
	unitSellingPrice: '',
	costDelivery: '',
	unitCostDelivery: '',
	...remainingValues,
});

class ProcurementCreate extends Component {
	static propTypes = {
		type: PropTypes.oneOf(['create']).isRequired,
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		onExitedDialog: PropTypes.func,
		currentStock: PropTypes.object.isRequired,
	};

	initialState = {
		formEditable: true,
	};

	state = this.initialState;

	onHandleEditFormProcurement = value => this.setState({ formEditable: value });

	onSubmit = (values, actions) => {
		const { onCloseDialog } = this.props;
		const { formEditable } = this.state;
		const procurement = procurementSchema.cast(values);

		if (formEditable) {
			const indicators = UnitCostDelivery.indicators(procurement.receipts);

			if (
				procurement.totalPrice !== indicators.pricePositions &&
				procurement.totalPrice - procurement.costDelivery !== indicators.pricePositions
			) {
				actions.setFieldError(
					'pricePositions',
					<span>
						Стоимость внесённых позиций не соответствует стоимости закупки.
						<br />
						Проверьте правильность внесённых данных.
					</span>
				);
				actions.setSubmitting(false);

				return;
			}

			actions.setFieldValue('pricePositions', indicators.pricePositions);

			// Если есть позиции для продажи и стоимость доставки компенсируется за счет позиций для продажи
			if (indicators.selling.positionsCount && !procurement.notCompensateCostDelivery) {
				procurement.receipts.forEach(receipt => {
					if (!receipt.position.isFree && receipt.purchasePrice) {
						if (!indicators.selling.unitsZeroPositionsCount) {
							const params = {
								unitPurchasePrice: receipt.purchasePrice,
								pricePositionsSelling: indicators.pricePositionsSelling,
								costDelivery: procurement.costDelivery,
							};

							receipt.costDelivery = UnitCostDelivery.calc.paid(params);
						} else {
							const params = {
								unitPurchasePrice: receipt.purchasePrice,
								pricePositionsSelling: indicators.pricePositionsSelling,
								costDelivery: procurement.costDelivery,
								unitsPositionsCount: indicators.selling.unitsPositionsCount,
								unitsPaidPositionsCount: indicators.selling.unitsPaidPositionsCount,
							};

							receipt.costDelivery = UnitCostDelivery.calc.mixed.paid(params);
						}

						receipt.unitCostDelivery =
							receipt.position.unitReceipt === 'nmp' && receipt.position.unitIssue === 'pce'
								? Number((receipt.costDelivery / receipt.quantityInUnit).toFixed(2))
								: receipt.costDelivery;
					}

					if (receipt.position.isFree) {
						receipt.costDelivery = 0;
						receipt.unitCostDelivery = 0;
					}
				});

				// Считаем стоимость доставки позиций с нулевой ценой покупки, если они есть
				if (indicators.selling.unitsZeroPositionsCount) {
					const costDeliveryPaidPositions = procurement.receipts
						.filter(receipt => !receipt.position.isFree && receipt.purchasePrice)
						.map(receipt => ({
							costDelivery: receipt.costDelivery,
							quantity: receipt.quantityInUnit ? receipt.quantityPackages : receipt.quantity,
						}));

					procurement.receipts.forEach(receipt => {
						if (!receipt.position.isFree && !receipt.purchasePrice) {
							if (indicators.selling.unitsPaidPositionsCount) {
								const params = {
									costDelivery: procurement.costDelivery,
									costDeliveryPaidPositions: costDeliveryPaidPositions,
									unitsZeroPositionsCount: indicators.selling.unitsZeroPositionsCount,
								};

								receipt.costDelivery = UnitCostDelivery.calc.mixed.zero(params);
							} else {
								const params = {
									costDelivery: procurement.costDelivery,
									unitsPositionsCount: indicators.selling.unitsPositionsCount,
								};

								receipt.costDelivery = UnitCostDelivery.calc.zeroTotalPrice(params);
							}

							receipt.unitCostDelivery =
								receipt.position.unitReceipt === 'nmp' && receipt.position.unitIssue === 'pce'
									? Number((receipt.costDelivery / receipt.quantityInUnit).toFixed(2))
									: receipt.costDelivery;
						}
					});
				}
			} else {
				procurement.receipts.forEach(receipt => {
					receipt.costDelivery = 0;
					receipt.unitCostDelivery = 0;
				});
			}

			actions.setFieldValue('receipts', procurement.receipts);

			this.setState({ formEditable: false });

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

	onEnterDialog = element => {
		observeActions(element, styles.addPositionContainer, 'top', 'AddPositionContainer');
	};

	onExitedDialog = () => {
		const { onExitedDialog } = this.props;

		this.setState(this.initialState, () => {
			if (onExitedDialog) onExitedDialog();
		});
	};

	render() {
		const { dialogOpen, onCloseDialog, currentStock, positions } = this.props;
		const { formEditable } = this.state;

		const initialValues = {
			number: '',
			date: null,
			costDelivery: '',
			pricePositions: 0,
			totalPrice: '',
			notCompensateCostDelivery: currentStock.settings.procurements.notCompensateCostDelivery,
			receipts: [],
		};

		return (
			<PDDialog
				open={dialogOpen}
				onEnter={this.onEnterDialog}
				onClose={onCloseDialog}
				onExited={this.onExitedDialog}
				maxWidth="xl"
				scroll="body"
				stickyAnyone
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
							currentStock={currentStock}
							receiptInitialValues={receiptInitialValues}
							onHandleEditFormProcurement={this.onHandleEditFormProcurement}
							positions={positions}
							formEditable={formEditable}
							formikProps={props}
						/>
					)}
				</Formik>
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
				extraCharge: position.extraCharge,
				label:
					position.name +
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
	const { currentStock } = ownProps;

	return {
		getStockStatus: () => dispatch(getStockStatus(currentStock._id)),
		createProcurement: procurement => dispatch(createProcurement(currentStock._id, procurement)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ProcurementCreate);
