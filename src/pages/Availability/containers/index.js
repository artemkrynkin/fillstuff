import React, { useState } from 'react';
import loadable from '@loadable/component';

import Container from '@material-ui/core/Container';

import View from './View';

const DialogPositionGroupCreateEditAdd = loadable(() =>
	import('src/pages/Dialogs/PositionGroupCreateEditAdd' /* webpackChunkName: "Dialog_PositionGroupCreateEditAdd" */)
);

const DialogPositionGroupEdit = DialogPositionGroupCreateEditAdd;

const DialogPositionGroupAdd = DialogPositionGroupCreateEditAdd;

const DialogPositionCreate = loadable(() =>
	import('src/pages/Dialogs/PositionCreateEdit' /* webpackChunkName: "Dialog_PositionCreateEdit" */)
);

const DialogPositionEdit = loadable(() =>
	import('src/pages/Dialogs/PositionCreateEdit' /* webpackChunkName: "Dialog_PositionCreateEdit" */)
);

const DialogPositionRemoveFromGroup = loadable(() =>
	import('src/pages/Dialogs/PositionRemoveFromGroup' /* webpackChunkName: "Dialog_PositionRemoveFromGroup" */)
);

const DialogPositionArchiveDelete = loadable(() =>
	import('src/pages/Dialogs/PositionArchiveDelete' /* webpackChunkName: "Dialog_PositionArchiveDelete" */)
);

const DialogPositionOrGroupQRCode = loadable(() =>
	import('src/pages/Dialogs/PositionOrGroupQRCode' /* webpackChunkName: "Dialog_PositionOrGroupQRCode" */)
);

const DialogPositionGroupQRCode = DialogPositionOrGroupQRCode;

const DialogPositionQRCode = DialogPositionOrGroupQRCode;

const DialogReceiptActiveAddQuantity = loadable(() =>
	import('src/pages/Dialogs/ReceiptActiveAddQuantity' /* webpackChunkName: "Dialog_ReceiptActiveAddQuantity" */)
);

const DialogReceiptCreate = loadable(() => import('src/pages/Dialogs/ReceiptCreate' /* webpackChunkName: "Dialog_ReceiptCreate" */));

const DialogWriteOffCreate = loadable(() => import('src/pages/Dialogs/WriteOffCreate' /* webpackChunkName: "Dialog_WriteOffCreate" */));

const Index = props => {
	const [dialogData, setDialogData] = useState({
		positionGroup: null,
		position: null,
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
		dialogPositionQRCode: false,
		dialogReceiptActiveAddQuantity: false,
		dialogReceiptCreate: false,
		dialogWriteOffCreate: false,
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

			<DialogWriteOffCreate
				dialogOpen={dialogs.dialogWriteOffCreate}
				onCloseDialog={() => onCloseDialogByName('dialogWriteOffCreate')}
				onExitedDialog={() => onExitedDialogByName('position')}
				selectedPosition={dialogOpenedName === 'dialogWriteOffCreate' ? dialogData.position : null}
			/>
		</Container>
	);
};

export default Index;
