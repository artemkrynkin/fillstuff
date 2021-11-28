import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';

import { Dialog, DialogTitle } from 'src/components/Dialog';

import { getStudioStore } from 'src/actions/studios';
import { cancelWriteOff } from 'src/actions/writeOffs';
import { enqueueSnackbar } from 'src/actions/snackbars';

const DialogWriteOffCancel = props => {
	const { dialogOpen, onCloseDialog, onExitedDialog, selectedWriteOff } = props;

	if (!selectedWriteOff) return null;

	const onSubmit = () => {
		props.cancelWriteOff(selectedWriteOff._id).then(response => {
			onCloseDialog();

			// if (response.status === 'success') props.getStudioStore();

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
		<Dialog open={dialogOpen} onClose={onCloseDialog} TransitionProps={{ onExited: onExitedDialog }}>
			<DialogTitle onClose={onCloseDialog} theme="noTheme">
				Отменить списание
			</DialogTitle>
			<DialogContent>
				<Typography variant="body1">
					Вы действительно хотите отменить списание позиции{' '}
					<span>
						<b>
							{selectedWriteOff.position.characteristics.reduce(
								(fullName, characteristic) => `${fullName} ${characteristic.name}`,
								selectedWriteOff.position.name
							)}
						</b>
						?
					</span>
				</Typography>
				<DialogActions>
					<Button onClick={onCloseDialog} variant="outlined" size="small">
						Отмена
					</Button>
					<Button onClick={onSubmit} variant="contained" color="primary" size="small">
						Отменить списание
					</Button>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
};

DialogWriteOffCancel.propTypes = {
	dialogOpen: PropTypes.bool.isRequired,
	onCloseDialog: PropTypes.func.isRequired,
	onExitedDialog: PropTypes.func,
	selectedWriteOff: PropTypes.object,
};

const mapDispatchToProps = dispatch => {
	return {
		getStudioStore: () => dispatch(getStudioStore()),
		cancelWriteOff: writeOffId => dispatch(cancelWriteOff({ params: { writeOffId } })),
		enqueueSnackbar: (...args) => dispatch(enqueueSnackbar(...args)),
	};
};

export default connect(null, mapDispatchToProps)(DialogWriteOffCancel);
