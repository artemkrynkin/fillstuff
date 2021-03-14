import React from 'react';
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
		onUpdateSteps({
			status,
			sellingPositions: !!values.receipts.some(receipt => !receipt.position.isFree),
		});
	};

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
			<Grid className={classes.options} justify="space-evenly" container>
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
