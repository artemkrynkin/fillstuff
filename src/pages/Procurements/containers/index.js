import React, { useState } from 'react';
import loadable from '@loadable/component';

import Container from '@material-ui/core/Container';

import View from './View';

const DialogProcurementExpectedCreate = loadable(() =>
	import('src/pages/Dialogs/ProcurementExpectedCreate' /* webpackChunkName: "Dialog_ProcurementExpectedCreate" */)
);

const DialogProcurementReceivedCreate = loadable(() =>
	import('src/pages/Dialogs/ProcurementReceivedCreate' /* webpackChunkName: "Dialog_ProcurementReceivedCreate" */)
);

const Index = props => {
	const { currentStudio } = props;
	const [dialogs, setDialogs] = useState({
		dialogProcurementExpectedCreate: false,
		dialogProcurementReceivedCreate: false,
	});

	const onOpenDialogByName = dialogName => {
		setDialogs({
			...dialogs,
			[dialogName]: true,
		});
	};

	const onCloseDialogByName = dialogName => {
		setDialogs({
			...dialogs,
			[dialogName]: false,
		});
	};

	return (
		<Container>
			<View onOpenDialogByName={onOpenDialogByName} {...props} />

			<DialogProcurementExpectedCreate
				dialogOpen={dialogs.dialogProcurementExpectedCreate}
				onCloseDialog={() => onCloseDialogByName('dialogProcurementExpectedCreate')}
			/>

			<DialogProcurementReceivedCreate
				dialogOpen={dialogs.dialogProcurementReceivedCreate}
				onCloseDialog={() => onCloseDialogByName('dialogProcurementReceivedCreate')}
				currentStudio={currentStudio}
			/>
		</Container>
	);
};

export default Index;
