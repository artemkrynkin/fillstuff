import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Formik } from 'formik';

import { UnitCostDelivery, receiptCalc } from 'shared/checkPositionAndReceipt';
import { sleep, formatNumber } from 'shared/utils';

import { DialogStickyFR, DialogTitle } from 'src/components/Dialog';

import { procurementPositionTransform } from 'src/helpers/utils';

import { getStudioStore } from 'src/actions/studios';
import { getShops } from 'src/actions/shops';
import { getPositions } from 'src/actions/positions';
import { createProcurementReceived } from 'src/actions/procurements';
import { enqueueSnackbar } from 'src/actions/snackbars';

import ProcurementForm from './ProcurementForm';
import procurementSchema from './procurementSchema';

import styles from './index.module.css';

const receiptInitialValues = ({ position, quantity }) => ({
	position,
	quantity: position.unitReceipt === 'pce' || position.unitRelease === 'nmp' ? quantity || '' : '',
	quantityPackages: position.unitReceipt === 'pce' || position.unitRelease === 'nmp' ? '' : quantity || '',
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
});

class ProcurementReceivedCreate extends Component {
	static propTypes = {
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		onExitedDialog: PropTypes.func,
		currentStudio: PropTypes.object.isRequired,
		selectedProcurement: PropTypes.object,
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

		if (formEditable) {
			const procurement = procurementSchema().cast(values);

			const indicators = UnitCostDelivery.indicators(procurement.receipts);

			await sleep(500);

			if (procurement.pricePositions !== indicators.pricePositions) {
				actions.setErrors({
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

			actions.setFieldValue('totalPrice', indicators.pricePositions);

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
			const procurement = procurementSchema(true).cast(values);

			procurement.totalPrice = formatNumber(procurement.pricePositions + procurement.costDelivery);

			procurement.positions = [];

			procurement.receipts = procurement.receipts.map(receipt => {
				const { position, quantity, quantityPackages, ...remainingValues } = receipt;

				const newReceipt = {
					...remainingValues,
					position: position._id,
					initial: {},
				};

				if (!isNaN(quantity)) newReceipt.initial.quantity = quantity;
				if (!isNaN(quantityPackages)) newReceipt.initial.quantityPackages = quantityPackages;

				procurement.positions.push(position._id);

				return newReceipt;
			});

			await this.props.createProcurementReceived(procurement).then(response => {
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
		this.props.getShops();
		this.props.getPositions();
	};

	onExitedDialog = () => {
		const { onExitedDialog } = this.props;

		this.setState(this.initialState, () => {
			if (onExitedDialog) onExitedDialog();
		});
	};

	render() {
		const { dialogOpen, onCloseDialog, currentStudio, shops, positions, selectedProcurement } = this.props;
		const { formEditable } = this.state;

		let initialValues = {
			shop: '',
			noInvoice: false,
			invoiceNumber: '',
			invoiceDate: undefined,
			costDelivery: '',
			pricePositions: '',
			totalPrice: '',
			compensateCostDelivery: true,
			receipts: [],
			positions: [],
		};

		if (currentStudio?.settings?.procurements?.compensateCostDelivery) {
			initialValues.compensateCostDelivery = currentStudio.settings.procurements.compensateCostDelivery;
		}

		if (selectedProcurement) {
			const { orderedReceiptsPositions, ...selectedProcurementRemainingParams } = selectedProcurement;

			initialValues = {
				...initialValues,
				...selectedProcurementRemainingParams,
				receipts: orderedReceiptsPositions.map(({ position, quantity }) =>
					receiptInitialValues({
						position,
						quantity,
					})
				),
				positions: [],
			};
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
				<DialogTitle onClose={onCloseDialog} theme="white">
					Создание закупки
				</DialogTitle>
				<Formik
					initialValues={initialValues}
					validationSchema={procurementSchema()}
					validateOnBlur={!formEditable}
					validateOnChange={false}
					onSubmit={(values, actions) => this.onSubmit(values, actions)}
				>
					{formikProps => (
						<ProcurementForm
							dialogRef={this.dialogRef}
							receiptInitialValues={receiptInitialValues}
							onHandleEditFormProcurement={this.onHandleEditFormProcurement}
							shops={shops}
							positions={positions}
							formEditable={formEditable}
							formikProps={formikProps}
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
		positions.data = positions.data
			.filter(position => !position.isArchived && !position.archivedAfterEnded)
			.map(position => procurementPositionTransform(position, true));
	}

	return {
		shops: state.shops,
		positions: positions,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getStudioStore: () => dispatch(getStudioStore()),
		getShops: () => dispatch(getShops()),
		getPositions: () => dispatch(getPositions({ showRequest: false })),
		createProcurementReceived: procurement => dispatch(createProcurementReceived({ data: { procurement } })),
		enqueueSnackbar: (...args) => dispatch(enqueueSnackbar(...args)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ProcurementReceivedCreate);
