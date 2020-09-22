import React, { useState, lazy, Suspense } from 'react';

import { Button } from './styles';
import styles from './index.module.css';

const DialogPositionCreate = lazy(() => import('src/pages/Dialogs/PositionCreateEdit'));
const DialogPositionGroupCreate = lazy(() => import('src/pages/Dialogs/PositionGroupCreateEditAdd'));

const Stock = () => {
	const [dialogPositionCreate, setDialogPositionCreate] = useState(false);
	const [dialogPositionGroupCreate, setDialogPositionGroupCreate] = useState(false);

	const onOpenDialogPositionCreate = () => setDialogPositionCreate(true);

	const onCloseDialogPositionCreate = () => setDialogPositionCreate(false);

	const onOpenDialogPositionGroupCreate = () => setDialogPositionGroupCreate(true);

	const onCloseDialogPositionGroupCreate = () => setDialogPositionGroupCreate(false);

	return (
		<div className={styles.container}>
			<Button onClick={onOpenDialogPositionCreate} variant="contained" color="primary" style={{ marginRight: 8 }}>
				Создать позицию
			</Button>
			<Button onClick={onOpenDialogPositionGroupCreate} variant="contained" color="primary">
				Создать группу
			</Button>

			<Suspense fallback={null}>
				<DialogPositionCreate type="create" dialogOpen={dialogPositionCreate} onCloseDialog={onCloseDialogPositionCreate} />

				<DialogPositionGroupCreate type="create" dialogOpen={dialogPositionGroupCreate} onCloseDialog={onCloseDialogPositionGroupCreate} />
			</Suspense>
		</div>
	);
};

export default Stock;
