import React, { useState, lazy, Suspense } from 'react';

import Container from '@material-ui/core/Container';

import View from './View';

const DialogPositionGroupCreateEditAdd = lazy(() => import('src/views/Dialogs/PositionGroupCreateEditAdd'));
const DialogPositionGroupEdit = DialogPositionGroupCreateEditAdd;
const DialogPositionGroupAdd = DialogPositionGroupCreateEditAdd;
const DialogPositionCreate = lazy(() => import('src/views/Dialogs/PositionCreateEdit'));
const DialogPositionEdit = lazy(() => import('src/views/Dialogs/PositionCreateEdit'));
const DialogPositionRemoveFromGroup = lazy(() => import('src/views/Dialogs/PositionRemoveFromGroup'));
const DialogPositionArchiveDelete = lazy(() => import('src/views/Dialogs/PositionArchiveDelete'));
const DialogPositionDetach = lazy(() => import('src/views/Dialogs/PositionDetach'));
const DialogPositionOrGroupQRCode = lazy(() => import('src/views/Dialogs/PositionOrGroupQRCode'));
const DialogPositionGroupQRCode = DialogPositionOrGroupQRCode;
const DialogPositionQRCode = DialogPositionOrGroupQRCode;
const DialogReceiptActiveAddQuantity = lazy(() => import('src/views/Dialogs/ReceiptActiveAddQuantity'));
const DialogReceiptCreate = lazy(() => import('src/views/Dialogs/ReceiptCreate'));
const DialogReceiptConfirmCreate = lazy(() => import('src/views/Dialogs/ReceiptConfirmCreate'));
const DialogWriteOffCreate = lazy(() => import('src/views/Dialogs/WriteOffCreate'));
const DialogProcurementCreate = lazy(() => import('src/views/Dialogs/ProcurementCreateEdit'));

const Index = props => {
	const [dialogData, setDialogData] = useState({
		positionGroup: null,
		position: null,
		procurement: null,
	});
	const [dialogOpenedName, setDialogOpenedName] = useState('');
	const [dialogs, setDialogs] = useState({
		dialogPositionGroupEdit: false,
		dialogPositionGroupAdd: false,
		dialogPositionGroupQRCode: false,
		dialogPositionCreate: false,
		dialogPositionEdit: false,
		dialogPositionRemoveFromGroup: false,
		dialogPositionArchiveDelete: false,
		dialogPositionDetach: false,
		dialogPositionQRCode: true,
		dialogReceiptActiveAddQuantity: false,
		dialogReceiptCreate: false,
		dialogReceiptConfirmCreate: false,
		dialogWriteOffCreate: false,
		dialogProcurementCreate: false,
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
				{/* Dialogs PositionGroups */}
				<DialogPositionGroupEdit
					type="edit"
					dialogOpen={dialogs.dialogPositionGroupEdit}
					onCloseDialog={() => onCloseDialogByName('dialogPositionGroupEdit')}
					onExitedDialog={() => onExitedDialogByName('positionGroup')}
					selectedPositionGroup={dialogOpenedName === 'dialogPositionGroupEdit' ? dialogData.positionGroup : null}
				/>

				<DialogPositionGroupAdd
					type="add"
					dialogOpen={dialogs.dialogPositionGroupAdd}
					onCloseDialog={() => onCloseDialogByName('dialogPositionGroupAdd')}
					onExitedDialog={() => onExitedDialogByName('positionGroup')}
					selectedPositionGroup={dialogOpenedName === 'dialogPositionGroupAdd' ? dialogData.positionGroup : null}
				/>

				<DialogPositionGroupQRCode
					dialogOpen={dialogs.dialogPositionGroupQRCode}
					onCloseDialog={() => onCloseDialogByName('dialogPositionGroupQRCode')}
					onExitedDialog={() => onExitedDialogByName('positionGroup')}
					type="positionGroup"
					selectedPositionOrGroup={dialogOpenedName === 'dialogPositionGroupQRCode' ? dialogData.positionGroup : null}
				/>

				{/* Dialogs Positions */}
				<DialogPositionCreate
					type="create"
					dialogOpen={dialogs.dialogPositionCreate}
					onCloseDialog={() => onCloseDialogByName('dialogPositionCreate')}
					onExitedDialog={() => onExitedDialogByName('position')}
				/>

				<DialogPositionEdit
					type="edit"
					dialogOpen={dialogs.dialogPositionEdit}
					onCloseDialog={() => onCloseDialogByName('dialogPositionEdit')}
					onExitedDialog={() => onExitedDialogByName('position')}
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
					selectedPosition={dialogOpenedName === 'dialogPositionArchiveDelete' ? dialogData.position : null}
				/>

				<DialogPositionDetach
					dialogOpen={dialogs.dialogPositionDetach}
					onCloseDialog={() => onCloseDialogByName('dialogPositionDetach')}
					onExitedDialog={() => onExitedDialogByName('position')}
					selectedPosition={dialogOpenedName === 'dialogPositionDetach' ? dialogData.position : null}
				/>

				<DialogPositionQRCode
					dialogOpen={dialogs.dialogPositionQRCode}
					onCloseDialog={() => onCloseDialogByName('dialogPositionQRCode')}
					onExitedDialog={() => onExitedDialogByName('position')}
					type="position"
					selectedPositionOrGroup={dialogOpenedName === 'dialogPositionQRCode' ? dialogData.position : null}
				/>

				<DialogReceiptActiveAddQuantity
					dialogOpen={dialogs.dialogReceiptActiveAddQuantity}
					onCloseDialog={() => onCloseDialogByName('dialogReceiptActiveAddQuantity')}
					onExitedDialog={() => onExitedDialogByName('position')}
					selectedPosition={dialogOpenedName === 'dialogReceiptActiveAddQuantity' ? dialogData.position : null}
				/>

				<DialogReceiptCreate
					dialogOpen={dialogs.dialogReceiptCreate}
					onCloseDialog={() => onCloseDialogByName('dialogReceiptCreate')}
					onExitedDialog={() => onExitedDialogByName('position')}
					selectedPosition={dialogOpenedName === 'dialogReceiptCreate' ? dialogData.position : null}
				/>

				<DialogReceiptConfirmCreate
					dialogOpen={dialogs.dialogReceiptConfirmCreate}
					onCloseDialog={() => onCloseDialogByName('dialogReceiptConfirmCreate')}
					onExitedDialog={() => onExitedDialogByName('position')}
					selectedPosition={dialogOpenedName === 'dialogReceiptConfirmCreate' ? dialogData.position : null}
					onOpenDialogByName={onOpenDialogByName}
				/>

				<DialogWriteOffCreate
					dialogOpen={dialogs.dialogWriteOffCreate}
					onCloseDialog={() => onCloseDialogByName('dialogWriteOffCreate')}
					onExitedDialog={() => onExitedDialogByName('position')}
					selectedPosition={dialogOpenedName === 'dialogWriteOffCreate' ? dialogData.position : null}
				/>

				{/* Procurement */}
				<DialogProcurementCreate
					type="create"
					dialogOpen={dialogs.dialogProcurementCreate}
					onCloseDialog={() => onCloseDialogByName('dialogProcurementCreate')}
					selectedProcurement={dialogOpenedName === 'dialogProcurementCreate' ? dialogData.procurement : null}
				/>
			</Suspense>
		</Container>
	);
};

export default Index;
