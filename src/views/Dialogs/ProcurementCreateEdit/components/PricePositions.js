import React from 'react';
import { Field } from 'formik';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';

import NumberFormat, { moneyInputFormatProps } from 'src/components/NumberFormat';

const styles = () => ({
	pricePositionsFieldGrid: {
		width: 157,
	},
});

function PricePositions({ classes, formikProps: { isSubmitting, touched, errors } }) {
	return (
		<Grid className={classes.pricePositionsFieldGrid} item>
			<Field
				name="pricePositions"
				placeholder="0"
				as={TextField}
				error={touched.pricePositions && Boolean(errors.pricePositions)}
				helperText={touched.pricePositions && errors.pricePositions}
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

export default withStyles(styles)(PricePositions);
