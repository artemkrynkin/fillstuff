import React from 'react';
import PropTypes from 'prop-types';

import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import { Dialog, DialogTitle } from 'src/components/Dialog';

const ReceiptConfirmCreate = props => {
	const { dialogOpen, onCloseDialog, onExitedDialog, selectedPosition, onOpenDialogByName } = props;

	if (!selectedPosition) return null;

	const procurement = {
		orderedReceiptsPositions: [
			{
				position: selectedPosition,
			},
		],
	};

	return (
		<Dialog open={dialogOpen} onClose={onCloseDialog} onExited={onExitedDialog} maxWidth="sm">
			<DialogTitle onClose={onCloseDialog} theme="noTheme">
				Внимание!
			</DialogTitle>
			<DialogContent>
				<Typography variant="body1" gutterBottom>
					Если вы&nbsp;закупили новую позицию, создайте поступление при помощи кнопки &laquo;Оформить закупку&raquo;.
				</Typography>
				<Typography variant="body1">
					Если позиция уже используется вами, но&nbsp;не&nbsp;была внесена в&nbsp;Fillstuff, продолжите оформление здесь.
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
