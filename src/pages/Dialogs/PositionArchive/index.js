import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import { Dialog, DialogActions, DialogTitle } from 'src/components/Dialog';

import { getStudioStock } from 'src/actions/studio';
import { archivePosition } from 'src/actions/positions';

const DialogPositionArchive = props => {
	const { dialogOpen, onCloseDialog, onExitedDialog, selectedPosition } = props;

	if (!selectedPosition) return null;

	const onSubmit = () => {
		props.archivePosition(selectedPosition._id, selectedPosition.positionGroup).then(response => {
			onCloseDialog();

			if (response.status === 'success') props.getStudioStock();
		});
	};

	return (
		<Dialog open={dialogOpen} onClose={onCloseDialog} onExited={onExitedDialog}>
			<DialogTitle onClose={onCloseDialog}>Архивирование позиции</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Вы действительно хотите архивировать позицию{' '}
					<span>
						<b>
							{selectedPosition.characteristics.reduce(
								(fullCharacteristics, characteristic) => `${fullCharacteristics} ${characteristic.label}`,
								selectedPosition.name
							)}
						</b>
						?
					</span>
				</DialogContentText>
			</DialogContent>
			<DialogActions
				leftHandleProps={{
					handleProps: {
						onClick: onCloseDialog,
					},
					text: 'Отмена',
				}}
				rightHandleProps={{
					handleProps: {
						autoFocus: true,
						onClick: onSubmit,
					},
					text: 'Архивировать',
				}}
			/>
		</Dialog>
	);
};

DialogPositionArchive.propTypes = {
	dialogOpen: PropTypes.bool.isRequired,
	onCloseDialog: PropTypes.func.isRequired,
	onExitedDialog: PropTypes.func,
	selectedPosition: PropTypes.object,
};

const mapDispatchToProps = dispatch => {
	return {
		getStudioStock: () => dispatch(getStudioStock()),
		archivePosition: (positionId, positionGroupId) => dispatch(archivePosition({ params: { positionId }, data: { positionGroupId } })),
	};
};

export default connect(null, mapDispatchToProps)(DialogPositionArchive);
