import React, { useState, lazy, Suspense } from 'react';

import Container from '@material-ui/core/Container';

import View from './View';

const DialogProcurementExpectedView = lazy(() => import('src/views/Dialogs/ProcurementExpectedView'));

const DialogProcurementCreate = lazy(() => import('src/views/Dialogs/ProcurementCreateEdit'));
const DialogProcurementEdit = lazy(() => import('src/views/Dialogs/ProcurementCreateEdit'));
const DialogProcurementConfirm = lazy(() => import('src/views/Dialogs/ProcurementCreateEdit'));

const DialogProcurementExpectedCancel = lazy(() => import('src/views/Dialogs/ProcurementExpectedCancel'));

// const DialogProcurementExpectedCreate = lazy(() => import('src/views/Dialogs/ProcurementExpectedCreateConfirmEdit'));
// const DialogProcurementExpectedConfirm = lazy(() => import('src/views/Dialogs/ProcurementExpectedCreateConfirmEdit'));
// const DialogProcurementExpectedEdit = lazy(() => import('src/views/Dialogs/ProcurementExpectedCreateConfirmEdit'));
// const DialogProcurementReceivedCreate = lazy(() => import('src/views/Dialogs/ProcurementReceivedCreate'));

const Index = props => {
	const { currentStudio } = props;
	const [dialogData, setDialogData] = useState({
		procurement: null,
		// procurementExpected: null,
		// procurementReceived: null,
	});
	const [dialogOpenedName, setDialogOpenedName] = useState('');
	const [dialogs, setDialogs] = useState({
		dialogProcurementCreate: false,
		dialogProcurementEdit: false,
		dialogProcurementConfirm: false,
		dialogProcurementExpectedView: false,
		// dialogProcurementExpectedCreate: false,
		// dialogProcurementExpectedConfirm: false,
		// dialogProcurementExpectedEdit: false,
		// dialogProcurementReceivedCreate: false,
		dialogProcurementExpectedCancel: false,
	});

	const onOpenDialogByName = (dialogName, dataType, data) => {
		setDialogOpenedName(dialogName);

		setDialogs({
			...dialogs,
			[dialogName]: true,
		});

		if (dataType && data) {
			setDialogData({
				...dialogData,
				[dataType]: data,
			});
		}
	};

	const onCloseDialogByName = dialogName => {
		setDialogs({
			...dialogs,
			[dialogName]: false,
		});
	};

	const onExitedDialogByName = dataType => {
		setDialogOpenedName('');

		if (dataType) {
			setDialogData({
				...dialogData,
				[dataType]: null,
			});
		}
	};

	return (
		<Container>
			<View onOpenDialogByName={onOpenDialogByName} {...props} />

			<Suspense fallback={null}>
				<DialogProcurementCreate
					type="create"
					dialogOpen={dialogs.dialogProcurementCreate}
					onCloseDialog={() => onCloseDialogByName('dialogProcurementCreate')}
					selectedProcurement={dialogOpenedName === 'dialogProcurementCreate' ? dialogData.procurement : null}
				/>

				<DialogProcurementEdit
					type="edit"
					dialogOpen={dialogs.dialogProcurementEdit}
					onCloseDialog={() => onCloseDialogByName('dialogProcurementEdit')}
					onExitedDialog={() => onExitedDialogByName('procurement')}
					selectedProcurement={dialogOpenedName === 'dialogProcurementEdit' ? dialogData.procurement : null}
				/>

				<DialogProcurementConfirm
					type="confirm"
					dialogOpen={dialogs.dialogProcurementConfirm}
					onCloseDialog={() => onCloseDialogByName('dialogProcurementConfirm')}
					onExitedDialog={() => onExitedDialogByName('procurement')}
					selectedProcurement={dialogOpenedName === 'dialogProcurementConfirm' ? dialogData.procurement : null}
				/>

				<DialogProcurementExpectedView
					dialogOpen={dialogs.dialogProcurementExpectedView}
					onCloseDialog={() => onCloseDialogByName('dialogProcurementExpectedView')}
					onExitedDialog={() => onExitedDialogByName('procurement')}
					selectedProcurementId={dialogOpenedName === 'dialogProcurementExpectedView' ? dialogData.procurement._id : null}
					onOpenDialogByName={onOpenDialogByName}
				/>

				{/*<DialogProcurementExpectedCreate*/}
				{/*	type="create"*/}
				{/*	dialogOpen={dialogs.dialogProcurementExpectedCreate}*/}
				{/*	onCloseDialog={() => onCloseDialogByName('dialogProcurementExpectedCreate')}*/}
				{/*	onExitedDialog={() => onExitedDialogByName()}*/}
				{/*/>*/}

				{/*<DialogProcurementExpectedConfirm*/}
				{/*	type="confirm"*/}
				{/*	dialogOpen={dialogs.dialogProcurementExpectedConfirm}*/}
				{/*	onCloseDialog={() => onCloseDialogByName('dialogProcurementExpectedConfirm')}*/}
				{/*	onExitedDialog={() => onExitedDialogByName('procurementExpected')}*/}
				{/*	selectedProcurement={dialogOpenedName === 'dialogProcurementExpectedConfirm' ? dialogData.procurementExpected : null}*/}
				{/*/>*/}

				{/*<DialogProcurementExpectedEdit*/}
				{/*	type="edit"*/}
				{/*	dialogOpen={dialogs.dialogProcurementExpectedEdit}*/}
				{/*	onCloseDialog={() => onCloseDialogByName('dialogProcurementExpectedEdit')}*/}
				{/*	onExitedDialog={() => onExitedDialogByName('procurementExpected')}*/}
				{/*	selectedProcurement={dialogOpenedName === 'dialogProcurementExpectedEdit' ? dialogData.procurementExpected : null}*/}
				{/*/>*/}

				<DialogProcurementExpectedCancel
					dialogOpen={dialogs.dialogProcurementExpectedCancel}
					onCloseDialog={() => onCloseDialogByName('dialogProcurementExpectedCancel')}
					onExitedDialog={() => onExitedDialogByName('procurement')}
					selectedProcurement={dialogOpenedName === 'dialogProcurementExpectedCancel' ? dialogData.procurement : null}
				/>

				{/*<DialogProcurementReceivedCreate*/}
				{/*	dialogOpen={dialogs.dialogProcurementReceivedCreate}*/}
				{/*	onCloseDialog={() => onCloseDialogByName('dialogProcurementReceivedCreate')}*/}
				{/*	currentStudio={currentStudio}*/}
				{/*	onExitedDialog={() => onExitedDialogByName('procurementReceived')}*/}
				{/*	selectedProcurement={dialogOpenedName === 'dialogProcurementReceivedCreate' ? dialogData.procurementReceived : null}*/}
				{/*/>*/}
			</Suspense>
		</Container>
	);
};

export default Index;
