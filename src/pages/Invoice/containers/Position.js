import React from 'react';

import TableRow from '@material-ui/core/TableRow';

import { formatNumber } from 'shared/utils';

import PositionName from 'src/components/PositionName';
import NumberFormat, { currencyMoneyFormatProps } from 'src/components/NumberFormat';

import styles from './Position.module.css';

import { TableCell } from './styles';

const Position = props => {
	const { position } = props;

	return (
		<TableRow>
			<TableCell width={280}>
				<a className={styles.positionLink} href={`/stock/${position.position._id}`} target="_blank" rel="noreferrer noopener">
					<PositionName name={position.position.name} characteristics={position.position.characteristics} />
				</a>
			</TableCell>
			<TableCell />
			<TableCell align="right" width={160}>
				{position.quantity} {position.position.unitRelease === 'pce' ? 'шт.' : 'уп.'}
			</TableCell>
			<TableCell align="right" width={140}>
				<NumberFormat
					value={formatNumber(position.unitSellingPrice, { toString: true })}
					renderText={value => value}
					displayType="text"
					{...currencyMoneyFormatProps}
				/>
			</TableCell>
			<TableCell align="right" width={140}>
				<NumberFormat
					value={formatNumber(position.sellingPrice, { toString: true })}
					renderText={value => value}
					displayType="text"
					{...currencyMoneyFormatProps}
				/>
			</TableCell>
		</TableRow>
	);
};

export default Position;
