import React, { useState, lazy, Suspense } from 'react';

import Container from '@material-ui/core/Container';

import View from './View';

const DialogPositionEnded = lazy(() => import('src/views/Dialogs/PositionEnded'));
const DialogInvoicePaymentCreate = lazy(() => import('src/views/Dialogs/InvoicePaymentCreate'));
const DialogProcurementCreate = lazy(() => import('src/views/Dialogs/ProcurementCreateEdit'));
const DialogProcurementEdit = lazy(() => import('src/views/Dialogs/ProcurementCreateEdit'));
const DialogProcurementConfirm = lazy(() => import('src/views/Dialogs/ProcurementCreateEdit'));
const DialogProcurementExpectedView = lazy(() => import('src/views/Dialogs/ProcurementExpectedView'));
const DialogProcurementExpectedCancel = lazy(() => import('src/views/Dialogs/ProcurementExpectedCancel'));

const Index = props => {
	const [dialogData, setDialogData] = useState({
		storeNotification: null,
		invoice: null,
		procurement: null,
	});
	const [dialogOpenedName, setDialogOpenedName] = useState('');
	const [dialogs, setDialogs] = useState({
		dialogPositionEnded: false,
		dialogInvoicePaymentCreate: false,
		dialogProcurementCreate: false,
		dialogProcurementEdit: false,
		dialogProcurementConfirm: false,
		dialogProcurementExpectedView: false,
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
				<DialogPositionEnded
					dialogOpen={dialogs.dialogPositionEnded}
					onCloseDialog={() => onCloseDialogByName('dialogPositionEnded')}
					onExitedDialog={() => onExitedDialogByName('storeNotification')}
					selectedStoreNotificationId={dialogOpenedName === 'dialogPositionEnded' ? dialogData.storeNotification._id : null}
					onOpenDialogByName={onOpenDialogByName}
				/>

				<DialogInvoicePaymentCreate
					dialogOpen={dialogs.dialogInvoicePaymentCreate}
					onCloseDialog={() => onCloseDialogByName('dialogInvoicePaymentCreate')}
					onExitedDialog={() => onExitedDialogByName('invoice')}
					selectedInvoice={dialogOpenedName === 'dialogInvoicePaymentCreate' ? dialogData.invoice : null}
				/>

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

				<DialogProcurementExpectedCancel
					dialogOpen={dialogs.dialogProcurementExpectedCancel}
					onCloseDialog={() => onCloseDialogByName('dialogProcurementExpectedCancel')}
					onExitedDialog={() => onExitedDialogByName('procurement')}
					selectedProcurement={dialogOpenedName === 'dialogProcurementExpectedCancel' ? dialogData.procurement : null}
				/>
			</Suspense>
		</Container>
	);
};

export default Index;
