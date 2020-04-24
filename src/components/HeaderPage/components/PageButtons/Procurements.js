import React, { useState } from 'react';
import loadable from '@loadable/component';

// import Button from '@material-ui/core/Button';

import { Button } from './styles';
import styles from './index.module.css';

const DialogProcurementExpectedCreate = loadable(() =>
	import('src/pages/Dialogs/ProcurementExpectedCreate' /* webpackChunkName: "Dialog_ProcurementExpectedCreate" */)
);

const DialogProcurementReceivedCreate = loadable(() =>
	import('src/pages/Dialogs/ProcurementReceivedCreate' /* webpackChunkName: "Dialog_ProcurementReceivedCreate" */)
);

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

			<DialogProcurementExpectedCreate
				dialogOpen={dialogProcurementExpectedCreate}
				onCloseDialog={onCloseDialogProcurementExpectedCreate}
			/>

			<DialogProcurementReceivedCreate
				dialogOpen={dialogProcurementReceivedCreate}
				onCloseDialog={onCloseDialogProcurementReceivedCreate}
				currentStudio={currentStudio}
			/>
		</div>
	);
};

export default Procurements;
