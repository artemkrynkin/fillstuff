import React, { useState } from 'react';
import loadable from '@loadable/component';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';

import { procurementPositionTransform } from 'src/helpers/utils';

import styles from './Header.module.css';

const DialogPositionArchiveDelete = loadable(() =>
	import('src/pages/Dialogs/PositionArchiveDelete' /* webpackChunkName: "Dialog_PositionArchiveDelete" */)
);

const Header = props => {
	const {
		onCloseDialog,
		onOpenDialogByNameIndex,
		storeNotification: { position },
	} = props;
	const [dialogData, setDialogData] = useState({
		position: null,
	});
	const [dialogOpenedName, setDialogOpenedName] = useState('');
	const [dialogs, setDialogs] = useState({
		dialogPositionArchiveDelete: false,
	});

	const procurement = setLastReceipt => {
		const orderedPosition = 'parentPosition' in position ? position.parentPosition : position;

		return {
			orderedReceiptsPositions: [
				{
					position: procurementPositionTransform(orderedPosition, setLastReceipt),
				},
			],
		};
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

	return (
		<Grid className={styles.headerActions} alignItems="center" container>
			<Button
				onClick={() => onOpenDialogByNameIndex('dialogProcurementExpectedCreate', 'procurementExpected', procurement(false))}
				variant="contained"
				color="primary"
				size="small"
				style={{ marginRight: 8 }}
			>
				Создать заказ
			</Button>
			<Button
				onClick={() => onOpenDialogByNameIndex('dialogProcurementReceivedCreate', 'procurementReceived', procurement(true))}
				variant="outlined"
				color="primary"
				size="small"
			>
				Оформить закупку
			</Button>
			<Tooltip className={styles.archiveAfterEnded} title="Архивировать" placement="bottom">
				<IconButton
					className={ClassNames({
						[styles.archiveAfterEndedButton]: true,
						destructiveAction: true,
					})}
					onClick={() => onOpenDialogByName('dialogPositionArchiveDelete', 'position', position)}
				>
					<FontAwesomeIcon icon={['far', 'archive']} />
				</IconButton>
			</Tooltip>

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
