import React, { useState } from 'react';
import { connect } from 'react-redux';
import loadable from '@loadable/component';

import { getPositions } from 'src/actions/positions';

import TitlePageOrLogo from './TitlePageOrLogo';

import { Button } from './styles';
import styles from 'src/components/Header/index.module.css';

const DialogProcurementCreate = loadable(() =>
	import('src/pages/Dialogs/ProcurementCreate' /* webpackChunkName: "Dialog_ProcurementCreate" */)
);

const Procurements = props => {
	const { pageTitle, theme, currentStudio } = props;
	const [dialogProcurementCreate, setDialogProcurementCreate] = useState(false);

	const onOpenDialogProcurementCreate = async () => {
		await props.getPositions();

		setDialogProcurementCreate(true);
	};

	const onCloseDialogProcurementCreate = () => setDialogProcurementCreate(false);

	return (
		<div className={styles.column_left}>
			<TitlePageOrLogo pageTitle={pageTitle} theme={theme} />
			<div className={styles.columnGroup_left}>
				<Button onClick={onOpenDialogProcurementCreate} variant="contained" color="primary" style={{ marginRight: 8 }}>
					Создать закупку
				</Button>
			</div>

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
