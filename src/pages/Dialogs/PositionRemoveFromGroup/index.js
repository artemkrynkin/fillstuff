import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import { Dialog, DialogActions, DialogTitle } from 'src/components/Dialog';

import { getStudioStock } from 'src/actions/studio';
import { removePositionFromGroup } from 'src/actions/positionGroups';

const DialogPositionRemoveFromGroup = props => {
	const { dialogOpen, onCloseDialog, onExitedDialog, selectedPosition } = props;

	if (!selectedPosition) return null;

	return (
		<Dialog open={dialogOpen} onClose={onCloseDialog} onExited={onExitedDialog}>
			<DialogTitle onClose={onCloseDialog}>Открепление позиции от группы</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Вы действительно хотите открепить позицию{' '}
					<span>
						<b>
							{selectedPosition.characteristics.reduce(
								(fullCharacteristics, characteristic) => `${fullCharacteristics} ${characteristic.label}`,
								selectedPosition.name
							)}
						</b>{' '}
						от группы?
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
						onClick: () => props.removePositionFromGroup(selectedPosition._id, selectedPosition.positionGroup).then(onCloseDialog),
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
	selectedPosition: PropTypes.object,
};

const mapDispatchToProps = dispatch => {
	return {
		getStudioStock: () => dispatch(getStudioStock()),
		removePositionFromGroup: (positionId, positionGroupId) =>
			dispatch(removePositionFromGroup({ params: { positionId }, data: { positionGroupId } })),
	};
};

export default connect(null, mapDispatchToProps)(DialogPositionRemoveFromGroup);
