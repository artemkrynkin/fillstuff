import React from 'react';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import PositionNameInList from 'src/components/PositionNameInList';

import styles from './WriteOff.module.css';

import { TableCell } from './styles';

const WriteOff = props => {
	const { writeOff, isCurrentDay, onOpenDialogWriteOffCancel } = props;

	const createdAtMoment = moment(writeOff.createdAt);
	const isCurrentDayWriteOff = moment()
		.subtract({ day: 1 })
		.isBefore(writeOff.createdAt);
	const isCurrentHour = moment()
		.subtract({ hour: 1 })
		.isBefore(writeOff.createdAt);
	const isNow = moment()
		.subtract({ minute: 1 })
		.isBefore(writeOff.createdAt);

	return (
		<TableRow className={styles.writeOff}>
			<TableCell>
				<PositionNameInList
					name={writeOff.position.name}
					characteristics={writeOff.position.characteristics}
					isArchived={writeOff.position.isArchived}
					canceled={writeOff.canceled}
				/>
			</TableCell>
			<TableCell align="left" width={180}>
				<div className={styles.user}>
					<Avatar
						className={styles.userPhoto}
						src={writeOff.user.profilePhoto}
						alt={writeOff.user.name}
						children={<div className={styles.userIcon} children={<FontAwesomeIcon icon={['fas', 'user-alt']} />} />}
					/>
					<Grid style={{ maxWidth: 112 }} alignItems="flex-end" container>
						<div className={styles.userName}>{writeOff.user.name}</div>
					</Grid>
				</div>
			</TableCell>
			<TableCell align="right" width={125}>
				{writeOff.quantity} {writeOff.position.unitIssue === 'pce' ? 'шт.' : 'уп.'}
			</TableCell>
			<TableCell align="right" width={150}>
				{!isCurrentHour ? createdAtMoment.format('HH:mm') : !isNow ? createdAtMoment.fromNow() : 'только что'}
			</TableCell>
			{isCurrentDay ? (
				<TableCell align="right" width={50} style={{ padding: '0 7px' }}>
					{isCurrentDayWriteOff && !writeOff.canceled ? (
						<Tooltip title="Отменить списание" placement="top">
							<IconButton className={styles.cancelWriteOffButton} onClick={onOpenDialogWriteOffCancel} size="small">
								<FontAwesomeIcon icon={['far', 'undo']} />
							</IconButton>
						</Tooltip>
					) : null}
				</TableCell>
			) : null}
		</TableRow>
	);
};

export default WriteOff;
