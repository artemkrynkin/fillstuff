import React, { useState, lazy, Suspense } from 'react';

import { Button } from './styles';
import styles from './index.module.css';

const DialogProcurementExpectedCreate = lazy(() => import('src/views/Dialogs/ProcurementExpectedCreateConfirmEdit'));
const DialogProcurementReceivedCreate = lazy(() => import('src/views/Dialogs/ProcurementReceivedCreate'));

const Procurements = props => {
	const { currentStudio } = props;
	const [dialogProcurementExpectedCreate, setDialogProcurementExpectedCreate] = useState(false);
	const [dialogProcurementReceivedCreate, setDialogProcurementReceivedCreate] = useState(false);

	const onOpenDialogProcurementExpectedCreate = () => setDialogProcurementExpectedCreate(true);

	const onCloseDialogProcurementExpectedCreate = () => setDialogProcurementExpectedCreate(false);

	const onOpenDialogProcurementReceivedCreate = () => setDialogProcurementReceivedCreate(true);

	const onCloseDialogProcurementReceivedCreate = () => setDialogProcurementReceivedCreate(false);

	return (
		<div className={styles.container}>
			<Button onClick={onOpenDialogProcurementExpectedCreate} variant="contained" color="primary" style={{ marginRight: 8 }}>
				Создать заказ
			</Button>
			<Button onClick={onOpenDialogProcurementReceivedCreate} variant="contained" color="primary">
				Оформить закупку
			</Button>

			<Suspense fallback={null}>
				<DialogProcurementExpectedCreate
					type="create"
					dialogOpen={dialogProcurementExpectedCreate}
					onCloseDialog={onCloseDialogProcurementExpectedCreate}
				/>

				<DialogProcurementReceivedCreate
					dialogOpen={dialogProcurementReceivedCreate}
					onCloseDialog={onCloseDialogProcurementReceivedCreate}
					currentStudio={currentStudio}
				/>
			</Suspense>
		</div>
	);
};

export default Procurements;
