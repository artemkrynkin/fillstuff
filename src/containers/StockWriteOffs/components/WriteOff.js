import React from 'react';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import TableRow from '@material-ui/core/TableRow';

import styles from './WriteOff.module.css';

import { TableCell, TableCellHighlight, TableRowHighlight } from './styles';

const WriteOff = props => {
	const { writeOff, positionSameFilter } = props;
	const TableRowHighlightClasses = TableRowHighlight();
	const TableCellHighlightClasses = TableCellHighlight();

	const createdAtMoment = moment(writeOff.createdAt);
	const isCurrentHour = moment()
		.subtract({ hour: 1 })
		.isBefore(writeOff.createdAt);
	const isNow = moment().isSame(writeOff.createdAt, 'minute');

	return (
		<TableRow classes={positionSameFilter ? { root: TableRowHighlightClasses.root } : {}}>
			<TableCell classes={positionSameFilter ? { root: TableCellHighlightClasses.root } : {}}>
				{writeOff.position.name}{' '}
				{writeOff.position.characteristics.reduce((fullCharacteristics, characteristic) => {
					return `${fullCharacteristics} ${characteristic.label}`;
				}, '')}
				{writeOff.position.isArchived ? <span className={styles.isArchived}>В архиве</span> : null}
			</TableCell>
			<TableCell classes={positionSameFilter ? { root: TableCellHighlightClasses.root } : {}} align="left" width={180}>
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
			<TableCell classes={positionSameFilter ? { root: TableCellHighlightClasses.root } : {}} align="right" width={125}>
				{writeOff.quantity} {writeOff.position.unitIssue === 'pce' ? 'шт.' : 'уп.'}
			</TableCell>
			<TableCell classes={positionSameFilter ? { root: TableCellHighlightClasses.root } : {}} align="right" width={150}>
				{!isCurrentHour ? createdAtMoment.format('HH:mm') : !isNow ? createdAtMoment.fromNow() : 'только что'}
			</TableCell>
		</TableRow>
	);
};

export default WriteOff;
