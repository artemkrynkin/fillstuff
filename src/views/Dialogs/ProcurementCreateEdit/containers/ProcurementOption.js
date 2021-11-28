import React, { useEffect } from 'react';
import { ErrorMessage } from 'formik';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import MuiFormHelperText from '@material-ui/core/FormHelperText';

import { procurementStatusList } from 'shared/modelsHelpers';

import CheckboxIcon from 'src/components/CheckboxIcon';

import { ReactComponent as ProcurementReceivedIcon } from 'public/img/other/procurement_received.svg';
import { ReactComponent as ProcurementExpectedIcon } from 'public/img/other/procurement_expected.svg';
import { receiptInitialValues } from '../helpers/utils';

const styles = () => ({
	container: {
		paddingBottom: 40,
	},
	options: {
		marginTop: 20,
	},
});

const FormHelperText = withStyles({
	root: {
		marginLeft: 0,
		marginTop: 0,
	},
})(MuiFormHelperText);

const procurementStatusListTranslate = {
	expected: {
		label: 'C доставкой',
		icon: <ProcurementExpectedIcon />,
	},
	received: {
		label: 'Уже купили',
		icon: <ProcurementReceivedIcon />,
	},
};

function ProcurementOption({ classes, onUpdateSteps, formikProps: { values, isSubmitting, setFieldValue } }) {
	const onChangeProcurementStatus = status => {
		setFieldValue('status', status, false);

		if (status !== values.status && (values.receipts.length || values.orderedReceiptsPositions.length)) {
			const fieldPropName = status === 'expected' ? 'orderedReceiptsPositions' : 'receipts';
			const valuePropName = status === 'expected' ? 'receipts' : 'orderedReceiptsPositions';

			setFieldValue(
				fieldPropName,
				values[valuePropName].map(({ position, quantity, quantityPackages }) =>
					receiptInitialValues({
						position,
						quantity: quantity || quantityPackages,
						ordered: status === 'expected',
					})
				)
			);
			setFieldValue(valuePropName, []);
		}
	};

	useEffect(() => {
		if (values.status) {
			onUpdateSteps({
				status: values.status,
				sellingPositions: !!values.receipts.some(receipt => !receipt.position.isFree),
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [values.status]);

	return (
		<DialogContent className={classes.container} style={{ overflow: 'initial' }}>
			<Typography className={classes.title} variant="h5" align="center" gutterBottom>
				Выберите вариант закупки
			</Typography>
			<ErrorMessage name="status">
				{message => (
					<FormHelperText style={{ textAlign: 'center' }} error>
						{message}
					</FormHelperText>
				)}
			</ErrorMessage>
			<Grid className={classes.options} justifyContent="space-evenly" container>
				{procurementStatusList.map(status => (
					<CheckboxIcon
						key={status}
						onClick={() => onChangeProcurementStatus(status)}
						icon={procurementStatusListTranslate[status].icon}
						label={procurementStatusListTranslate[status].label}
						checked={values.status === status}
						disabled={isSubmitting}
					/>
				))}
			</Grid>
		</DialogContent>
	);
}

export default withStyles(styles)(ProcurementOption);
