import React, { useState } from 'react';
import { connect } from 'react-redux';
import loadable from '@loadable/component';

// import Button from '@material-ui/core/Button';

import { getPositions } from 'src/actions/positions';

import { Button } from './styles';
import styles from './index.module.css';

const DialogProcurementCreate = loadable(() =>
	import('src/pages/Dialogs/ProcurementCreate' /* webpackChunkName: "Dialog_ProcurementCreate" */)
);

const Procurements = props => {
	const { currentStudio } = props;
	const [dialogProcurementCreate, setDialogProcurementCreate] = useState(false);

	const onOpenDialogProcurementCreate = async () => {
		await props.getPositions();

		setDialogProcurementCreate(true);
	};

	const onCloseDialogProcurementCreate = () => setDialogProcurementCreate(false);

	return (
		<div className={styles.container}>
			<Button onClick={onOpenDialogProcurementCreate} variant="contained" color="primary">
				Создать закупку
			</Button>

			<DialogProcurementCreate
				type="create"
				dialogOpen={dialogProcurementCreate}
				onCloseDialog={onCloseDialogProcurementCreate}
				currentStudio={currentStudio}
			/>
		</div>
	);
};

const mapDispatchToProps = dispatch => {
	return {
		getPositions: () => dispatch(getPositions({ showRequest: false })),
	};
};

export default connect(null, mapDispatchToProps)(Procurements);
