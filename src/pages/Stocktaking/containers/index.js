import React, { useState } from 'react';
// import loadable from '@loadable/component';

import Container from '@material-ui/core/Container';

import View from './View';

const Index = props => {
	// const { currentStudio } = props;
	const [dialogData, setDialogData] = useState({
		// procurementReceived: null,
	});
	// const [dialogOpenedName, setDialogOpenedName] = useState('');
	const [dialogs, setDialogs] = useState({
		// dialogProcurementReceivedCreate: false,
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

	// const onCloseDialogByName = dialogName => {
	// 	setDialogs({
	// 		...dialogs,
	// 		[dialogName]: false,
	// 	});
	// };
	//
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
		</Container>
	);
};

export default Index;
