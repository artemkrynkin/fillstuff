import React, { useState } from 'react';
import loadable from '@loadable/component';

import Container from '@material-ui/core/Container';

import View from './View';

const DialogInvoicePaymentCreate = loadable(() =>
	import('src/pages/Dialogs/InvoicePaymentCreate' /* webpackChunkName: "Dialog_InvoicePaymentCreate" */)
);

const Index = props => {
	const { getInvoice } = props;
	const [dialogData, setDialogData] = useState({
		invoice: null,
	});
	const [dialogOpenedName, setDialogOpenedName] = useState('');
	const [dialogs, setDialogs] = useState({
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

			<DialogInvoicePaymentCreate
				dialogOpen={dialogs.dialogInvoicePaymentCreate}
				onCloseDialog={() => onCloseDialogByName('dialogInvoicePaymentCreate')}
				onExitedDialog={() => onExitedDialogByName('invoice')}
				onCallback={getInvoice}
				selectedInvoice={dialogOpenedName === 'dialogInvoicePaymentCreate' ? dialogData.invoice : null}
			/>
		</Container>
	);
};

export default Index;
