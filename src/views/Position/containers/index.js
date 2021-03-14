import React, { useState, lazy, Suspense } from 'react';

import Container from '@material-ui/core/Container';

import history from 'src/helpers/history';

import View from './View';

const DialogPositionEdit = lazy(() => import('src/views/Dialogs/PositionCreateEdit'));
const DialogPositionRemoveFromGroup = lazy(() => import('src/views/Dialogs/PositionRemoveFromGroup'));
const DialogPositionQRCode = lazy(() => import('src/views/Dialogs/PositionOrGroupQRCode'));
const DialogPositionArchiveDelete = lazy(() => import('src/views/Dialogs/PositionArchiveDelete'));
const DialogPositionDetach = lazy(() => import('src/views/Dialogs/PositionDetach'));
const DialogReceiptCreate = lazy(() => import('src/views/Dialogs/ReceiptCreate'));
const DialogReceiptConfirmCreate = lazy(() => import('src/views/Dialogs/ReceiptConfirmCreate'));
const DialogProcurementCreate = lazy(() => import('src/views/Dialogs/ProcurementCreateEdit'));

const Index = props => {
	const { getPosition, getReceipts, onReceiptCreate } = props;
	const [dialogData, setDialogData] = useState({
		position: null,
		procurement: null,
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

	const onBackStock = () => {
		history.push({
			pathname: '/stock',
		});
	};

	return (
		<Container>
			<View onOpenDialogByName={onOpenDialogByName} {...props} />

			<Suspense fallback={null}>
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
