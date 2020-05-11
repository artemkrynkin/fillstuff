import React, { useState } from 'react';
import loadable from '@loadable/component';

import Container from '@material-ui/core/Container';

import View from './View';

const DialogProcurementExpectedCreate = loadable(() =>
	import('src/pages/Dialogs/ProcurementExpectedCreateEdit' /* webpackChunkName: "Dialog_ProcurementExpectedCreateEdit" */)
);

const DialogProcurementExpectedEdit = loadable(() =>
	import('src/pages/Dialogs/ProcurementExpectedCreateEdit' /* webpackChunkName: "Dialog_ProcurementExpectedCreateEdit" */)
);

const DialogProcurementReceivedCreate = loadable(() =>
	import('src/pages/Dialogs/ProcurementReceivedCreate' /* webpackChunkName: "Dialog_ProcurementReceivedCreate" */)
);

const Index = props => {
	const { currentStudio } = props;
	const [dialogData, setDialogData] = useState({
		procurementExpected: null,
		procurementReceived: null,
	});
	const [dialogOpenedName, setDialogOpenedName] = useState('');
	const [dialogs, setDialogs] = useState({
		dialogProcurementExpectedCreate: false,
		dialogProcurementExpectedEdit: false,
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

			<DialogProcurementExpectedCreate
				type="create"
				dialogOpen={dialogs.dialogProcurementExpectedCreate}
				onCloseDialog={() => onCloseDialogByName('dialogProcurementExpectedCreate')}
				onExitedDialog={() => onExitedDialogByName()}
			/>

			<DialogProcurementExpectedEdit
				type="edit"
				dialogOpen={dialogs.dialogProcurementExpectedEdit}
				onCloseDialog={() => onCloseDialogByName('dialogProcurementExpectedEdit')}
				onExitedDialog={() => onExitedDialogByName('procurementExpected')}
				selectedProcurement={dialogOpenedName === 'dialogProcurementExpectedEdit' ? dialogData.procurementExpected : null}
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
