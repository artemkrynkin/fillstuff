import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import { Dialog, DialogActions, DialogTitle } from 'src/components/Dialog';

import { getStockStatus } from 'src/actions/stocks';
import { cancelWriteOff } from 'src/actions/writeOffs';

const DialogWriteOffCancel = props => {
	const { dialogOpen, onCloseDialog, onExitedDialog, selectedWriteOff } = props;

	if (!selectedWriteOff) return null;

	const onSubmit = () => {
		props.cancelWriteOff(selectedWriteOff._id).then(response => {
			onCloseDialog();

			if (response.status === 'success') props.getStockStatus();
		});
	};

	return (
		<Dialog open={dialogOpen} onClose={onCloseDialog} onExited={onExitedDialog}>
			<DialogTitle onClose={onCloseDialog}>Отменить списание</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Вы действительно хотите отменить списание позиции{' '}
					<span>
						<b>
							{selectedWriteOff.position.characteristics.reduce(
								(fullCharacteristics, characteristic) => `${fullCharacteristics} ${characteristic.label}`,
								selectedWriteOff.position.name
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
					text: 'Отменить',
				}}
			/>
		</Dialog>
	);
};

DialogWriteOffCancel.propTypes = {
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
		cancelWriteOff: writeOffId => dispatch(cancelWriteOff(currentStockId, writeOffId)),
	};
};

export default connect(null, mapDispatchToProps)(DialogWriteOffCancel);
