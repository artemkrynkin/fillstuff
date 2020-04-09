import React, { useState } from 'react';
import loadable from '@loadable/component';

import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import { history } from 'src/helpers/history';

import PositionDetails from './PositionDetails';
import Receipts from './Receipts';

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

const DialogReceiptCreate = loadable(() => import('src/pages/Dialogs/ReceiptCreate' /* webpackChunkName: "Dialog_ReceiptCreate" */));

const Index = props => {
	const {
		positionData,
		receiptsData,
		getPosition,
		onCancelArchivePositionAfterEnded,
		onReceiptCreate,
		onChangeSellingPriceReceipt,
	} = props;
	const [dialogOpenedName, setDialogOpenedName] = useState('');
	const [dialogs, setDialogs] = useState({
		dialogPositionEdit: false,
		dialogPositionRemoveFromGroup: false,
		dialogPositionArchiveDelete: false,
		dialogPositionQRCode: false,
		dialogReceiptCreate: false,
	});

	const onOpenDialogByName = async dialogName => {
		setDialogOpenedName(dialogName);

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

	const onExitedDialogByName = () => setDialogOpenedName('');

	const onBackAvailability = () => {
		history.push({
			pathname: '/availability',
		});
	};

	if (!positionData || !positionData.data) return <div children={<CircularProgress size={20} />} style={{ textAlign: 'center' }} />;

	const { data: position } = positionData;

	return (
		<Container maxWidth="lg">
			<Grid container direction="row" justify="center" alignItems="flex-start" spacing={2}>
				<Grid item xs={12}>
					<PositionDetails
						position={position}
						onOpenDialogPosition={onOpenDialogByName}
						onCancelArchivePositionAfterEnded={onCancelArchivePositionAfterEnded}
					/>
					<Receipts
						position={position}
						receiptsData={receiptsData}
						onOpenDialogReceipt={onOpenDialogByName}
						onChangeSellingPriceReceipt={onChangeSellingPriceReceipt}
					/>
				</Grid>
			</Grid>

			<DialogPositionEdit
				type="edit"
				dialogOpen={dialogs.dialogPositionEdit}
				onCloseDialog={() => onCloseDialogByName('dialogPositionEdit')}
				onExitedDialog={onExitedDialogByName}
				onCallback={getPosition}
				selectedPosition={dialogOpenedName === 'dialogPositionEdit' ? position : null}
			/>

			<DialogPositionRemoveFromGroup
				dialogOpen={dialogs.dialogPositionRemoveFromGroup}
				onCloseDialog={() => onCloseDialogByName('dialogPositionRemoveFromGroup')}
				onExitedDialog={onExitedDialogByName}
				selectedPosition={dialogOpenedName === 'dialogPositionRemoveFromGroup' ? position : null}
			/>

			<DialogPositionArchiveDelete
				dialogOpen={dialogs.dialogPositionArchiveDelete}
				onCloseDialog={() => onCloseDialogByName('dialogPositionArchiveDelete')}
				onExitedDialog={onExitedDialogByName}
				onCallback={response => {
					if (response.status === 'success' && response.data) {
						getPosition();
					} else {
						onBackAvailability();
					}
				}}
				selectedPosition={dialogOpenedName === 'dialogPositionArchiveDelete' ? position : null}
			/>

			<DialogPositionQRCode
				dialogOpen={dialogs.dialogPositionQRCode}
				onCloseDialog={() => onCloseDialogByName('dialogPositionQRCode')}
				onExitedDialog={onExitedDialogByName}
				type="position"
				selectedPositionOrGroup={dialogOpenedName === 'dialogPositionQRCode' ? position : null}
			/>

			<DialogReceiptCreate
				dialogOpen={dialogs.dialogReceiptCreate}
				onCloseDialog={() => onCloseDialogByName('dialogReceiptCreate')}
				onExitedDialog={onExitedDialogByName}
				onCallback={onReceiptCreate}
				selectedPosition={dialogOpenedName === 'dialogReceiptCreate' ? position : null}
			/>
		</Container>
	);
};

export default Index;
