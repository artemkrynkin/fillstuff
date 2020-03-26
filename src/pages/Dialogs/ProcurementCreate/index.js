import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Formik } from 'formik';

import { UnitCostDelivery, receiptCalc } from 'shared/checkPositionAndReceipt';
import { sleep, formatNumber } from 'shared/utils';

import { DialogStickyFR, DialogTitle } from 'src/components/Dialog';

import { getStudioStock } from 'src/actions/studio';
import { createProcurement } from 'src/actions/procurements';

import { positionTransform } from './utils';
import FormProcurementCreate from './FormProcurementCreate';
import procurementSchema from './procurementSchema';

import styles from './index.module.css';

const initialValues = {
	number: '',
	noInvoice: false,
	date: undefined,
	costDelivery: '',
	pricePositions: 0,
	totalPrice: '',
	compensateCostDelivery: true,
	receipts: [],
};

const receiptInitialValues = (position, remainingValues) => ({
	position,
	quantity: '',
	quantityPackages: '',
	quantityInUnit: '',
	purchasePrice: '',
	unitPurchasePrice: '',
	sellingPrice: '',
	unitSellingPrice: '',
	costDelivery: '',
	unitCostDelivery: '',
	markupPercent: position.lastReceipt ? position.lastReceipt.markupPercent : '',
	markup: '',
	unitMarkup: '',
	...remainingValues,
});

class ProcurementCreate extends Component {
	static propTypes = {
		type: PropTypes.oneOf(['create']).isRequired,
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		onExitedDialog: PropTypes.func,
		currentStudio: PropTypes.object.isRequired,
	};

	initialState = {
		formEditable: true,
	};

	state = this.initialState;

	dialogRef = createRef();

	onHandleEditFormProcurement = value => this.setState({ formEditable: value });

	onSubmit = async (values, actions) => {
		const { onCloseDialog } = this.props;
		const { formEditable } = this.state;
		const procurement = procurementSchema.cast(values);

		if (formEditable) {
			const indicators = UnitCostDelivery.indicators(procurement.receipts);

			await sleep(300);

			if (
				procurement.totalPrice !== indicators.pricePositions &&
				procurement.totalPrice - procurement.costDelivery !== indicators.pricePositions
			) {
				actions.setErrors({
					totalPrice: true,
					pricePositions: <span>Проверьте правильность внесённых данных в выделенных полях.</span>,
					receipts: procurement.receipts.map(receipt => ({
						[receipt.position.unitReceipt === 'nmp' && receipt.position.unitRelease === 'pce' ? 'quantityPackages' : 'quantity']: true,
						purchasePrice: true,
					})),
				});

				actions.setSubmitting(false);

				this.dialogRef.current.querySelector('.MuiDialogTitle-root').scrollIntoView({
					behavior: 'smooth',
					block: 'start',
				});

				return;
			}

			actions.setFieldValue('pricePositions', indicators.pricePositions);

			// Если есть платные позиции и стоимость доставки компенсируется за счет платных позиций
			if (indicators.selling.positionsCount && procurement.compensateCostDelivery) {
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
							receipt.position.unitReceipt === 'nmp' && receipt.position.unitRelease === 'pce'
								? formatNumber(receipt.costDelivery / receipt.quantityInUnit)
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
								receipt.position.unitReceipt === 'nmp' && receipt.position.unitRelease === 'pce'
									? formatNumber(receipt.costDelivery / receipt.quantityInUnit)
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

			// Формируем цену покупки единицы и цену продажи
			procurement.receipts.forEach(receipt => {
				receiptCalc.unitPurchasePrice(receipt, {
					unitReceipt: receipt.position.unitReceipt,
					unitRelease: receipt.position.unitRelease,
				});

				receiptCalc.sellingPrice(receipt, {
					isFree: receipt.position.isFree,
				});
			});

			actions.setFieldValue('receipts', procurement.receipts);

			this.setState({ formEditable: false });

			actions.setSubmitting(false);
		} else {
			if (procurement.totalPrice === procurement.pricePositions) {
				procurement.totalPrice = formatNumber(procurement.pricePositions + procurement.costDelivery);
			}

			procurement.receipts = procurement.receipts.map(receipt => {
				const { position, quantity, quantityPackages, ...remainingValues } = receipt;

				const newReceipt = {
					position: position._id,
					initial: {},
					...remainingValues,
				};

				if (!isNaN(quantity)) newReceipt.initial.quantity = quantity;
				if (!isNaN(quantityPackages)) newReceipt.initial.quantityPackages = quantityPackages;

				return newReceipt;
			});

			this.props.createProcurement(procurement).then(response => {
				if (response.status === 'success') {
					this.props.getStudioStock();
					actions.setSubmitting(false);
					onCloseDialog();
				}
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
		const { dialogOpen, onCloseDialog, currentStudio, positions } = this.props;
		const { formEditable } = this.state;

		if (currentStudio.settings.procurements.compensateCostDelivery) {
			initialValues.compensateCostDelivery = currentStudio.settings.procurements.compensateCostDelivery;
		}

		return (
			<DialogStickyFR
				ref={this.dialogRef}
				open={dialogOpen}
				onClose={onCloseDialog}
				onExited={this.onExitedDialog}
				maxWidth="xl"
				scroll="body"
				stickyAnyone={[
					{
						stickySelector: styles.addPositionContainer,
						position: 'top',
						sentinelAdditionalText: 'AddPositionContainer',
					},
				]}
				disableBackdropClick
				stickyActions
			>
				<DialogTitle onClose={onCloseDialog}>Создание закупки</DialogTitle>
				<Formik
					initialValues={initialValues}
					validationSchema={procurementSchema}
					validateOnBlur={!formEditable}
					validateOnChange={false}
					onSubmit={(values, actions) => this.onSubmit(values, actions)}
				>
					{props => (
						<FormProcurementCreate
							dialogRef={this.dialogRef}
							currentStudioId={currentStudio._id}
							receiptInitialValues={receiptInitialValues}
							onHandleEditFormProcurement={this.onHandleEditFormProcurement}
							positions={positions}
							formEditable={formEditable}
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
		positions: positions,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getStudioStock: () => dispatch(getStudioStock()),
		createProcurement: procurement => dispatch(createProcurement({ data: { procurement } })),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ProcurementCreate);
