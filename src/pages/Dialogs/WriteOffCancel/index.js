import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import { Dialog, DialogActions, DialogTitle } from 'src/components/Dialog';

import { getStudioStock } from 'src/actions/studio';
import { cancelWriteOff } from 'src/actions/writeOffs';

const DialogWriteOffCancel = props => {
	const { dialogOpen, onCloseDialog, onExitedDialog, selectedWriteOff } = props;

	if (!selectedWriteOff) return null;

	const onSubmit = () => {
		props.cancelWriteOff(selectedWriteOff._id).then(response => {
			onCloseDialog();

			if (response.status === 'success') props.getStudioStock();
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
	currentStudioId: PropTypes.string.isRequired,
	selectedWriteOff: PropTypes.object,
};

const mapDispatchToProps = dispatch => {
	return {
		getStudioStock: () => dispatch(getStudioStock()),
		cancelWriteOff: writeOffId => dispatch(cancelWriteOff({ params: { writeOffId } })),
	};
};

export default connect(null, mapDispatchToProps)(DialogWriteOffCancel);
