import React from 'react';
import PropTypes from 'prop-types';

import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import ButtonBase from '@material-ui/core/ButtonBase';

import { Dialog, DialogTitle } from 'src/components/Dialog';

import { ReactComponent as ProcurementExpectedIcon } from 'public/img/other/procurement_expected.svg';
import { ReactComponent as ProcurementReceivedIcon } from 'public/img/other/procurement_received.svg';

import styles from './index.module.css';

const procurementStatuses = [
	{
		value: 'expected',
		title: 'На доставке',
		// title: 'С доставкой',
		subhead: 'Подтверждение заказа, уточнение времени доставки',
		icon: <ProcurementExpectedIcon />,
	},
	{
		value: 'received',
		title: 'Уже закупили',
		subhead: 'На складе',
		icon: <ProcurementReceivedIcon />,
	},
];

function ProcurementSelectionStatus(props) {
	const { dialogOpen, onCloseDialog, onExitedDialog } = props;

	return (
		<Dialog open={dialogOpen} onClose={onCloseDialog} onExited={onExitedDialog} maxWidth="md">
			<DialogTitle onClose={onCloseDialog} theme="noTheme" titlePositionCenter>
				{/*Создание закупки*/}
				Выбор этапа закупки
				<br />
				<FormLabel component="span">Выберите, на каком этапе сейчас находится закупка</FormLabel>
			</DialogTitle>
			<DialogContent>
				<Grid justify="space-around" alignItems="flex-start" container>
					{procurementStatuses.map(status => (
						<ButtonBase key={status.value} className={styles.button}>
							<div className={styles.buttonIcon}>{status.icon}</div>
							<div className={styles.details}>
								<FormLabel className={styles.title} component="div">
									{status.title}
								</FormLabel>
								<FormLabel className={styles.subhead} component="div">
									{status.subhead}
								</FormLabel>
							</div>
						</ButtonBase>
					))}
				</Grid>
			</DialogContent>
		</Dialog>
	);
}

ProcurementSelectionStatus.propTypes = {
	dialogOpen: PropTypes.bool.isRequired,
	onCloseDialog: PropTypes.func.isRequired,
	onExitedDialog: PropTypes.func,
};

export default ProcurementSelectionStatus;
