import React from 'react';

import TableRow from '@material-ui/core/TableRow';

import { formatNumber } from 'shared/utils';

import PositionNameInList from 'src/components/PositionNameInList';
import NumberFormat, { currencyMoneyFormatProps } from 'src/components/NumberFormat';

import styles from './WriteOff.module.css';

import { TableCell } from './styles';

const WriteOff = props => {
	const { writeOff } = props;

	return (
		<TableRow className={styles.writeOff}>
			<TableCell width={280}>
				<a className={styles.positionLink} href={`/stock/${writeOff.position._id}`} target="_blank" rel="noreferrer noopener">
					<PositionNameInList name={writeOff.position.name} characteristics={writeOff.position.characteristics} />
				</a>
			</TableCell>
			<TableCell />
			<TableCell align="right" width={160}>
				{writeOff.quantity} {writeOff.position.unitRelease === 'pce' ? 'шт.' : 'уп.'}
			</TableCell>
			<TableCell align="right" width={140}>
				<NumberFormat
					value={formatNumber(writeOff.unitSellingPrice, { toString: true })}
					renderText={value => value}
					displayType="text"
					{...currencyMoneyFormatProps}
				/>
			</TableCell>
			<TableCell align="right" width={140}>
				<NumberFormat
					value={formatNumber(writeOff.sellingPrice, { toString: true })}
					renderText={value => value}
					displayType="text"
					{...currencyMoneyFormatProps}
				/>
			</TableCell>
		</TableRow>
	);
};

export default WriteOff;
