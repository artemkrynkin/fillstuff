import React from 'react';
import { FieldArray } from 'formik';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';

import ShopAutocomplete from '../components/ShopAutocomplete';
import InvoiceData from '../components/InvoiceData';
import TotalPrice from '../components/TotalPrice';
import Receipts from '../components/Receipts';

const styles = () => ({
	container: {
		paddingBottom: 40,
	},
	title: {
		marginBottom: 20,
	},
	formRow: {
		'&:not(:last-child)': {
			marginBottom: 20,
		},
	},
	label: {
		width: 150,
	},
});

function ProcurementData({ classes, dialogRef, formikProps, formikProps: { touched, errors } }) {
	return (
		<DialogContent className={classes.container} style={{ overflow: 'initial' }}>
			<Typography className={classes.title} variant="h5" align="center">
				Данные о закупке
			</Typography>

			<Grid className={classes.formRow} wrap="nowrap" alignItems="flex-start" container>
				<InputLabel className={classes.label} error={touched.shop && Boolean(errors.shop)} data-inline>
					Магазин
				</InputLabel>
				<ShopAutocomplete formikProps={formikProps} />
			</Grid>

			<Grid className={classes.formRow} wrap="nowrap" alignItems="flex-start" container>
				<InputLabel
					className={classes.label}
					error={(touched.invoiceNumber && Boolean(errors.invoiceNumber)) || (touched.invoiceDate && Boolean(errors.invoiceDate))}
					data-inline
				>
					Чек/накладная
				</InputLabel>
				<InvoiceData formikProps={formikProps} />
			</Grid>

			<Grid className={classes.formRow} wrap="nowrap" alignItems="flex-start" container>
				<InputLabel
					className={classes.label}
					error={touched.pricePositions && Boolean(errors.pricePositions)}
					style={{ marginTop: 32 }}
					data-inline
				>
					Итого
				</InputLabel>
				<TotalPrice formikProps={formikProps} />
			</Grid>

			<Typography className={classes.title} variant="h5" align="center">
				Список позиций
			</Typography>

			<FieldArray name="receipts" validateOnChange={false}>
				{arrayHelpers => <Receipts dialogRef={dialogRef} formikProps={formikProps} arrayHelpers={arrayHelpers} />}
			</FieldArray>
		</DialogContent>
	);
}

export default withStyles(styles)(ProcurementData);
