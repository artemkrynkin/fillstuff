import React, { useState } from 'react';
import loadable from '@loadable/component';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';

import { procurementPositionTransform } from 'src/helpers/utils';

import Tooltip from 'src/components/Tooltip';

import styles from './Header.module.css';

const DialogPositionArchiveDelete = loadable(() =>
	import('src/pages/Dialogs/PositionArchiveDelete' /* webpackChunkName: "Dialog_PositionArchiveDelete" */)
);

const Header = props => {
	const { onCloseDialog, archivePositionAfterEnded, enqueueSnackbar, onOpenDialogByNameIndex, storeNotification } = props;
	const [dialogData, setDialogData] = useState({
		position: null,
	});
	const [dialogOpenedName, setDialogOpenedName] = useState('');
	const [dialogs, setDialogs] = useState({
		dialogPositionArchiveDelete: false,
	});

	const procurement = {
		positions: [procurementPositionTransform(storeNotification.position)],
	};

	const onOpenDialogByName = (dialogName, dataType, data) => {
		setDialogOpenedName(dialogName);

		setDialogs({
			...dialogs,
			[dialogName]: true,
		});

		if (dataType && data) {
			setDialogData({
				...dialogData,
				[dataType]: data,
			});
		}
	};

	const onCloseDialogByName = dialogName => {
		setDialogs({
			...dialogs,
			[dialogName]: false,
		});
	};

	const onExitedDialogByName = dataType => {
		setDialogOpenedName('');

		if (dataType) {
			setDialogData({
				...dialogData,
				[dataType]: null,
			});
		}
	};

	const onArchivedAfterEnded = () => {
		archivePositionAfterEnded(storeNotification.position._id, { archivedAfterEnded: true }).then(response => {
			onCloseDialog();

			if (response.status === 'success') {
				enqueueSnackbar({
					message: (
						<div>
							Позиция <b>{storeNotification.position.name}</b> будет архивирована после реализации.
						</div>
					),
					options: {
						variant: 'success',
					},
				});
			}
		});
	};

	return (
		<Grid className={styles.headerActions} alignItems="center" container>
			<Button
				onClick={() => onOpenDialogByNameIndex('dialogProcurementExpectedCreate', 'procurementExpected', procurement)}
				variant="contained"
				color="primary"
				size="small"
				style={{ marginRight: 8 }}
			>
				Создать заказ
			</Button>
			<Button
				onClick={() => onOpenDialogByNameIndex('dialogProcurementReceivedCreate', 'procurementReceived', procurement)}
				variant="outlined"
				color="primary"
				size="small"
			>
				Оформить закупку
			</Button>
			{storeNotification.position.receipts.length ? (
				<Tooltip className={styles.archiveAfterEnded} title="Архивировать после реализации" placement="bottom">
					<IconButton className={styles.archiveAfterEndedButton} onClick={() => onArchivedAfterEnded()}>
						<span className="fa-layers fa-fw" style={{ width: '16px' }}>
							<FontAwesomeIcon icon={['far', 'archive']} />
							<FontAwesomeIcon icon={['fas', 'circle']} transform="shrink-5 down-2.5 right-7" inverse />
							<FontAwesomeIcon icon={['fas', 'clock']} transform="shrink-7 down-2.5 right-7" />
						</span>
					</IconButton>
				</Tooltip>
			) : (
				<Tooltip className={styles.archiveAfterEnded} title="Архивировать" placement="bottom">
					<IconButton
						className={styles.archiveAfterEndedButton}
						onClick={() => onOpenDialogByName('dialogPositionArchiveDelete', 'position', storeNotification.position)}
					>
						<FontAwesomeIcon icon={['far', 'archive']} />
					</IconButton>
				</Tooltip>
			)}

			<DialogPositionArchiveDelete
				dialogOpen={dialogs.dialogPositionArchiveDelete}
				onCloseDialog={() => onCloseDialogByName('dialogPositionArchiveDelete')}
				onExitedDialog={() => onExitedDialogByName('position')}
				selectedPosition={dialogOpenedName === 'dialogPositionArchiveDelete' ? dialogData.position : null}
				onCallback={onCloseDialog}
			/>
		</Grid>
	);
};

export default Header;
