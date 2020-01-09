import React, { useState } from 'react';
import { connect } from 'react-redux';
import loadable from '@loadable/component';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';

import TitlePageOrLogo from './TitlePageOrLogo';

import { getCharacteristics } from 'src/actions/characteristics';

import styles from 'src/components/Header/index.module.css';

const DialogPositionReceiptCreate = loadable(() =>
	import('src/pages/Dialogs/PositionReceiptCreateEdit' /* webpackChunkName: "Dialog_PositionReceiptCreateEdit" */)
);

const DialogPositionGroupCreate = loadable(() =>
	import('src/pages/Dialogs/PositionGroupCreateEditAdd' /* webpackChunkName: "Dialog_PositionGroupCreateEditAdd" */)
);

const StockAvailability = props => {
	const { pageTitle, theme, currentStock } = props;
	const [dialogPositionReceiptCreate, setDialogPositionReceiptCreate] = useState(false);
	const [dialogPositionGroupCreate, setDialogPositionGroupCreate] = useState(false);

	const onOpenDialogPositionReceiptCreate = async () => {
		await props.getCharacteristics();

		setDialogPositionReceiptCreate(true);
	};

	const onCloseDialogPositionReceiptCreate = () => setDialogPositionReceiptCreate(false);

	const onOpenDialogPositionGroupCreate = () => setDialogPositionGroupCreate(true);

	const onCloseDialogPositionGroupCreate = () => setDialogPositionGroupCreate(false);

	return (
		<div className={styles.column_left}>
			<TitlePageOrLogo pageTitle={pageTitle} theme={theme} />
			<div className={styles.columnGroup_left}>
				<Button
					className={styles.buttonColorTeal400}
					variant="contained"
					color="primary"
					style={{ marginRight: 8 }}
					onClick={onOpenDialogPositionReceiptCreate}
				>
					<FontAwesomeIcon icon={['far', 'plus']} style={{ marginRight: 10 }} />
					Создать позицию
				</Button>
				<Button
					className={styles.buttonColorTeal400}
					variant="contained"
					color="primary"
					style={{ marginRight: 8 }}
					onClick={onOpenDialogPositionGroupCreate}
				>
					<FontAwesomeIcon icon={['far', 'plus']} style={{ marginRight: 10 }} />
					Создать группу
				</Button>
			</div>

			<DialogPositionReceiptCreate
				type="create"
				dialogOpen={dialogPositionReceiptCreate}
				onCloseDialog={onCloseDialogPositionReceiptCreate}
				currentStockId={currentStock._id}
			/>

			<DialogPositionGroupCreate
				type="create"
				dialogOpen={dialogPositionGroupCreate}
				onCloseDialog={onCloseDialogPositionGroupCreate}
				currentStockId={currentStock._id}
			/>
		</div>
	);
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStock } = ownProps;

	return {
		getCharacteristics: () => dispatch(getCharacteristics(currentStock._id)),
	};
};

export default connect(null, mapDispatchToProps)(StockAvailability);
