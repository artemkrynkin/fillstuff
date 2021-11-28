import React from 'react';
import PropTypes from 'prop-types';

import { Dialog, DialogTitle } from 'src/components/Dialog';

import StudioForm from './StudioForm';

function DialogStudioCreate(props) {
	const { dialogOpen, onCloseDialog, onExitedDialog } = props;

	return (
		<Dialog open={dialogOpen} onClose={onCloseDialog} TransitionProps={{ onExited: onExitedDialog }} maxWidth="sm">
			<DialogTitle onClose={onCloseDialog} theme="noTheme">
				Создание студии
			</DialogTitle>
			<StudioForm {...props} />
		</Dialog>
	);
}

DialogStudioCreate.defaultProps = {
	onExitedDialog: undefined,
	onCallback: undefined,
	selectedPosition: null,
};

DialogStudioCreate.propTypes = {
	dialogOpen: PropTypes.bool.isRequired,
	onCloseDialog: PropTypes.func.isRequired,
	onExitedDialog: PropTypes.func,
};

export default DialogStudioCreate;
