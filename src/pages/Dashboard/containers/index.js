import React, { useState } from 'react';

import Container from '@material-ui/core/Container';

import View from './View';
import loadable from '@loadable/component';

const DialogPositionEnded = loadable(() => import('src/pages/Dialogs/PositionEnded' /* webpackChunkName: "Dialog_PositionEnded" */));

const DialogProcurementExpectedCreate = loadable(() =>
	import('src/pages/Dialogs/ProcurementExpectedCreateEdit' /* webpackChunkName: "Dialog_ProcurementExpectedCreateEdit" */)
);

const DialogProcurementReceivedCreate = loadable(() =>
	import('src/pages/Dialogs/ProcurementReceivedCreate' /* webpackChunkName: "Dialog_ProcurementReceivedCreate" */)
);

const Index = props => {
	const { currentStudio } = props;
	const [dialogData, setDialogData] = useState({
		storeNotification: null,
		procurementExpected: null,
		procurementReceived: null,
	});
	const [dialogOpenedName, setDialogOpenedName] = useState('');
	const [dialogs, setDialogs] = useState({
		dialogPositionEnded: false,
		dialogProcurementExpectedCreate: false,
		dialogProcurementReceivedCreate: false,
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

			<DialogProcurementExpectedCreate
				type="create"
				dialogOpen={dialogs.dialogProcurementExpectedCreate}
				onCloseDialog={() => onCloseDialogByName('dialogProcurementExpectedCreate')}
				onExitedDialog={() => onExitedDialogByName('procurementExpected')}
				selectedProcurement={dialogOpenedName === 'dialogProcurementExpectedCreate' ? dialogData.procurementExpected : null}
			/>

			<DialogProcurementReceivedCreate
				dialogOpen={dialogs.dialogProcurementReceivedCreate}
				onCloseDialog={() => onCloseDialogByName('dialogProcurementReceivedCreate')}
				currentStudio={currentStudio}
				onExitedDialog={() => onExitedDialogByName('procurementReceived')}
				selectedProcurement={dialogOpenedName === 'dialogProcurementReceivedCreate' ? dialogData.procurementReceived : null}
			/>
		</Container>
	);
};

export default Index;
