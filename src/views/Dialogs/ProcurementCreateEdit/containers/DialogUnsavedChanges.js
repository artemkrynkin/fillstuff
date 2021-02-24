import React from 'react';

import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import { Dialog, DialogTitle } from 'src/components/Dialog';

function DialogUnsavedChanges({ open, onCloseDialog, onCloseAllDialogs }) {
	return (
		<Dialog open={open} onClose={onCloseDialog} maxWidth="xs">
			<DialogTitle onClose={onCloseDialog} theme="noTheme">
				Закрыть диалоговое окно?
			</DialogTitle>
			<DialogContent>
				<Typography variant="body1">Внесенные данные не сохранятся</Typography>
				<DialogActions>
					<Button onClick={onCloseDialog} variant="outlined" size="small">
						Отмена
					</Button>
					<Button onClick={onCloseAllDialogs} variant="contained" color="primary" size="small">
						Закрыть
					</Button>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}

export default DialogUnsavedChanges;
