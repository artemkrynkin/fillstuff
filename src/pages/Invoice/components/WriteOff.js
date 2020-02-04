import React from 'react';
import moment from 'moment';

import TableRow from '@material-ui/core/TableRow';

import { formatNumber } from 'shared/utils';

import PositionNameInList from 'src/components/PositionNameInList';

import styles from './WriteOff.module.css';

import { TableCell } from './styles';

const momentDate = moment();

const WriteOff = props => {
	const { writeOff } = props;

	const isCurrentYear = momentDate.isSame(writeOff.createdAt, 'year');
	const createdAtMoment = moment(writeOff.createdAt);

	return (
		<TableRow className={styles.writeOff}>
			<TableCell width={280}>
				<PositionNameInList
					name={writeOff.position.name}
					characteristics={writeOff.position.characteristics}
					canceled={writeOff.canceled}
				/>
			</TableCell>
			<TableCell align="right" width={125}>
				{writeOff.quantity} {writeOff.position.unitIssue === 'pce' ? 'шт.' : 'уп.'}
			</TableCell>
			<TableCell align="right" width={125}>
				{formatNumber(writeOff.sellingPrice, { toString: true })} ₽
			</TableCell>
			<TableCell align="right" width={150}>
				{createdAtMoment.format(isCurrentYear ? 'D MMMM в HH:mm' : 'DD MMMM YYYY в HH:mm')}
			</TableCell>
		</TableRow>
	);
};

export default WriteOff;
