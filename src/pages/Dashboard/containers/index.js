import React, { useState } from 'react';

import Container from '@material-ui/core/Container';

import View from './View';
import loadable from '@loadable/component';

const DialogPositionEnded = loadable(() => import('src/pages/Dialogs/PositionEnded' /* webpackChunkName: "Dialog_PositionEnded" */));

const DialogProcurementExpectedView = loadable(() =>
	import('src/pages/Dialogs/ProcurementExpectedView' /* webpackChunkName: "Dialog_ProcurementExpectedView" */)
);

const DialogProcurementExpectedCreate = loadable(() =>
	import('src/pages/Dialogs/ProcurementExpectedCreateConfirmEdit' /* webpackChunkName: "Dialog_ProcurementExpectedCreateConfirmEdit" */)
);

const DialogProcurementExpectedConfirm = loadable(() =>
	import('src/pages/Dialogs/ProcurementExpectedCreateConfirmEdit' /* webpackChunkName: "Dialog_ProcurementExpectedCreateConfirmEdit" */)
);

const DialogProcurementExpectedEdit = loadable(() =>
	import('src/pages/Dialogs/ProcurementExpectedCreateConfirmEdit' /* webpackChunkName: "Dialog_ProcurementExpectedCreateConfirmEdit" */)
);

const DialogProcurementExpectedCancel = loadable(() =>
	import('src/pages/Dialogs/ProcurementExpectedCancel' /* webpackChunkName: "Dialog_ProcurementExpectedCancel" */)
);

const DialogProcurementReceivedCreate = loadable(() =>
	import('src/pages/Dialogs/ProcurementReceivedCreate' /* webpackChunkName: "Dialog_ProcurementReceivedCreate" */)
);

const DialogInvoicePaymentCreate = loadable(() =>
	import('src/pages/Dialogs/InvoicePaymentCreate' /* webpackChunkName: "Dialog_InvoicePaymentCreate" */)
);

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
		</Container>
	);
};

export default Index;
