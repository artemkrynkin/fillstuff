import React, { useEffect } from 'react';
import { ErrorMessage, FieldArray } from 'formik';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';

import MessageWithIcon from '../components/MessageWithIcon';
import ShopAutocomplete from '../components/ShopAutocomplete';
import InvoiceData from '../components/InvoiceData';
import TotalPrice from '../components/TotalPrice';
import Receipts from '../components/Receipts';
import OrderedReceiptsPositions from '../components/OrderedReceiptsPositions';

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

function ProcurementData({ classes, dialogRef, onUpdateSteps, formikProps, formikProps: { values, touched, errors } }) {
	useEffect(() => {
		onUpdateSteps({ sellingPositions: !!values.receipts.some(receipt => !receipt.position.isFree) });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [values.receipts.length]);

	return (
		<DialogContent className={classes.container} style={{ overflow: 'initial' }}>
			<ErrorMessage name="pricePositions">
				{message => typeof message !== 'string' && <MessageWithIcon icon={['fad', 'exclamation-circle']} message={message} error />}
			</ErrorMessage>

			<Typography className={classes.title} variant="h5" align="center">
				Данные о закупке
			</Typography>

			<Grid className={classes.formRow} wrap="nowrap" alignItems="flex-start" container>
				<InputLabel className={classes.label} error={touched.shop && Boolean(errors.shop)} data-inline>
					Магазин
				</InputLabel>
				<ShopAutocomplete formikProps={formikProps} />
			</Grid>

			{values.status === 'received' ? (
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
			) : null}

			<Grid className={classes.formRow} wrap="nowrap" alignItems="flex-start" container>
				<InputLabel
					className={classes.label}
					error={touched.pricePositions && Boolean(errors.pricePositions)}
					style={{ marginTop: 32 }}
					data-inline
				>
					Итого
				</InputLabel>
				<TotalPrice formikProps={formikProps} compensateCostDeliveryVisible={values.status === 'received'} />
			</Grid>

			<Typography className={classes.title} variant="h5" align="center">
				Список позиций
			</Typography>

			{values.status === 'expected' ? (
				<FieldArray name="orderedReceiptsPositions" validateOnChange={false}>
					{arrayHelpers => <OrderedReceiptsPositions dialogRef={dialogRef} formikProps={formikProps} arrayHelpers={arrayHelpers} />}
				</FieldArray>
			) : null}

			{values.status === 'received' ? (
				<FieldArray name="receipts" validateOnChange={false}>
					{arrayHelpers => <Receipts dialogRef={dialogRef} formikProps={formikProps} arrayHelpers={arrayHelpers} />}
				</FieldArray>
			) : null}
		</DialogContent>
	);
}

export default withStyles(styles)(ProcurementData);
