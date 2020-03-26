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

const DialogPositionOrGroupQRCodeGeneration = loadable(() =>
	import('src/pages/Dialogs/PositionOrGroupQRCodeGeneration' /* webpackChunkName: "Dialog_PositionOrGroupQRCodeGeneration" */)
);

const DialogPositionQRCodeGeneration = DialogPositionOrGroupQRCodeGeneration;

const DialogPositionArchiveDelete = loadable(() =>
	import('src/pages/Dialogs/PositionArchiveDelete' /* webpackChunkName: "Dialog_PositionArchiveDelete" */)
);

const Index = props => {
	const {
		currentStudio,
		positionData,
		receiptsData,
		getCharacteristics,
		getPosition,
		onCancelArchivePositionAfterEnded,
		changeSellingPriceReceipt,
	} = props;
	const [dialogOpenedName, setDialogOpenedName] = useState('');
	const [dialogs, setDialogs] = useState({
		dialogPositionEdit: false,
		dialogPositionRemoveFromGroup: false,
		dialogPositionArchiveDelete: false,
		dialogPositionQRCodeGeneration: false,
	});

	const onOpenDialogByName = async dialogName => {
		if (dialogName === 'dialogPositionEdit') await getCharacteristics();

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
					<Receipts position={position} receiptsData={receiptsData} changeSellingPriceReceipt={changeSellingPriceReceipt} />
				</Grid>
			</Grid>

			<DialogPositionEdit
				type="edit"
				dialogOpen={dialogs.dialogPositionEdit}
				onCloseDialog={() => onCloseDialogByName('dialogPositionEdit')}
				onExitedDialog={onExitedDialogByName}
				onCallback={getPosition}
				currentStudioId={currentStudio._id}
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

			<DialogPositionQRCodeGeneration
				dialogOpen={dialogs.dialogPositionQRCodeGeneration}
				onCloseDialog={() => onCloseDialogByName('dialogPositionQRCodeGeneration')}
				onExitedDialog={onExitedDialogByName}
				type="position"
				selectedPositionOrGroup={dialogOpenedName === 'dialogPositionQRCodeGeneration' ? position : null}
			/>
		</Container>
	);
};

export default Index;
