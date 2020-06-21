import React from 'react';
import PropTypes from 'prop-types';

import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import { procurementPositionTransform } from 'src/helpers/utils';

import { Dialog, DialogTitle } from 'src/components/Dialog';

const ReceiptConfirmCreate = props => {
	const { dialogOpen, onCloseDialog, onExitedDialog, selectedPosition, onOpenDialogByName } = props;

	if (!selectedPosition) return null;

	const procurement = {
		positions: [procurementPositionTransform(selectedPosition)],
	};

	return (
		<Dialog open={dialogOpen} onClose={onCloseDialog} onExited={onExitedDialog} maxWidth="sm">
			<DialogTitle onClose={onCloseDialog} theme="noTheme" />
			<DialogContent>
				<Typography variant="body1" gutterBottom>
					Если вы закупили новую позицию, создайте поступление при помощи кнопки «Оформить закупку».
				</Typography>
				<Typography variant="body1">
					Если вы приняли решение вести программный учет позиции, которая вами уже используется, но не была внесена в Blikside, продолжите
					оформление здесь.
				</Typography>
				<DialogActions>
					<Button
						onClick={() => onOpenDialogByName('dialogProcurementReceivedCreate', 'procurementReceived', procurement)}
						variant="outlined"
						color="primary"
						size="small"
					>
						Оформить закупку
					</Button>
					<Button
						onClick={() => onOpenDialogByName('dialogReceiptCreate', 'position', selectedPosition)}
						variant="contained"
						color="primary"
						size="small"
					>
						Продолжить
					</Button>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
};

ReceiptConfirmCreate.propTypes = {
	dialogOpen: PropTypes.bool.isRequired,
	onCloseDialog: PropTypes.func.isRequired,
	onExitedDialog: PropTypes.func,
	selectedPosition: PropTypes.object,
	onOpenDialogByName: PropTypes.func,
};

export default ReceiptConfirmCreate;
