import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { DialogStickyFR, DialogTitle } from 'src/components/Dialog';

import ProcurementForm from './containers/ProcurementForm';

import { useStyles as useStylesProcurementForm } from './containers/ProcurementForm';
import { useStyles as useStylesReceipts } from './components/Receipts';

function DialogProcurementCreateEdit({ dialogOpen, onCloseDialog, onExitedDialog: onExitedDialogCallback }) {
	const classesProcurementForm = useStylesProcurementForm();
	const classesReceipts = useStylesReceipts();
	const dialogRef = useRef(null);

	const onEnterDialog = () => {};

	const onExitedDialog = () => {
		if (onExitedDialogCallback) onExitedDialogCallback();
	};

	return (
		<DialogStickyFR
			ref={dialogRef}
			open={dialogOpen}
			onEnter={onEnterDialog}
			onClose={onCloseDialog}
			onExited={onExitedDialog}
			maxWidth="lg"
			scroll="body"
			stickyAnyone={[
				{
					stickySelector: classesProcurementForm.stepper,
					position: 'top',
					sentinelAdditionalText: 'Stepper',
				},
				{
					stickySelector: classesReceipts.addPositionContainer,
					position: 'top',
					sentinelAdditionalText: 'AddPositionContainer',
				},
			]}
			stickyActions
		>
			<DialogTitle onClose={onCloseDialog}>Оформление закупки</DialogTitle>
			<ProcurementForm dialogRef={dialogRef} onCloseDialog={onCloseDialog} />
		</DialogStickyFR>
	);
}

DialogProcurementCreateEdit.defaultProps = {
	dialogOpen: false,
};

DialogProcurementCreateEdit.propTypes = {
	dialogOpen: PropTypes.bool,
	onCloseDialog: PropTypes.func.isRequired,
	onExitedDialog: PropTypes.func,
};

export default DialogProcurementCreateEdit;
