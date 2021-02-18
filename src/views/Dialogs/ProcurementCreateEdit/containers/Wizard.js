import React, { cloneElement, useState } from 'react';
import { Formik, Form } from 'formik';

import { withStyles } from '@material-ui/core/styles';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import colorTheme from 'shared/colorTheme';

import ButtonLoader from 'src/components/ButtonLoader';

const styles = () => ({
	dialogActions: {
		backgroundColor: `${colorTheme.brightness['4']} !important`,
		zIndex: 2,
	},
});

function Wizard({ classes, children, onCloseDialog, activeStep, setActiveStep, completed, setCompleted, initialValues, onSubmit }) {
	const steps = React.Children.toArray(children);
	const [snapshot, setSnapshot] = useState(initialValues);

	const step = steps[activeStep];
	const totalSteps = steps.length;
	const isLastStep = activeStep === totalSteps - 1;

	const handleComplete = () => {
		const newCompleted = completed;
		newCompleted[activeStep] = true;
		setCompleted(newCompleted);
	};

	const handleNext = values => {
		setSnapshot(values);
		setActiveStep(Math.min(activeStep + 1, totalSteps - 1));
	};

	const handlePrev = values => {
		setSnapshot(values);
		setActiveStep(Math.max(activeStep - 1, 0));
	};

	const handleSubmit = async (values, actions) => {
		if (step.props.onSubmit) {
			await step.props.onSubmit(values, actions);
		}
		if (isLastStep) {
			return onSubmit(values, actions);
		} else {
			actions.setTouched({});
			handleComplete();
			handleNext(values);
		}
	};

	return (
		<Formik
			initialValues={snapshot}
			validationSchema={step.props.validationSchema}
			validateOnBlur={false}
			validateOnChange={false}
			onSubmit={handleSubmit}
		>
			{formikProps => {
				const { values, handleSubmit, isSubmitting } = formikProps;

				return (
					<Form>
						{React.cloneElement(step, { formikProps })}
						<MuiDialogActions className={classes.dialogActions}>
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
						</MuiDialogActions>
					</Form>
				);
			}}
		</Formik>
	);
}

export default withStyles(styles)(Wizard);
