import React, { useState, lazy, Suspense } from 'react';

import Container from '@material-ui/core/Container';

import View from './View';

const DialogWriteOffCancel = lazy(() => import('src/pages/Dialogs/WriteOffCancel'));

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

			<Suspense fallback={null}>
				<DialogWriteOffCancel
					dialogOpen={dialogs.dialogWriteOffCancel}
					onCloseDialog={() => onCloseDialogByName('dialogWriteOffCancel')}
					onExitedDialog={() => onExitedDialogByName('writeOff')}
					selectedWriteOff={dialogOpenedName === 'dialogWriteOffCancel' ? dialogData.writeOff : null}
				/>
			</Suspense>
		</Container>
	);
};

export default Index;
