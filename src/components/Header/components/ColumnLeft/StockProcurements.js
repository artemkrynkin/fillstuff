import React, { useState } from 'react';
import { connect } from 'react-redux';
import loadable from '@loadable/component';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';

import { getPositionsInGroups } from 'src/actions/positionsInGroups';
import { getPositions } from 'src/actions/positions';

import TitlePageOrLogo from './TitlePageOrLogo';

import styles from 'src/components/Header/index.module.css';

const DialogProcurementCreate = loadable(() =>
	import('src/containers/Dialogs/ProcurementCreate' /* webpackChunkName: "Dialog_ProcurementCreate" */)
);

const StockProcurements = props => {
	const { pageTitle, theme, currentStock } = props;
	const [dialogProcurementCreate, setDialogProcurementCreate] = useState(false);

	const onOpenDialogProcurementCreate = async () => {
		props.getPositionsInGroups();
		await props.getPositions();

		setDialogProcurementCreate(true);
	};

	const onCloseDialogProcurementCreate = () => setDialogProcurementCreate(false);

	return (
		<div className={styles.column_left}>
			<TitlePageOrLogo pageTitle={pageTitle} theme={theme} />
			<div className={styles.columnGroup_left}>
				<Button
					className={styles.buttonColorTeal400}
					variant="contained"
					color="primary"
					style={{ marginRight: 8 }}
					onClick={onOpenDialogProcurementCreate}
					startIcon={<FontAwesomeIcon icon={['far', 'plus']} fixedWidth />}
				>
					Создать закупку
				</Button>
			</div>

			<DialogProcurementCreate
				type="create"
				dialogOpen={dialogProcurementCreate}
				onCloseDialog={onCloseDialogProcurementCreate}
				currentStock={currentStock}
			/>
		</div>
	);
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStock } = ownProps;

	return {
		getPositionsInGroups: () => dispatch(getPositionsInGroups(currentStock._id)),
		getPositions: () => dispatch(getPositions(currentStock._id, false)),
	};
};

export default connect(null, mapDispatchToProps)(StockProcurements);
