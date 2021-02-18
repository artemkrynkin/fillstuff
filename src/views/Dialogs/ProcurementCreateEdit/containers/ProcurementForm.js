import React, { cloneElement, useEffect, useState } from 'react';
import { Formik, Form } from 'formik';

import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

import colorTheme from 'shared/colorTheme';

import StepIcon from 'src/components/StepIcon';
import StepConnector from 'src/components/StepConnector';

import { getSteps } from '../helpers/utils';
import procurementSchema from '../helpers/procurementSchema';
import Wizard from './Wizard';
import ProcurementOption from './ProcurementOption';
import ProcurementData from './ProcurementData';
import PriceFormation from './PriceFormation';

export const useStyles = makeStyles(theme => ({
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

function ProcurementForm({ dialogRef, onCloseDialog }) {
	const classes = useStyles();
	const [activeStep, setActiveStep] = useState(0);
	const [completed, setCompleted] = useState({});
	const [steps, setSteps] = useState(getSteps({ status: 'received' }));

	const onUpdateSteps = options => setSteps(prevSteps => getSteps({ ...prevSteps.options, ...options }));

	const sendForm = (values, actions) => {};

	const checkStepOption = (values, actions) => {};

	const checkStepDataReceived = (values, actions) => {};

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
				onCloseDialog={onCloseDialog}
				activeStep={activeStep}
				setActiveStep={setActiveStep}
				completed={completed}
				setCompleted={setCompleted}
			>
				{steps.options.showOptionSelectStep ? (
					<WizardStep onSubmit={checkStepOption} validationSchema={procurementSchema.option}>
						<ProcurementOption onUpdateSteps={onUpdateSteps} />
					</WizardStep>
				) : null}
				<WizardStep onSubmit={checkStepDataReceived} validationSchema={procurementSchema.dataReceived}>
					{steps.options.status === 'received' ? <ProcurementData dialogRef={dialogRef} /> : <ProcurementData dialogRef={dialogRef} />}
				</WizardStep>
				{/*{steps.options.sellingPositions ? (*/}
				{/*  <WizardStep*/}
				{/*    onSubmit={() => console.log('step3 onsubmit')}*/}
				{/*    validationSchema={procurementSchema.priceFormation}*/}
				{/*  >*/}
				{/*    <PriceFormation dialogRef={dialogRef} formikProps={formikProps} />*/}
				{/*  </WizardStep>*/}
				{/*) : null}*/}
				{/*{steps.options.status === 'expected' ? (*/}
				{/*  <></>*/}
				{/*)}*/}
			</Wizard>
			{/*<Formik*/}
			{/*	initialValues={initialValues}*/}
			{/*	// validationSchema={procurementSchema()}*/}
			{/*	validateOnBlur={false}*/}
			{/*	validateOnChange={false}*/}
			{/*	onSubmit={onSubmit}*/}
			{/*>*/}
			{/*	{formikProps => (*/}
			{/*    <Form>*/}
			{/*      <StepsContent*/}
			{/*        dialogRef={dialogRef}*/}
			{/*        activeStep={activeStep}*/}
			{/*        steps={steps}*/}
			{/*        setSteps={setSteps}*/}
			{/*        handleComplete={handleComplete}*/}
			{/*        formikProps={formikProps}*/}
			{/*      />*/}
			{/*      <DialogActions*/}
			{/*        onCloseDialog={onCloseDialog}*/}
			{/*        steps={steps}*/}
			{/*        activeStep={activeStep}*/}
			{/*        setActiveStep={setActiveStep}*/}
			{/*        formikProps={formikProps}*/}
			{/*      />*/}
			{/*    </Form>*/}
			{/*  )}*/}
			{/*</Formik>*/}
		</>
	);
}

export default ProcurementForm;
