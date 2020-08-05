import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import { Dialog, DialogTitle } from 'src/components/Dialog';

import { getStudioStore } from 'src/actions/studio';
import { removePositionFromGroup } from 'src/actions/positionGroups';
import { enqueueSnackbar } from 'src/actions/snackbars';

const DialogPositionRemoveFromGroup = props => {
	const { dialogOpen, onCloseDialog, onExitedDialog, onCallback, selectedPosition } = props;

	if (!selectedPosition) return null;

	const onSubmit = () => {
		props.removePositionFromGroup(selectedPosition._id, selectedPosition.positionGroup).then(response => {
			if (onCallback !== undefined) onCallback(response);

			onCloseDialog();

			if (response.status === 'success') {
				props.enqueueSnackbar({
					message: (
						<>
							Позиция&nbsp;<b>{selectedPosition.name}</b>&nbsp;откреплена от группы.
						</>
					),
					options: {
						variant: 'success',
					},
				});
			}

			if (response.status === 'error') {
				props.enqueueSnackbar({
					message: response.message || 'Неизвестная ошибка.',
					options: {
						variant: 'error',
					},
				});
			}
		});
	};

	return (
		<Dialog open={dialogOpen} onClose={onCloseDialog} onExited={onExitedDialog}>
			<DialogTitle onClose={onCloseDialog} theme="noTheme">
				Открепление позиции от группы
			</DialogTitle>
			<DialogContent>
				<Typography variant="body1">
					Вы действительно хотите открепить позицию{' '}
					<span>
						<b>
							{selectedPosition.characteristics.reduce(
								(fullName, characteristic) => `${fullName} ${characteristic.name}`,
								selectedPosition.name
							)}
						</b>{' '}
						от группы?
					</span>
				</Typography>
				<DialogActions>
					<Button onClick={onCloseDialog} variant="outlined" size="small">
						Отмена
					</Button>
					<Button onClick={onSubmit} variant="contained" color="primary" size="small" autoFocus>
						Открепить
					</Button>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
};

DialogPositionRemoveFromGroup.propTypes = {
	dialogOpen: PropTypes.bool.isRequired,
	onCloseDialog: PropTypes.func.isRequired,
	onExitedDialog: PropTypes.func,
	onCallback: PropTypes.func,
	selectedPosition: PropTypes.object,
};

const mapDispatchToProps = dispatch => {
	return {
		getStudioStore: () => dispatch(getStudioStore()),
		removePositionFromGroup: (positionId, positionGroupId) =>
			dispatch(removePositionFromGroup({ params: { positionId }, data: { positionGroupId } })),
		enqueueSnackbar: (...args) => dispatch(enqueueSnackbar(...args)),
	};
};

export default connect(null, mapDispatchToProps)(DialogPositionRemoveFromGroup);
