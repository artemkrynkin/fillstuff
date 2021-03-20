import React, { cloneElement, useEffect, useLayoutEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';

import colorTheme from 'shared/colorTheme';
import { formatNumber, sleep } from 'shared/utils';
import { receiptCalc, UnitCostDelivery } from 'shared/checkPositionAndReceipt';

import { withCurrentUser } from 'src/components/withCurrentUser';
import StepIcon from 'src/components/StepIcon';
import StepConnector from 'src/components/StepConnector';

import { createProcurementExpected, editProcurementExpected, createProcurementReceived } from 'src/actions/procurements';
import { enqueueSnackbar } from 'src/actions/snackbars';

import { getSteps, scrollToDialogElement, receiptInitialValues } from '../helpers/utils';
import procurementSchema, { procurementReceivedSchema, procurementExpectedSchema } from '../helpers/procurementSchema';
import Wizard from './Wizard';
import ProcurementOption from './ProcurementOption';
import ProcurementData from './ProcurementData';
import DeliveryConfirmation from './DeliveryConfirmation';
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

const getInitialValues = (type, currentStudio, selectedProcurement) => {
	let initialValues = {
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
		compensateCostDelivery: currentStudio.settings.procurements.compensateCostDelivery || false,
		orderedReceiptsPositions: [],
		positions: [],
		receipts: [],
		comment: '',
	};

	if (selectedProcurement) {
		const { orderedReceiptsPositions, deliveryDate, ...remainingParamsSelectedProcurement } = selectedProcurement;

		initialValues = {
			...initialValues,
			...remainingParamsSelectedProcurement,
		};

		if (type === 'create') {
			if (initialValues.status) initialValues.status = 'received';

			initialValues.positions = [];
		}

		if (type === 'edit') {
			if (deliveryDate) initialValues.deliveryDate = moment(deliveryDate).format();
		}

		const initialReceipts = orderedReceiptsPositions.map(({ position, quantity }) =>
			receiptInitialValues({
				position,
				quantity,
				ordered: initialValues.status === 'expected',
			})
		);

		if (initialValues.status) {
			initialValues[type === 'create' ? 'receipts' : 'orderedReceiptsPositions'] = initialReceipts;
		} else {
			initialValues.orderedReceiptsPositions = initialReceipts;
			initialValues.receipts = initialReceipts;
		}
	}

	return initialValues;
};

const WizardStep = ({ children, formikProps }) => cloneElement(children, { formikProps });

function ProcurementForm({
	type,
	dialogRef,
	onCloseFuseDialog,
	onCloseDialog,
	currentStudio,
	setDirtyForm,
	selectedProcurement,
	...props
}) {
	const classes = useStyles();
	const [activeStep, setActiveStep] = useState(0);
	const [completed, setCompleted] = useState({});
	const [steps, setSteps] = useState(
		getSteps({
			status: getInitialValues(type, currentStudio, selectedProcurement).status || 'received',
			showOptionSelectStep: !Boolean(selectedProcurement && selectedProcurement.status),
		})
	);

	const handleComplete = step => {
		const newCompleted = completed;
		newCompleted[step || activeStep] = true;
		setCompleted(newCompleted);
	};

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

				await props.createProcurementReceived({ data: { procurement } });

				await props.enqueueSnackbar({
					message: 'Закупка успешно создана',
					options: { variant: 'success' },
				});

				onCloseDialog();
			} else {
				const procurement = procurementExpectedSchema.cast(additionValues || values);

				if (procurement.deliveryTimeFrom === '') delete procurement.deliveryTimeFrom;
				if (procurement.deliveryTimeTo === '') delete procurement.deliveryTimeTo;

				procurement.positions = procurement.orderedReceiptsPositions.map(receipt => receipt.position);

				if (type === 'create') {
					await props.createProcurementExpected({ data: { procurement } });
				} else {
					await props.editProcurementExpected({ params: { procurementId: procurement._id }, data: { procurement } });
				}

				await props.enqueueSnackbar({
					message: (
						<div>
							<Typography variant="body1" gutterBottom>
								{type === 'create'
									? 'Закупка успешно создана'
									: procurement.isConfirmed && procurement.isConfirmed !== selectedProcurement.isConfirmed
									? 'Закупка подтверждена'
									: 'Закупка успешно отредактирована'}
							</Typography>

							<Typography variant="body1">
								{procurement.isConfirmed ? (
									<>
										<b>Дата доставки</b>:{' '}
										{!procurement.isUnknownDeliveryDate ? <>{moment(procurement.deliveryDate).format('DD MMMM')}</> : <>неизвестна</>}
									</>
								) : (
									<>
										Дождитесь звонка менеджера и <b>подтвердите доставку</b>
									</>
								)}
							</Typography>
						</div>
					),
					options: { variant: 'success' },
				});

				onCloseDialog();
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

	const checkStepOption = async () => await sleep(500);

	const checkStepDataReceived = async (values, actions) => {
		const procurement = procurementSchema.data.received.cast(values);

		await sleep(500);

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

			receiptCalc.markupPercent(receipt, { isFree: receipt.position.isFree });

			receiptCalc.sellingPrice(receipt, { isFree: receipt.position.isFree });
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

	const checkStepDataExpected = async (values, actions) => {
		const procurement = procurementSchema.data.expected.cast(values);

		await sleep(500);

		actions.setFieldValue('pricePositions', procurement.pricePositions);
		actions.setFieldValue('orderedReceiptsPositions', procurement.orderedReceiptsPositions);

		return procurement;
	};

	const checkStepPriceFormation = async (values, actions) => {
		const procurement = procurementSchema.priceFormation.cast(values);

		await sleep(500);

		actions.setFieldValue('receipts', procurement.receipts);

		return procurement;
	};

	const checkStepDeliveryConfirmation = async (values, actions) => {
		const procurement = procurementSchema.deliveryConfirmation.cast(values);

		await sleep(500);

		procurement.totalPrice = formatNumber(procurement.pricePositions + Number(procurement.costDelivery || 0));

		actions.setFieldValue('costDelivery', procurement.costDelivery);
		actions.setFieldValue('totalPrice', procurement.totalPrice);

		return procurement;
	};

	useLayoutEffect(() => {
		if (dialogRef.current) scrollToDialogElement(dialogRef, 'sentinel-topStepper', 'start');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeStep]);

	useEffect(() => {
		if (type === 'confirm') {
			handleComplete(0);
			setActiveStep(1);
		}

		if (type === 'edit') {
			handleComplete(0);

			if (selectedProcurement.isConfirmed) {
				handleComplete(1);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<div className="sentinel-topStepper" />
			<Stepper className={classes.stepper} activeStep={activeStep} connector={<StepConnector />} alternativeLabel>
				{steps.list.map((step, index) => (
					<Step key={index} completed={completed[index]}>
						<StepLabel StepIconComponent={StepIcon} StepIconProps={{ activeStep }}>
							{step.label}
						</StepLabel>
					</Step>
				))}
			</Stepper>
			<Wizard
				type={type}
				initialValues={getInitialValues(type, currentStudio, selectedProcurement)}
				onSubmit={sendForm}
				onCloseFuseDialog={onCloseFuseDialog}
				setDirtyForm={setDirtyForm}
				handleComplete={handleComplete}
				activeStep={activeStep}
				setActiveStep={setActiveStep}
			>
				{steps.options.showOptionSelectStep ? (
					<WizardStep onSubmit={checkStepOption} validationSchema={procurementSchema.option}>
						<ProcurementOption steps={steps} onUpdateSteps={onUpdateSteps} />
					</WizardStep>
				) : null}
				{steps.options.status === 'expected' ? (
					<WizardStep onSubmit={checkStepDataExpected} validationSchema={procurementSchema.data.expected}>
						<ProcurementData dialogRef={dialogRef} onUpdateSteps={onUpdateSteps} />
					</WizardStep>
				) : null}
				{steps.options.status === 'expected' ? (
					<WizardStep onSubmit={checkStepDeliveryConfirmation} validationSchema={procurementSchema.deliveryConfirmation}>
						<DeliveryConfirmation />
					</WizardStep>
				) : null}
				{steps.options.status === 'received' ? (
					<WizardStep onSubmit={checkStepDataReceived} validationSchema={procurementSchema.data.received}>
						<ProcurementData dialogRef={dialogRef} onUpdateSteps={onUpdateSteps} />
					</WizardStep>
				) : null}
				{steps.options.sellingPositions ? (
					<WizardStep onSubmit={checkStepPriceFormation} validationSchema={procurementSchema.priceFormation}>
						<PriceFormation dialogRef={dialogRef} />
					</WizardStep>
				) : null}
			</Wizard>
		</>
	);
}

const mapDispatchToProps = {
	createProcurementExpected,
	editProcurementExpected,
	createProcurementReceived,
	enqueueSnackbar,
};

export default compose(connect(null, mapDispatchToProps), withCurrentUser)(ProcurementForm);
