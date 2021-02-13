import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';

import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';

import colorTheme from 'shared/colorTheme';

import ButtonLoader from 'src/components/ButtonLoader';
import StepIcon from 'src/components/StepIcon';
import StepConnector from 'src/components/StepConnector';

import { getSteps } from '../helpers/utils';
import procurementSchema from '../helpers/procurementSchema';
import ProcurementOption from './ProcurementOption';
import ProcurementData from './ProcurementData';

export const useStyles = makeStyles(theme => ({
	stepper: {
		backgroundColor: colorTheme.brightness['4'],
		padding: '15px 0',
		position: 'sticky',
		top: 0,
		zIndex: 1,
	},
	dialogActions: {
		backgroundColor: colorTheme.brightness['4'],
		zIndex: 2,
	},
}));

const initialValues = {
	status: 'received',
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

function StepsContent({ dialogRef, activeStep, setSteps, handleComplete, formikProps, formikProps: { values } }) {
	useEffect(() => {
		const stepsOptions = {
			status: values.status,
		};

		stepsOptions.sellingPositions = !!values.receipts.some(receipt => !receipt.position.isFree);

		setSteps(getSteps(stepsOptions));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [values.status, values.receipts.length]);

	switch (activeStep) {
		case 0:
			return <ProcurementOption handleComplete={handleComplete} formikProps={formikProps} />;
		case 1:
			return <ProcurementData dialogRef={dialogRef} handleComplete={handleComplete} formikProps={formikProps} />;
		default:
			return 'Unknown step';
	}
}

function ProcurementForm({ dialogRef, onCloseDialog }) {
	const classes = useStyles();
	const [activeStep, setActiveStep] = useState(1);
	const [completed, setCompleted] = useState({ 0: true });
	const [steps, setSteps] = useState(getSteps({ status: 'received' }));

	const handleNext = () => {
		setActiveStep(prevActiveStep => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep(prevActiveStep => prevActiveStep - 1);
	};

	const handleComplete = () => {
		const newCompleted = completed;
		newCompleted[activeStep] = true;
		setCompleted(newCompleted);
	};

	const onSubmit = (values, actions) => {};

	return (
		<>
			<div className="sentinel-topStepper" />
			<Stepper className={classes.stepper} activeStep={activeStep} connector={<StepConnector />} alternativeLabel>
				{steps.map(step => (
					<Step key={step.index} completed={completed[step.index]}>
						<StepLabel StepIconComponent={StepIcon}>{step.label}</StepLabel>
					</Step>
				))}
			</Stepper>
			<Formik
				initialValues={initialValues}
				validationSchema={procurementSchema()}
				validateOnBlur={false}
				validateOnChange={false}
				onSubmit={onSubmit}
			>
				{formikProps => {
					const { handleSubmit, values, isSubmitting } = formikProps;

					return (
						<Form>
							<StepsContent
								dialogRef={dialogRef}
								activeStep={activeStep}
								setSteps={setSteps}
								handleComplete={handleComplete}
								formikProps={formikProps}
							/>
							<DialogActions className={classes.dialogActions}>
								<Grid justify="space-between" container>
									<Grid item>
										{activeStep === 0 ? (
											<Button onClick={onCloseDialog} variant="outlined" size="large">
												Отмена
											</Button>
										) : null}
									</Grid>
									<Grid item>
										{activeStep > 0 ? (
											<Button onClick={handleBack} variant="outlined" size="large">
												Назад
											</Button>
										) : null}
										{activeStep + 1 !== steps.length ? (
											<Button
												onClick={handleNext}
												disabled={isSubmitting || !values.status}
												variant="contained"
												color="primary"
												size="large"
												style={{ marginLeft: 16 }}
											>
												Продолжить
											</Button>
										) : (
											<>
												<ButtonLoader
													onClick={handleSubmit}
													disabled={isSubmitting}
													loader={isSubmitting}
													variant="contained"
													color="primary"
													size="large"
													style={{ marginLeft: 16 }}
												>
													Создать закупку
												</ButtonLoader>
											</>
										)}
									</Grid>
								</Grid>
							</DialogActions>
						</Form>
					);
				}}
			</Formik>
		</>
	);
}

export default ProcurementForm;
