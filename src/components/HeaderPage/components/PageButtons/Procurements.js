import React, { useState, lazy, Suspense } from 'react';

import { Button } from './styles';
import styles from './index.module.css';

// const DialogProcurementExpectedCreate = lazy(() => import('src/views/Dialogs/ProcurementExpectedCreateConfirmEdit'));
// const DialogProcurementReceivedCreate = lazy(() => import('src/views/Dialogs/ProcurementReceivedCreate'));
const DialogProcurementSelectionStatus = lazy(() => import('src/views/Dialogs/ProcurementSelectionStatus'));

const Procurements = props => {
	// const { currentStudio } = props;
	const [dialogProcurementSelectionStatus, setDialogProcurementSelectionStatus] = useState(false);
	// const [dialogProcurementReceivedCreate, setDialogProcurementReceivedCreate] = useState(false);

	const toggleVisibleDialogProcurementSelectionStatus = () => setDialogProcurementSelectionStatus(prevValue => !prevValue);

	// const onOpenDialogProcurementSelectionStatus = () => setDialogProcurementSelectionStatus(true);
	//
	// const onCloseDialogProcurementSelectionStatus = () => setDialogProcurementSelectionStatus(false);
	//
	// const onOpenDialogProcurementReceivedCreate = () => setDialogProcurementReceivedCreate(true);
	//
	// const onCloseDialogProcurementReceivedCreate = () => setDialogProcurementReceivedCreate(false);

	return (
		<div className={styles.container}>
			<Button onClick={toggleVisibleDialogProcurementSelectionStatus} variant="contained" color="primary">
				Создать закупку
			</Button>
			{/*<Button onClick={onOpenDialogProcurementExpectedCreate} variant="contained" color="primary" style={{ marginRight: 8 }}>*/}
			{/*	Создать заказ*/}
			{/*</Button>*/}
			{/*<Button onClick={onOpenDialogProcurementReceivedCreate} variant="contained" color="primary">*/}
			{/*	Оформить закупку*/}
			{/*</Button>*/}

			<Suspense fallback={null}>
				<DialogProcurementSelectionStatus
					dialogOpen={dialogProcurementSelectionStatus}
					onCloseDialog={toggleVisibleDialogProcurementSelectionStatus}
				/>

				{/*<DialogProcurementExpectedCreate*/}
				{/*	type="create"*/}
				{/*	dialogOpen={dialogProcurementExpectedCreate}*/}
				{/*	onCloseDialog={onCloseDialogProcurementExpectedCreate}*/}
				{/*/>*/}

				{/*<DialogProcurementReceivedCreate*/}
				{/*	dialogOpen={dialogProcurementReceivedCreate}*/}
				{/*	onCloseDialog={onCloseDialogProcurementReceivedCreate}*/}
				{/*	currentStudio={currentStudio}*/}
				{/*/>*/}
			</Suspense>
		</div>
	);
};

export default Procurements;
