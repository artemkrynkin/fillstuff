import React, { useState } from 'react';
import loadable from '@loadable/component';

// import Button from '@material-ui/core/Button';

import { Button } from './styles';
import styles from './index.module.css';

const DialogProcurementCreate = loadable(() =>
	import('src/pages/Dialogs/ProcurementCreate' /* webpackChunkName: "Dialog_ProcurementCreate" */)
);

const Procurements = props => {
	const { currentStudio } = props;
	const [dialogProcurementCreate, setDialogProcurementCreate] = useState(false);

	const onOpenDialogProcurementCreate = () => setDialogProcurementCreate(true);

	const onCloseDialogProcurementCreate = () => setDialogProcurementCreate(false);

	return (
		<div className={styles.container}>
			<Button variant="contained" color="primary" style={{ marginRight: 8 }}>
				Создать заказ
			</Button>
			<Button onClick={onOpenDialogProcurementCreate} variant="contained" color="primary">
				Оформить закупку
			</Button>

			<DialogProcurementCreate
				dialogOpen={dialogProcurementCreate}
				onCloseDialog={onCloseDialogProcurementCreate}
				currentStudio={currentStudio}
			/>
		</div>
	);
};

export default Procurements;
