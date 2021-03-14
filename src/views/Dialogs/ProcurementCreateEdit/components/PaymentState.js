import React, { useEffect } from 'react';
import { Field } from 'formik';

import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';

import MenuItem from 'src/components/MenuItem';

const styles = () => ({
	container: {
		width: 125,
	},
});

function PaymentState({ classes, formikProps: { isSubmitting, values, touched, errors, setFieldValue } }) {
	useEffect(() => {
		if (!values.paymentState) setFieldValue('paymentState', 'unpaid', false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className={classes.container}>
			<Field name="paymentState" as={Select} error={Boolean(touched.paymentState && errors.paymentState)} disabled={isSubmitting} fullWidth>
				<MenuItem value="unpaid">Не оплачено</MenuItem>
				<MenuItem value="paid">Оплачено</MenuItem>
			</Field>
		</div>
	);
}

export default withStyles(styles)(PaymentState);
