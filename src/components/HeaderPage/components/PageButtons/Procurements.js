import React, { useState, lazy, Suspense } from 'react';

import { Button } from './styles';
import styles from './index.module.css';

const DialogProcurementCreate = lazy(() => import('src/views/Dialogs/ProcurementCreateEdit'));

const Procurements = () => {
	const [dialogProcurementCreate, setDialogProcurementCreate] = useState(false);

	const toggleVisibleDialogProcurementCreate = () => setDialogProcurementCreate(prevValue => !prevValue);

	return (
		<div className={styles.container}>
			<Button onClick={toggleVisibleDialogProcurementCreate} variant="contained" color="primary">
				Оформить закупку
			</Button>

			<Suspense fallback={null}>
				<DialogProcurementCreate type="create" dialogOpen={dialogProcurementCreate} onCloseDialog={toggleVisibleDialogProcurementCreate} />
			</Suspense>
		</div>
	);
};

export default Procurements;
