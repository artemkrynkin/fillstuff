import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { DialogStickyFR, DialogTitle } from 'src/components/Dialog';

import ProcurementForm from './containers/ProcurementForm';

import { useStyles as useStylesProcurementForm } from './containers/ProcurementForm';
import { useStyles as useStylesReceipts } from './components/Receipts';

import DialogUnsavedChanges from './containers/DialogUnsavedChanges';

function DialogProcurementCreateEdit({ dialogOpen, onCloseDialog: onCloseDialogCallback, onExitedDialog: onExitedDialogCallback }) {
	const classesProcurementForm = useStylesProcurementForm();
	const classesReceipts = useStylesReceipts();
	const dialogRef = useRef(null);
	const [dirtyForm, setDirtyForm] = useState(false);
	const [dialogUnsavedChanges, setDialogUnsavedChanges] = useState(false);

	const onEnterDialog = () => {};

	const onExitedDialog = () => {
		if (onExitedDialogCallback) onExitedDialogCallback();
	};

	const onCloseFuseDialog = () => {
		if (dirtyForm) return toggleVisibleDialogUnsavedChanges();

		if (onCloseDialogCallback) onCloseDialogCallback();
	};

	const onCloseAllDialogs = () => {
		toggleVisibleDialogUnsavedChanges();
		onCloseDialogCallback();
	};

	const toggleVisibleDialogUnsavedChanges = () => setDialogUnsavedChanges(prevValue => !prevValue);

	return (
		<>
			<DialogStickyFR
				ref={dialogRef}
				open={dialogOpen}
				onEnter={onEnterDialog}
				onClose={onCloseFuseDialog}
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
				<DialogTitle onClose={onCloseFuseDialog}>Оформление закупки</DialogTitle>
				<ProcurementForm
					dialogRef={dialogRef}
					onCloseFuseDialog={onCloseFuseDialog}
					onCloseDialog={onCloseDialogCallback}
					setDirtyForm={setDirtyForm}
				/>
			</DialogStickyFR>

			<DialogUnsavedChanges
				open={dialogUnsavedChanges}
				onCloseDialog={toggleVisibleDialogUnsavedChanges}
				onCloseAllDialogs={onCloseAllDialogs}
			/>
		</>
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
