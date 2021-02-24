import React, { cloneElement, useState } from 'react';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

import colorTheme from 'shared/colorTheme';
import { formatNumber, sleep } from 'shared/utils';
import { receiptCalc, UnitCostDelivery } from 'shared/checkPositionAndReceipt';

import StepIcon from 'src/components/StepIcon';
import StepConnector from 'src/components/StepConnector';

import { createProcurementReceived } from 'src/actions/procurements';
import { enqueueSnackbar } from 'src/actions/snackbars';

import { getSteps, scrollToDialogElement } from '../helpers/utils';
import procurementSchema, { procurementReceivedSchema } from '../helpers/procurementSchema';
import Wizard from './Wizard';
import ProcurementOption from './ProcurementOption';
import ProcurementData from './ProcurementData';
import PriceFormation from './PriceFormation';

export const useStyles = makeStyles(() => ({
	stepper: {
		backgroundColor: colorTheme.brightness['4'],
		padding: '15px 0',
		position: 'sticky',
		top: 0,
		zIndex: 1,
	},
}));

const initialValues = {
	status: '',
	shop: null,
	isConfirmed: false,
	isUnknownDeliveryDate: false,
	deliveryDate: undefined,
	deliveryTimeFrom: '',
	deliveryTimeTo: '',
	noInvoice: false,
	invoiceNumber: '',
	invoiceDate: undefined,
	pricePositions: '',
	costDelivery: '',
	totalPrice: '',
	compensateCostDelivery: true,
	orderedReceiptsPositions: [],
	positions: [],
	receipts: [],
	comment: '',
};

const WizardStep = ({ children, formikProps }) => cloneElement(children, { formikProps });

function ProcurementForm({ dialogRef, onCloseFuseDialog, onCloseDialog, setDirtyForm, ...props }) {
	const classes = useStyles();
	const [activeStep, setActiveStep] = useState(0);
	const [completed, setCompleted] = useState({});
	const [steps, setSteps] = useState(getSteps({ status: 'received' }));

	const onUpdateSteps = options => setSteps(prevSteps => getSteps({ ...prevSteps.options, ...options }));

	const sendForm = async (values, actions, additionValues) => {
		try {
			if (steps.options.status === 'received') {
				const procurement = procurementReceivedSchema.cast(additionValues || values);

				procurement.positions = [];

				procurement.receipts = procurement.receipts.map(({ position, quantity, quantityPackages, ...remainingValues }) => {
					const newReceipt = {
						...remainingValues,
						position,
						initial: quantity ? { quantity } : { quantityPackages },
					};

					procurement.positions.push(position);

					return newReceipt;
				});

				await props.createProcurementReceived({ data: { procurement } }).then(response => {
					if (response.status === 'success') onCloseDialog();
					else throw new Error(response);
				});
			} else {
			}
		} catch (error) {
			props.enqueueSnackbar({
				message: error.message || 'Неизвестная ошибка.',
				options: {
					variant: 'error',
				},
			});
		}
	};

	const checkStepOption = (values, actions) => {};

	const checkStepDataReceived = async (values, actions) => {
		const procurement = procurementSchema.data.received.cast(values);

		const indicators = UnitCostDelivery.indicators(procurement.receipts);

		if (procurement.pricePositions !== indicators.pricePositions) {
			actions.setErrors({
				pricePositions: <>Проверьте правильность внесённых данных</>,
				receipts: procurement.receipts.map(receipt => ({
					[receipt.position.unitReceipt === 'nmp' && receipt.position.unitRelease === 'pce' ? 'quantityPackages' : 'quantity']: true,
					purchasePrice: true,
				})),
			});

			scrollToDialogElement(dialogRef, 'sentinel-topStepper', 'start');

			return false;
		}

		await sleep(500);

		// Если есть платные позиции и стоимость доставки компенсируется за счет платных позиций
		if (indicators.selling.positionsCount && procurement.compensateCostDelivery) {
			procurement.receipts.forEach(receipt => {
				// Если позиция платная и цена покупки не равна 0
				if (!receipt.position.isFree && receipt.purchasePrice) {
					// Если количество единиц позиций для продажи с нулевой ценой покупки равно 0
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
					// Если позиция платная и цена покупки равно 0
					if (!receipt.position.isFree && !receipt.purchasePrice) {
						// Если количество единиц платных позиций для продажи не равно 0
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

		procurement.totalPrice = formatNumber(procurement.pricePositions + procurement.costDelivery);

		actions.setFieldValue('invoiceNumber', procurement.invoiceNumber);
		actions.setFieldValue('invoiceDate', procurement.invoiceDate);
		actions.setFieldValue('pricePositions', procurement.pricePositions);
		actions.setFieldValue('costDelivery', procurement.costDelivery);
		actions.setFieldValue('totalPrice', procurement.totalPrice);
		actions.setFieldValue('receipts', procurement.receipts);

		return procurement;
	};

	const checkStepDataExpected = async (values, actions) => {};

	const checkStepPriceFormation = (values, actions) => {
		const procurement = procurementSchema.priceFormation.cast(values);

		actions.setFieldValue('receipts', procurement.receipts);
	};

	return (
		<>
			<div className="sentinel-topStepper" />
			<Stepper className={classes.stepper} activeStep={activeStep} connector={<StepConnector />} alternativeLabel>
				{steps.list.map(step => (
					<Step key={step.index} completed={completed[step.index]}>
						<StepLabel StepIconComponent={StepIcon} StepIconProps={{ activeStep }}>
							{step.label}
						</StepLabel>
					</Step>
				))}
			</Stepper>
			<Wizard
				initialValues={initialValues}
				onSubmit={sendForm}
				onCloseFuseDialog={onCloseFuseDialog}
				setDirtyForm={setDirtyForm}
				activeStep={activeStep}
				setActiveStep={setActiveStep}
				completed={completed}
				setCompleted={setCompleted}
			>
				{steps.options.showOptionSelectStep && (
					<WizardStep onSubmit={checkStepOption} validationSchema={procurementSchema.option}>
						<ProcurementOption dialogRef={dialogRef} onUpdateSteps={onUpdateSteps} />
					</WizardStep>
				)}
				{steps.options.status === 'received' && (
					<WizardStep onSubmit={checkStepDataReceived} validationSchema={procurementSchema.data.received}>
						<ProcurementData dialogRef={dialogRef} onUpdateSteps={onUpdateSteps} />
					</WizardStep>
				)}
				{steps.options.status === 'expected' && (
					<WizardStep onSubmit={checkStepDataExpected} validationSchema={procurementSchema.data.expected}>
						<ProcurementData dialogRef={dialogRef} onUpdateSteps={onUpdateSteps} />
					</WizardStep>
				)}
				{steps.options.sellingPositions && (
					<WizardStep onSubmit={checkStepPriceFormation} validationSchema={procurementSchema.priceFormation}>
						<PriceFormation dialogRef={dialogRef} />
					</WizardStep>
				)}
				{/*{steps.options.status === 'expected' && (*/}
				{/*  <></>*/}
				{/*)}*/}
			</Wizard>
		</>
	);
}

const mapDispatchToProps = {
	createProcurementReceived,
	enqueueSnackbar,
};

export default connect(null, mapDispatchToProps)(ProcurementForm);
