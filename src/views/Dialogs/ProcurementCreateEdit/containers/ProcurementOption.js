import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';

import { procurementStatusList } from 'shared/modelsHelpers';

import CheckboxIcon from 'src/components/CheckboxIcon';

import { ReactComponent as ProcurementReceivedIcon } from 'public/img/other/procurement_received.svg';
import { ReactComponent as ProcurementExpectedIcon } from 'public/img/other/procurement_expected.svg';

import styles from './ProcurementOption.module.css';

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

function ProcurementOption({ handleComplete, formikProps: { values, isSubmitting, setFieldValue } }) {
	const onChangeProcurementStatus = status => {
		setFieldValue('status', status, false);
		handleComplete();
	};

	return (
		<DialogContent className={styles.container} style={{ overflow: 'initial' }}>
			<Typography className={styles.title} variant="h5" align="center">
				Выберите вариант закупки
			</Typography>
			<Grid justify="space-evenly" container>
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

export default ProcurementOption;
