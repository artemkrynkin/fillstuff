import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import { Dialog, DialogTitle } from 'src/components/Dialog';

import { getStudioStock } from 'src/actions/studio';
import { archivePosition, archivePositionAfterEnded } from 'src/actions/positions';

import { ButtonRed } from './styles';

const PositionArchiveDelete = props => {
	const { dialogOpen, onCloseDialog, onExitedDialog, onCallback, selectedPosition } = props;

	if (!selectedPosition) return null;

	const type = selectedPosition.receipts.length ? 'archive' : 'delete';

	const onArchiveDelete = () => {
		props.archivePosition(selectedPosition._id, selectedPosition.positionGroup).then(response => {
			if (onCallback !== undefined) onCallback(response);

			onCloseDialog();

			if (response.status === 'success') props.getStudioStock();
		});
	};

	const onArchivedAfterEnded = () => {
		props.archivePositionAfterEnded(selectedPosition._id, { archivedAfterEnded: true }).then(response => {
			if (onCallback !== undefined) onCallback(response);

			onCloseDialog();
		});
	};

	return (
		<Dialog open={dialogOpen} onClose={onCloseDialog} onExited={onExitedDialog} maxWidth={type === 'archive' ? 'md' : 'sm'}>
			<DialogTitle onClose={onCloseDialog} theme="noTheme">
				{type === 'archive' ? 'Архивирование' : 'Удаление'} позиции
			</DialogTitle>
			<DialogContent>
				<Typography variant="body1">
					Вы действительно хотите {type === 'archive' ? 'архивировать' : 'удалить'}{' '}
					<b>
						{selectedPosition.characteristics.reduce(
							(fullCharacteristics, characteristic) => `${fullCharacteristics} ${characteristic.label}`,
							selectedPosition.name
						)}
					</b>
					?
				</Typography>
				<DialogActions>
					<Button onClick={onCloseDialog} variant="outlined" size="small">
						Отмена
					</Button>
					{type === 'archive' ? (
						<ButtonRed
							onClick={onArchiveDelete}
							variant={!selectedPosition.archivedAfterEnded ? 'outlined' : 'contained'}
							color="primary"
							size="small"
						>
							Архивировать
						</ButtonRed>
					) : null}
					{type === 'archive' && !selectedPosition.archivedAfterEnded ? (
						<ButtonRed onClick={onArchivedAfterEnded} variant="contained" color="primary" size="small">
							Архивировать после реализации
						</ButtonRed>
					) : null}
					{type === 'delete' ? (
						<ButtonRed onClick={onArchiveDelete} variant="contained" color="primary" size="small">
							Удалить
						</ButtonRed>
					) : null}
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
};

PositionArchiveDelete.propTypes = {
	dialogOpen: PropTypes.bool.isRequired,
	onCloseDialog: PropTypes.func.isRequired,
	onExitedDialog: PropTypes.func,
	onCallback: PropTypes.func,
	selectedPosition: PropTypes.object,
};

const mapDispatchToProps = dispatch => {
	return {
		getStudioStock: () => dispatch(getStudioStock()),
		archivePosition: (positionId, positionGroupId) => dispatch(archivePosition({ params: { positionId }, data: { positionGroupId } })),
		archivePositionAfterEnded: (positionId, data) => dispatch(archivePositionAfterEnded({ params: { positionId }, data })),
	};
};

export default connect(null, mapDispatchToProps)(PositionArchiveDelete);
