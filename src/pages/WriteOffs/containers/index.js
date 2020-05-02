import React, { useState } from 'react';
import loadable from '@loadable/component';

import Container from '@material-ui/core/Container';

import View from './View';

const DialogWriteOffCancel = loadable(() => import('src/pages/Dialogs/WriteOffCancel' /* webpackChunkName: "Dialog_WriteOffCancel" */));

const Index = props => {
	const [dialogData, setDialogData] = useState({
		writeOff: null,
	});
	const [dialogOpenedName, setDialogOpenedName] = useState('');
	const [dialogs, setDialogs] = useState({
		dialogWriteOffCancel: false,
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

			<DialogWriteOffCancel
				dialogOpen={dialogs.dialogWriteOffCancel}
				onCloseDialog={() => onCloseDialogByName(false)}
				onExitedDialog={() => onExitedDialogByName('writeOff')}
				selectedInvoice={dialogOpenedName === 'dialogWriteOffCancel' ? dialogData.writeOff : null}
			/>
		</Container>
	);
};

export default Index;
