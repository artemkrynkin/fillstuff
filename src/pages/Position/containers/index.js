import React, { useState } from 'react';
import loadable from '@loadable/component';

import Container from '@material-ui/core/Container';

import history from 'src/helpers/history';

import View from './View';

const DialogPositionEdit = loadable(() =>
	import('src/pages/Dialogs/PositionCreateEdit' /* webpackChunkName: "Dialog_PositionCreateEdit" */)
);

const DialogPositionRemoveFromGroup = loadable(() =>
	import('src/pages/Dialogs/PositionRemoveFromGroup' /* webpackChunkName: "Dialog_PositionRemoveFromGroup" */)
);

const DialogPositionQRCode = loadable(() =>
	import('src/pages/Dialogs/PositionOrGroupQRCode' /* webpackChunkName: "Dialog_PositionOrGroupQRCode" */)
);

const DialogPositionArchiveDelete = loadable(() =>
	import('src/pages/Dialogs/PositionArchiveDelete' /* webpackChunkName: "Dialog_PositionArchiveDelete" */)
);

const DialogPositionDetach = loadable(() => import('src/pages/Dialogs/PositionDetach' /* webpackChunkName: "Dialog_PositionDetach" */));

const DialogReceiptCreate = loadable(() => import('src/pages/Dialogs/ReceiptCreate' /* webpackChunkName: "Dialog_ReceiptCreate" */));

const DialogReceiptConfirmCreate = loadable(() =>
	import('src/pages/Dialogs/ReceiptConfirmCreate' /* webpackChunkName: "Dialog_ReceiptConfirmCreate" */)
);

const DialogProcurementReceivedCreate = loadable(() =>
	import('src/pages/Dialogs/ProcurementReceivedCreate' /* webpackChunkName: "Dialog_ProcurementReceivedCreate" */)
);

const Index = props => {
	const { currentStudio, getPosition, getReceipts, onReceiptCreate } = props;
	const [dialogData, setDialogData] = useState({
		position: null,
		procurementReceived: null,
	});
	const [dialogOpenedName, setDialogOpenedName] = useState('');
	const [dialogs, setDialogs] = useState({
		dialogPositionEdit: false,
		dialogPositionRemoveFromGroup: false,
		dialogPositionArchiveDelete: false,
		dialogPositionDetach: false,
		dialogPositionQRCode: false,
		dialogReceiptCreate: false,
		dialogReceiptConfirmCreate: false,
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

	const onBackStock = () => {
		history.push({
			pathname: '/stock',
		});
	};

	return (
		<Container>
			<View onOpenDialogByName={onOpenDialogByName} {...props} />

			{/* Dialogs Positions */}
			<DialogPositionEdit
				type="edit"
				dialogOpen={dialogs.dialogPositionEdit}
				onCloseDialog={() => onCloseDialogByName('dialogPositionEdit')}
				onExitedDialog={() => onExitedDialogByName('position')}
				onCallback={() => {
					const oldPosition = props.positionData.data ? { ...props.positionData.data } : null;

					getPosition(response => {
						const newPosition = response.data ? response.data : null;

						if (oldPosition && newPosition && oldPosition.isFree !== newPosition.isFree) {
							getReceipts();
						}
					});
				}}
				selectedPosition={dialogOpenedName === 'dialogPositionEdit' ? dialogData.position : null}
			/>

			<DialogPositionRemoveFromGroup
				dialogOpen={dialogs.dialogPositionRemoveFromGroup}
				onCloseDialog={() => onCloseDialogByName('dialogPositionRemoveFromGroup')}
				onExitedDialog={() => onExitedDialogByName('position')}
				selectedPosition={dialogOpenedName === 'dialogPositionRemoveFromGroup' ? dialogData.position : null}
			/>

			<DialogPositionArchiveDelete
				dialogOpen={dialogs.dialogPositionArchiveDelete}
				onCloseDialog={() => onCloseDialogByName('dialogPositionArchiveDelete')}
				onExitedDialog={() => onExitedDialogByName('position')}
				onCallback={response => {
					if (response.status === 'success' && response.data) {
						getPosition();
					} else {
						onBackStock();
					}
				}}
				selectedPosition={dialogOpenedName === 'dialogPositionArchiveDelete' ? dialogData.position : null}
			/>

			<DialogPositionDetach
				dialogOpen={dialogs.dialogPositionDetach}
				onCloseDialog={() => onCloseDialogByName('dialogPositionDetach')}
				onExitedDialog={() => onExitedDialogByName('position')}
				onCallback={response => {
					if (response.status === 'success' && response.data) {
						getPosition();
					} else {
						onBackStock();
					}
				}}
				selectedPosition={dialogOpenedName === 'dialogPositionDetach' ? dialogData.position : null}
			/>

			<DialogPositionQRCode
				dialogOpen={dialogs.dialogPositionQRCode}
				onCloseDialog={() => onCloseDialogByName('dialogPositionQRCode')}
				onExitedDialog={() => onExitedDialogByName('position')}
				type="position"
				selectedPositionOrGroup={dialogOpenedName === 'dialogPositionQRCode' ? dialogData.position : null}
			/>

			<DialogReceiptCreate
				dialogOpen={dialogs.dialogReceiptCreate}
				onCloseDialog={() => onCloseDialogByName('dialogReceiptCreate')}
				onExitedDialog={() => onExitedDialogByName('position')}
				onCallback={onReceiptCreate}
				selectedPosition={dialogOpenedName === 'dialogReceiptCreate' ? dialogData.position : null}
			/>

			<DialogReceiptConfirmCreate
				dialogOpen={dialogs.dialogReceiptConfirmCreate}
				onCloseDialog={() => onCloseDialogByName('dialogReceiptConfirmCreate')}
				onExitedDialog={() => onExitedDialogByName('position')}
				selectedPosition={dialogOpenedName === 'dialogReceiptConfirmCreate' ? dialogData.position : null}
				onOpenDialogByName={onOpenDialogByName}
			/>

			{/* Procurement */}
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
