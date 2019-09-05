import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import { Dialog, PDDialogActions, PDDialogTitle } from 'src/components/Dialog';

import { getStockStatus } from 'src/actions/stocks';
import { deleteWriteOff } from 'src/actions/writeOffs';

const DialogWriteOffDelete = props => {
	const { dialogOpen, onCloseDialog, onExitedDialog, selectedWriteOff } = props;

	if (!selectedWriteOff) return null;

	return (
		<Dialog open={dialogOpen} onClose={onCloseDialog} onExited={onExitedDialog}>
			<PDDialogTitle theme="primary" onClose={onCloseDialog}>
				Отменить списание
			</PDDialogTitle>
			<DialogContent>
				<DialogContentText>
					Вы действительно хотите отменить списание позиции{' '}
					<span>
						<b>
							{selectedWriteOff.position.name}
							{selectedWriteOff.position.characteristics.reduce((fullCharacteristics, characteristic) => {
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
							props.deleteWriteOff(selectedWriteOff._id).then(response => {
								onCloseDialog();

								if (response.status === 'success') props.getStockStatus();
							}),
					},
					text: 'Отменить',
				}}
			/>
		</Dialog>
	);
};

DialogWriteOffDelete.propTypes = {
	dialogOpen: PropTypes.bool.isRequired,
	onCloseDialog: PropTypes.func.isRequired,
	onExitedDialog: PropTypes.func,
	currentStockId: PropTypes.string.isRequired,
	selectedWriteOff: PropTypes.object,
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStockId } = ownProps;

	return {
		getStockStatus: () => dispatch(getStockStatus(currentStockId)),
		deleteWriteOff: writeOffId => dispatch(deleteWriteOff(currentStockId, writeOffId)),
	};
};

export default connect(
	null,
	mapDispatchToProps
)(DialogWriteOffDelete);
