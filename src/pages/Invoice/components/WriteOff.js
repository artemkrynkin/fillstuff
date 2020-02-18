import React from 'react';

import TableRow from '@material-ui/core/TableRow';

import { formatNumber } from 'shared/utils';

import PositionNameInList from 'src/components/PositionNameInList';

import styles from './WriteOff.module.css';

import { TableCell } from './styles';

const WriteOff = props => {
	const { writeOff } = props;

	return (
		<TableRow className={styles.writeOff}>
			<TableCell width={280}>
				<PositionNameInList name={writeOff.position.name} characteristics={writeOff.position.characteristics} />
			</TableCell>
			<TableCell align="right" width={125}>
				{writeOff.quantity} {writeOff.position.unitIssue === 'pce' ? 'шт.' : 'уп.'}
			</TableCell>
			<TableCell align="right" width={125}>
				{formatNumber(writeOff.unitSellingPrice, { toString: true })} ₽
			</TableCell>
			<TableCell align="right" width={125}>
				{formatNumber(writeOff.sellingPrice, { toString: true })} ₽
			</TableCell>
		</TableRow>
	);
};

export default WriteOff;
