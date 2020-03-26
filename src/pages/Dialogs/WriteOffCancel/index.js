import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';

import { Dialog, DialogTitle } from 'src/components/Dialog';

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
			<DialogTitle onClose={onCloseDialog} theme="noTheme">
				Отменить списание
			</DialogTitle>
			<DialogContent>
				<Typography variant="body1">
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
		getStudioStock: () => dispatch(getStudioStock()),
		cancelWriteOff: writeOffId => dispatch(cancelWriteOff({ params: { writeOffId } })),
	};
};

export default connect(null, mapDispatchToProps)(DialogWriteOffCancel);
