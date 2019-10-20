import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import { Dialog, PDDialogActions, PDDialogTitle } from 'src/components/Dialog';

import { getStockStatus } from 'src/actions/stocks';
import { archivePositionInGroup } from 'src/actions/positionsInGroups';

const DialogPositionArchive = props => {
	const { dialogOpen, onCloseDialog, onExitedDialog, selectedPosition } = props;

	if (!selectedPosition) return null;

	return (
		<Dialog open={dialogOpen} onClose={onCloseDialog} onExited={onExitedDialog}>
			<PDDialogTitle theme="primary" onClose={onCloseDialog}>
				Архивирование позиции
			</PDDialogTitle>
			<DialogContent>
				<DialogContentText>
					Вы действительно хотите архивировать позицию{' '}
					<span>
						<b>
							{selectedPosition.name}
							{selectedPosition.characteristics.reduce((fullCharacteristics, characteristic) => {
								return ` ${fullCharacteristics} ${characteristic.label}`;
							}, '')}
						</b>
						?
					</span>
				</DialogContentText>
			</DialogContent>
			<PDDialogActions
				leftHandleProps={{
					handleProps: {
						onClick: onCloseDialog,
					},
					text: 'Отмена',
				}}
				rightHandleProps={{
					handleProps: {
						autoFocus: true,
						onClick: () =>
							props.archivePositionInGroup(selectedPosition._id, selectedPosition.positionGroup).then(response => {
								onCloseDialog();

								if (response.status === 'success') props.getStockStatus();
							}),
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
	currentStockId: PropTypes.string.isRequired,
	selectedPosition: PropTypes.object,
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStockId } = ownProps;

	return {
		getStockStatus: () => dispatch(getStockStatus(currentStockId)),
		archivePositionInGroup: (positionId, positionGroupId) => dispatch(archivePositionInGroup(currentStockId, positionId, positionGroupId)),
	};
};

export default connect(
	null,
	mapDispatchToProps
)(DialogPositionArchive);
