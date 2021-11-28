import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';

import { Dialog, DialogTitle } from 'src/components/Dialog';

import { deactivatedMember } from 'src/actions/members';
import { enqueueSnackbar } from 'src/actions/snackbars';

import { ButtonRed } from './styles';

const DialogMemberDeactivated = props => {
	const { dialogOpen, onCloseDialog, onExitedDialog, onCallback, selectedMember } = props;

	if (!selectedMember) return null;

	const onSubmit = () => {
		props.deactivatedMember(selectedMember._id).then(response => {
			if (onCallback !== undefined) onCallback(response);

			onCloseDialog();

			if (response.status === 'error') {
				this.props.enqueueSnackbar({
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
				Отключение участника
			</DialogTitle>
			<DialogContent>
				<Typography variant="body1">
					Вы действительно хотите отключить участника <b>{selectedMember.user.name}</b> от команды?
				</Typography>
				<DialogActions>
					<Button onClick={onCloseDialog} variant="outlined" size="small">
						Отмена
					</Button>
					<ButtonRed onClick={onSubmit} variant="contained" color="primary" size="small">
						Отключить
					</ButtonRed>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
};

DialogMemberDeactivated.propTypes = {
	dialogOpen: PropTypes.bool.isRequired,
	onCloseDialog: PropTypes.func.isRequired,
	onExitedDialog: PropTypes.func,
	onCallback: PropTypes.func,
	selectedMember: PropTypes.object,
};

const mapDispatchToProps = dispatch => {
	return {
		deactivatedMember: memberId => dispatch(deactivatedMember({ params: { memberId } })),
		enqueueSnackbar: (...args) => dispatch(enqueueSnackbar(...args)),
	};
};

export default connect(null, mapDispatchToProps)(DialogMemberDeactivated);
