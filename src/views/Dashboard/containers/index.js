import React, { useState, lazy, Suspense } from 'react';

import Container from '@material-ui/core/Container';

import View from './View';

const DialogPositionEnded = lazy(() => import('src/views/Dialogs/PositionEnded'));
const DialogProcurementExpectedView = lazy(() => import('src/views/Dialogs/ProcurementExpectedView'));
const DialogProcurementExpectedCreate = lazy(() => import('src/views/Dialogs/ProcurementExpectedCreateConfirmEdit'));
const DialogProcurementExpectedConfirm = lazy(() => import('src/views/Dialogs/ProcurementExpectedCreateConfirmEdit'));
const DialogProcurementExpectedEdit = lazy(() => import('src/views/Dialogs/ProcurementExpectedCreateConfirmEdit'));
const DialogProcurementExpectedCancel = lazy(() => import('src/views/Dialogs/ProcurementExpectedCancel'));
const DialogProcurementReceivedCreate = lazy(() => import('src/views/Dialogs/ProcurementReceivedCreate'));
const DialogInvoicePaymentCreate = lazy(() => import('src/views/Dialogs/InvoicePaymentCreate'));

const Index = props => {
	const { currentStudio } = props;
	const [dialogData, setDialogData] = useState({
		storeNotification: null,
		procurementExpected: null,
		procurementReceived: null,
		invoice: null,
	});
	const [dialogOpenedName, setDialogOpenedName] = useState('');
	const [dialogs, setDialogs] = useState({
		dialogPositionEnded: false,
		dialogProcurementExpectedView: false,
		dialogProcurementExpectedCreate: false,
		dialogProcurementExpectedConfirm: false,
		dialogProcurementExpectedEdit: false,
		dialogProcurementExpectedCancel: false,
		dialogProcurementReceivedCreate: false,
		dialogInvoicePaymentCreate: false,
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
				<DialogPositionEnded
					dialogOpen={dialogs.dialogPositionEnded}
					onCloseDialog={() => onCloseDialogByName('dialogPositionEnded')}
					onExitedDialog={() => onExitedDialogByName('storeNotification')}
					selectedStoreNotificationId={dialogOpenedName === 'dialogPositionEnded' ? dialogData.storeNotification._id : null}
					onOpenDialogByName={onOpenDialogByName}
				/>

				<DialogProcurementExpectedView
					dialogOpen={dialogs.dialogProcurementExpectedView}
					onCloseDialog={() => onCloseDialogByName('dialogProcurementExpectedView')}
					onExitedDialog={() => onExitedDialogByName('procurementExpected')}
					selectedProcurementId={dialogOpenedName === 'dialogProcurementExpectedView' ? dialogData.procurementExpected._id : null}
					onOpenDialogByName={onOpenDialogByName}
				/>

				<DialogProcurementExpectedCreate
					type="create"
					dialogOpen={dialogs.dialogProcurementExpectedCreate}
					onCloseDialog={() => onCloseDialogByName('dialogProcurementExpectedCreate')}
					onExitedDialog={() => onExitedDialogByName('procurementExpected')}
					selectedProcurement={dialogOpenedName === 'dialogProcurementExpectedCreate' ? dialogData.procurementExpected : null}
				/>

				<DialogProcurementExpectedConfirm
					type="confirm"
					dialogOpen={dialogs.dialogProcurementExpectedConfirm}
					onCloseDialog={() => onCloseDialogByName('dialogProcurementExpectedConfirm')}
					onExitedDialog={() => onExitedDialogByName('procurementExpected')}
					selectedProcurement={dialogOpenedName === 'dialogProcurementExpectedConfirm' ? dialogData.procurementExpected : null}
				/>

				<DialogProcurementExpectedEdit
					type="edit"
					dialogOpen={dialogs.dialogProcurementExpectedEdit}
					onCloseDialog={() => onCloseDialogByName('dialogProcurementExpectedEdit')}
					onExitedDialog={() => onExitedDialogByName('procurementExpected')}
					selectedProcurement={dialogOpenedName === 'dialogProcurementExpectedEdit' ? dialogData.procurementExpected : null}
				/>

				<DialogProcurementExpectedCancel
					dialogOpen={dialogs.dialogProcurementExpectedCancel}
					onCloseDialog={() => onCloseDialogByName('dialogProcurementExpectedCancel')}
					onExitedDialog={() => onExitedDialogByName('procurementExpected')}
					selectedProcurement={dialogOpenedName === 'dialogProcurementExpectedCancel' ? dialogData.procurementExpected : null}
				/>

				<DialogProcurementReceivedCreate
					dialogOpen={dialogs.dialogProcurementReceivedCreate}
					onCloseDialog={() => onCloseDialogByName('dialogProcurementReceivedCreate')}
					currentStudio={currentStudio}
					onExitedDialog={() => onExitedDialogByName('procurementReceived')}
					selectedProcurement={dialogOpenedName === 'dialogProcurementReceivedCreate' ? dialogData.procurementReceived : null}
				/>

				<DialogInvoicePaymentCreate
					dialogOpen={dialogs.dialogInvoicePaymentCreate}
					onCloseDialog={() => onCloseDialogByName('dialogInvoicePaymentCreate')}
					onExitedDialog={() => onExitedDialogByName('invoice')}
					selectedInvoice={dialogOpenedName === 'dialogInvoicePaymentCreate' ? dialogData.invoice : null}
				/>
			</Suspense>
		</Container>
	);
};

export default Index;
