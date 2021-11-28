import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { DialogStickyFR, DialogTitle } from 'src/components/Dialog';

import ProcurementForm from './containers/ProcurementForm';

import { useStyles as useStylesProcurementForm } from './containers/ProcurementForm';
import { useStyles as useStylesReceipts } from './components/Receipts';

import DialogUnsavedChanges from './containers/DialogUnsavedChanges';

function DialogProcurementCreateEdit({
	type,
	dialogOpen,
	onCloseDialog: onCloseDialogCallback,
	onExitedDialog: onExitedDialogCallback,
	selectedProcurement,
}) {
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

	if (/confirm|edit/.test(type) && !selectedProcurement) return null;

	return (
		<>
			<DialogStickyFR
				ref={dialogRef}
				open={dialogOpen}
        TransitionProps={{
          onEnter: onEnterDialog,
          onExited: onExitedDialog
        }}
				onClose={onCloseFuseDialog}
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
				<DialogTitle onClose={onCloseFuseDialog}>
					{type === 'create' ? 'Оформление закупки' : type === 'edit' ? 'Редактирование закупки' : 'Подтверждение доставки'}
				</DialogTitle>
				<ProcurementForm
					type={type}
					dialogRef={dialogRef}
					onCloseFuseDialog={onCloseFuseDialog}
					onCloseDialog={onCloseDialogCallback}
					setDirtyForm={setDirtyForm}
					selectedProcurement={selectedProcurement}
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
	type: PropTypes.oneOf(['create', 'confirm', 'edit']).isRequired,
	dialogOpen: PropTypes.bool,
	onCloseDialog: PropTypes.func.isRequired,
	onExitedDialog: PropTypes.func,
	selectedProcurement: PropTypes.object,
};

export default DialogProcurementCreateEdit;
