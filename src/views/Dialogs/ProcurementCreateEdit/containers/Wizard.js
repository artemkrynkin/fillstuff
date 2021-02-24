import React, { cloneElement, Children, useEffect } from 'react';
import { Formik, Form } from 'formik';

import { withStyles } from '@material-ui/core/styles';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import colorTheme from 'shared/colorTheme';

import ButtonLoader from 'src/components/ButtonLoader';

const DialogActions = withStyles({
	root: {
		backgroundColor: `${colorTheme.brightness['4']} !important`,
		zIndex: 2,
	},
})(MuiDialogActions);

function Wizard({
	children,
	onCloseFuseDialog,
	setDirtyForm,
	activeStep,
	setActiveStep,
	completed,
	setCompleted,
	initialValues,
	onSubmit,
}) {
	const steps = Children.toArray(children);
	// const [snapshot, setSnapshot] = useState(initialValues);

	const step = steps[activeStep];
	const totalSteps = steps.length;
	const isLastStep = activeStep === totalSteps - 1;

	const handleComplete = () => {
		const newCompleted = completed;
		newCompleted[activeStep] = true;
		setCompleted(newCompleted);
	};

	const handleNext = values => {
		// setSnapshot(values);
		setActiveStep(Math.min(activeStep + 1, totalSteps - 1));
	};

	const handlePrev = values => {
		// setSnapshot(values);
		setActiveStep(Math.max(activeStep - 1, 0));
	};

	const handleSubmit = async (values, actions) => {
		let response;

		if (step.props.onSubmit) {
			response = await step.props.onSubmit(values, actions);

			if (response === false) return;
		}
		if (isLastStep) {
			return onSubmit(values, actions, response);
		} else {
			actions.setTouched({});
			handleComplete();
			handleNext(values);
		}
	};

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={step.props.validationSchema}
			validateOnBlur={false}
			validateOnChange={false}
			onSubmit={handleSubmit}
		>
			{formikProps => (
				<WizardContent
					onCloseFuseDialog={onCloseFuseDialog}
					activeStep={activeStep}
					step={step}
					formikProps={formikProps}
					isLastStep={isLastStep}
					handlePrev={handlePrev}
					setDirtyForm={setDirtyForm}
				/>
			)}
		</Formik>
	);
}

function WizardContent({
	onCloseFuseDialog,
	activeStep,
	step,
	isLastStep,
	handlePrev,
	formikProps,
	formikProps: { dirty, values, handleSubmit, isSubmitting },
	setDirtyForm,
}) {
	useEffect(() => {
		setDirtyForm(dirty);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dirty]);

	return (
		<Form>
			{cloneElement(step, { formikProps })}
			<DialogActions>
				<Grid justify="space-between" container>
					<Grid item>
						{activeStep === 0 ? (
							<Button onClick={onCloseFuseDialog} variant="outlined" size="large">
								Отмена
							</Button>
						) : null}
					</Grid>
					<Grid item>
						{activeStep > 0 ? (
							<Button onClick={() => handlePrev(values)} variant="outlined" size="large">
								Назад
							</Button>
						) : null}
						<ButtonLoader
							onClick={handleSubmit}
							disabled={isSubmitting}
							loader={isSubmitting}
							variant="contained"
							color="primary"
							size="large"
							style={{ marginLeft: 16 }}
						>
							{isLastStep ? 'Создать закупку' : 'Продолжить'}
						</ButtonLoader>
					</Grid>
				</Grid>
			</DialogActions>
		</Form>
	);
}

export default Wizard;
