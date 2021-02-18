import React from 'react';
import { FieldArray } from 'formik';

import { withStyles } from '@material-ui/core/styles';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';

import Receipts from '../components/Receipts';

const styles = () => ({
	container: {
		paddingBottom: 40,
	},
	title: {
		marginBottom: 20,
	},
});

function PriceFormation({ classes, dialogRef, formikProps }) {
	return (
		<DialogContent className={classes.container} style={{ overflow: 'initial' }}>
			<Typography className={classes.title} variant="h5" align="center">
				Формирование цены продажи
			</Typography>

			<FieldArray name="receipts" validateOnChange={false}>
				{arrayHelpers => <Receipts dialogRef={dialogRef} formikProps={formikProps} arrayHelpers={arrayHelpers} />}
			</FieldArray>
		</DialogContent>
	);
}

export default withStyles(styles)(PriceFormation);
