import React, { lazy, Suspense, useState } from 'react';

import Container from '@material-ui/core/Container';

import View from './View';

const DialogStudioCreate = lazy(() => import('src/views/Dialogs/StudioCreate'));

const Index = props => {
	const [dialogData, setDialogData] = useState({
		// studio: null,
	});
	// const [dialogOpenedName, setDialogOpenedName] = useState('');
	const [dialogs, setDialogs] = useState({
		dialogStudioCreate: false,
	});

	const onOpenDialogByName = (dialogName, dataType, data) => {
		// setDialogOpenedName(dialogName);

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

	// const onExitedDialogByName = dataType => {
	// 	setDialogOpenedName('');
	//
	// 	if (dataType) {
	// 		setDialogData({
	// 			...dialogData,
	// 			[dataType]: null,
	// 		});
	// 	}
	// };

	return (
		<Container>
			<View onOpenDialogByName={onOpenDialogByName} {...props} />

			<Suspense fallback={null}>
				<DialogStudioCreate dialogOpen={dialogs.dialogStudioCreate} onCloseDialog={() => onCloseDialogByName('dialogStudioCreate')} />
			</Suspense>
		</Container>
	);
};

export default Index;
