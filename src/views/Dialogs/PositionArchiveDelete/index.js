import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import { Dialog, DialogTitle } from 'src/components/Dialog';
import PositionSummary from 'src/components/PositionSummary';

import { getStudioStore } from 'src/actions/studios';
import { archivePosition, archivePositionAfterEnded } from 'src/actions/positions';
import { enqueueSnackbar } from 'src/actions/snackbars';

import { ButtonRed } from './styles';

const PositionArchiveDelete = props => {
	const { dialogOpen, onCloseDialog, onExitedDialog, onCallback, selectedPosition } = props;

	if (!selectedPosition) return null;

	const type = selectedPosition.hasReceipts ? 'archive' : 'delete';

	/**
	 *
	 * @param action - archiveOrDelete|archiveAfterEnded
	 * @returns {Promise<void>}
	 */
	const onArchiveOrDelete = async action => {
		try {
			let response;

			if (action === 'archiveOrDelete') {
				response = await props.archivePosition(selectedPosition._id, selectedPosition.positionGroup);
			} else {
				response = await props.archivePositionAfterEnded(selectedPosition._id, { archivedAfterEnded: true });
			}

			if (onCallback !== undefined) onCallback(response);

			props.enqueueSnackbar({
				message:
					action === 'archiveOrDelete' ? (
						<div>
							Позиция <b>{selectedPosition.name}</b> успешно {type === 'archive' ? 'перемещена в архив' : 'удалена'}.
						</div>
					) : (
						<div>
							Позиция <b>{selectedPosition.name}</b> будет перемещена в архив после реализации всех поступлений.
						</div>
					),
				options: {
					variant: 'success',
				},
			});
		} catch (error) {
			props.enqueueSnackbar({
				message: error.message || 'Неизвестная ошибка.',
				options: {
					variant: 'error',
				},
			});
		}
	};

	return (
		<Dialog open={dialogOpen} onClose={onCloseDialog} onExited={onExitedDialog} maxWidth={type === 'archive' ? 'md' : 'sm'}>
			<DialogTitle onClose={onCloseDialog} theme="noTheme">
				{type === 'archive' ? 'Архивирование' : 'Удаление'} позиции
			</DialogTitle>
			<DialogContent>
				{type === 'archive' ? (
					<>
						<PositionSummary
							name={selectedPosition.name}
							characteristics={selectedPosition.characteristics}
							style={{ marginBottom: 20 }}
							avatar
						/>
						<Typography variant="body1" gutterBottom>
							Позиция немедленно <b>переместится в архив</b>.
						</Typography>
						<Typography variant="body1">
							Дальнейшая <b>реализация и использование будет недоступно</b> до тех пор, пока позиция не будет разархивирована.
						</Typography>
					</>
				) : (
					<>
						<PositionSummary
							name={selectedPosition.name}
							characteristics={selectedPosition.characteristics}
							style={{ marginBottom: 20 }}
							avatar
						/>
						<Typography variant="body1" gutterBottom>
							Вы действительно хотите <b>удалить данную позицию</b>?
						</Typography>
						<Typography variant="body1">
							Отменить это действие будет <b>невозможно</b>.
						</Typography>
					</>
				)}
				<DialogActions>
					<Button onClick={onCloseDialog} variant="outlined" size="small">
						Отмена
					</Button>
					{type === 'archive' ? (
						<ButtonRed
							onClick={() => onArchiveOrDelete('archiveOrDelete')}
							variant={!selectedPosition.archivedAfterEnded && selectedPosition.receipts.length ? 'outlined' : 'contained'}
							color="primary"
							size="small"
						>
							Архивировать
						</ButtonRed>
					) : null}
					{type === 'archive' && !selectedPosition.archivedAfterEnded && selectedPosition.receipts.length ? (
						<ButtonRed onClick={() => onArchiveOrDelete('archiveAfterEnded')} variant="contained" color="primary" size="small">
							Архивировать после реализации
						</ButtonRed>
					) : null}
					{type === 'delete' ? (
						<ButtonRed onClick={() => onArchiveOrDelete('archiveOrDelete')} variant="contained" color="primary" size="small">
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
		getStudioStore: () => dispatch(getStudioStore()),
		archivePosition: (positionId, positionGroupId) => dispatch(archivePosition({ params: { positionId }, data: { positionGroupId } })),
		archivePositionAfterEnded: (positionId, data) => dispatch(archivePositionAfterEnded({ params: { positionId }, data })),
		enqueueSnackbar: (...args) => dispatch(enqueueSnackbar(...args)),
	};
};

export default connect(null, mapDispatchToProps)(PositionArchiveDelete);
