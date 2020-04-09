import React, { useState } from 'react';
import loadable from '@loadable/component';

import { Button } from './styles';
import styles from './index.module.css';

const DialogPositionCreate = loadable(() =>
	import('src/pages/Dialogs/PositionCreateEdit' /* webpackChunkName: "Dialog_PositionCreateEdit" */)
);

const DialogPositionGroupCreate = loadable(() =>
	import('src/pages/Dialogs/PositionGroupCreateEditAdd' /* webpackChunkName: "Dialog_PositionGroupCreateEditAdd" */)
);

const Availability = () => {
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

			<DialogPositionCreate type="create" dialogOpen={dialogPositionCreate} onCloseDialog={onCloseDialogPositionCreate} />

			<DialogPositionGroupCreate type="create" dialogOpen={dialogPositionGroupCreate} onCloseDialog={onCloseDialogPositionGroupCreate} />
		</div>
	);
};

export default Availability;
