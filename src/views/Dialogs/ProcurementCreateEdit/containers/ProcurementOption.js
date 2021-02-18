import React, { useEffect } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';

import { procurementStatusList } from 'shared/modelsHelpers';

import CheckboxIcon from 'src/components/CheckboxIcon';

import { ReactComponent as ProcurementReceivedIcon } from 'public/img/other/procurement_received.svg';
import { ReactComponent as ProcurementExpectedIcon } from 'public/img/other/procurement_expected.svg';
import ClassNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ErrorMessage } from 'formik';

const styles = () => ({
	container: {
		paddingBottom: 40,
	},
	options: {
		marginTop: 20,
	},
});

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
		onUpdateSteps({ status });
	};

	return (
		<DialogContent className={classes.container} style={{ overflow: 'initial' }}>
			<Typography className={classes.title} variant="h5" align="center" gutterBottom>
				Выберите вариант закупки
			</Typography>
			<ErrorMessage name="status">
				{message => (
					<Typography variant="body1" align="center" color="error">
						{message}
					</Typography>
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
