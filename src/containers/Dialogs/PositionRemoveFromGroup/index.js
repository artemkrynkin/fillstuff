import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import { Dialog, PDDialogActions, PDDialogTitle } from 'src/components/Dialog';

import { getStockStatus } from 'src/actions/stocks';
import { removeFromGroupPosition } from 'src/actions/positions';

const DialogPositionRemoveFromGroup = props => {
	const { dialogOpen, onCloseDialog, onExitedDialog, selectedPosition } = props;

	if (!selectedPosition) return null;

	return (
		<Dialog open={dialogOpen} onClose={onCloseDialog} onExited={onExitedDialog}>
			<PDDialogTitle theme="primary" onClose={onCloseDialog}>
				Открепление позиции от группы
			</PDDialogTitle>
			<DialogContent>
				<DialogContentText>
					Вы действительно хотите открепить позицию{' '}
					<span>
						<b>
							{selectedPosition.name}
							{selectedPosition.characteristics.reduce((fullCharacteristics, characteristic) => {
								return ` ${fullCharacteristics} ${characteristic.label}`;
							}, '')}
						</b>{' '}
						от группы?
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
						onClick: () => props.removeFromGroupPosition(selectedPosition._id, selectedPosition.positionGroup).then(onCloseDialog),
					},
					text: 'Открепить',
				}}
			/>
		</Dialog>
	);
};

DialogPositionRemoveFromGroup.propTypes = {
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
		removeFromGroupPosition: (positionId, positionGroupId) =>
			dispatch(removeFromGroupPosition(currentStockId, positionId, positionGroupId)),
	};
};

export default connect(
	null,
	mapDispatchToProps
)(DialogPositionRemoveFromGroup);
