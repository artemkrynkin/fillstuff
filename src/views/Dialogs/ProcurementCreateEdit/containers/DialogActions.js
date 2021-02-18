import React, { useEffect, useState } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import MuiDialogActions from '@material-ui/core/DialogActions';

import colorTheme from 'shared/colorTheme';

import ButtonLoader from 'src/components/ButtonLoader';

const styles = () => ({
	dialogActions: {
		backgroundColor: `${colorTheme.brightness['4']} !important`,
		zIndex: 2,
	},
});

function DialogActions({
	classes,
	onCloseDialog,
	steps,
	activeStep,
	setActiveStep,
	formikProps,
	formikProps: { isSubmitting, values, validateField, isValid, setErrors, validateForm, handleSubmit },
}) {
	const [buttonNextBlocked, setButtonNextBlocked] = useState(false);

	const handleNext = ({ values, setFieldTouched }) => {
		if (activeStep === 1) {
			setFieldTouched('shop', true, true);

			if (steps.options.status === 'received') {
				setFieldTouched('invoiceNumber', true, true);
				setFieldTouched('invoiceDate', true, true);
				setFieldTouched('pricePositions', true, true);
				setFieldTouched('costDelivery', true, true);
				setFieldTouched('receipts', true, true);

				values.receipts.forEach((receipt, index) => {
					setFieldTouched(`receipts.${index}.quantity`, true, true);
					setFieldTouched(`receipts.${index}.quantityPackages`, true, true);
					setFieldTouched(`receipts.${index}.quantityInUnit`, true, true);
					setFieldTouched(`receipts.${index}.purchasePrice`, true, true);
				});
			} else {
			}
		}

		// setActiveStep(prevActiveStep => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep(prevActiveStep => prevActiveStep - 1);
	};

	useEffect(() => {
		setButtonNextBlocked(!isValid);
	}, [isValid]);

	return (
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
						<Button onClick={handleBack} variant="outlined" size="large">
							Назад
						</Button>
					) : null}
					{activeStep + 1 !== steps.length ? (
						<Button
							onClick={() => handleNext(formikProps)}
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
		</MuiDialogActions>
	);
}

export default withStyles(styles)(DialogActions);
