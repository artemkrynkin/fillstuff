import React from 'react';
import { Field } from 'formik';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';

import NumberFormat, { moneyInputFormatProps } from 'src/components/NumberFormat';

const styles = () => ({
	costDeliveryFieldGrid: {
		width: 157,
	},
});

function CostDelivery({ classes, formikProps: { isSubmitting, touched, errors } }) {
	return (
		<Grid className={classes.costDeliveryFieldGrid} item>
			<Field
				name="costDelivery"
				placeholder="0"
				as={TextField}
				error={touched.costDelivery && Boolean(errors.costDelivery)}
				helperText={touched.costDelivery && errors.costDelivery}
				InputProps={{
					endAdornment: <InputAdornment position="end">₽</InputAdornment>,
					inputComponent: NumberFormat,
					inputProps: {
						...moneyInputFormatProps,
						maxLength: 7,
					},
				}}
				disabled={isSubmitting}
			/>
		</Grid>
	);
}

export default withStyles(styles)(CostDelivery);
