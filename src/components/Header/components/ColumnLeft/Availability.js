import React, { useState } from 'react';
import { connect } from 'react-redux';
import loadable from '@loadable/component';

import TitlePageOrLogo from './TitlePageOrLogo';

import { getCharacteristics } from 'src/actions/characteristics';

import { Button } from './styles';
import styles from 'src/components/Header/index.module.css';

const DialogPositionCreate = loadable(() =>
	import('src/pages/Dialogs/PositionCreateEdit' /* webpackChunkName: "Dialog_PositionCreateEdit" */)
);

const DialogPositionGroupCreate = loadable(() =>
	import('src/pages/Dialogs/PositionGroupCreateEditAdd' /* webpackChunkName: "Dialog_PositionGroupCreateEditAdd" */)
);

const Availability = props => {
	const { pageTitle, theme, currentStudio } = props;
	const [dialogPositionCreate, setDialogPositionCreate] = useState(false);
	const [dialogPositionGroupCreate, setDialogPositionGroupCreate] = useState(false);

	const onOpenDialogPositionCreate = async () => {
		await props.getCharacteristics();

		setDialogPositionCreate(true);
	};

	const onCloseDialogPositionCreate = () => setDialogPositionCreate(false);

	const onOpenDialogPositionGroupCreate = () => setDialogPositionGroupCreate(true);

	const onCloseDialogPositionGroupCreate = () => setDialogPositionGroupCreate(false);

	return (
		<div className={styles.column_left}>
			<TitlePageOrLogo pageTitle={pageTitle} theme={theme} />
			<div className={styles.columnGroup_left}>
				<Button onClick={onOpenDialogPositionCreate} variant="contained" color="primary" style={{ marginRight: 8 }}>
					Создать позицию
				</Button>
				<Button onClick={onOpenDialogPositionGroupCreate} variant="contained" color="primary">
					Создать группу
				</Button>
			</div>

			<DialogPositionCreate
				type="create"
				dialogOpen={dialogPositionCreate}
				onCloseDialog={onCloseDialogPositionCreate}
				currentStudioId={currentStudio._id}
			/>

			<DialogPositionGroupCreate
				type="create"
				dialogOpen={dialogPositionGroupCreate}
				onCloseDialog={onCloseDialogPositionGroupCreate}
				currentStudioId={currentStudio._id}
			/>
		</div>
	);
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStudio } = ownProps;

	return {
		getCharacteristics: () => dispatch(getCharacteristics(currentStudio._id)),
	};
};

export default connect(null, mapDispatchToProps)(Availability);
