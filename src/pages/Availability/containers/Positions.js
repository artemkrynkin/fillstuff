import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { TableCell } from './styles';
import Position from './Position';
import PositionGroup from './PositionGroup';

import styles from './Positions.module.css';

const Positions = props => {
	const { positions, positionGroups, onOpenDialogByName } = props;

	return (
		<Paper>
			<Table style={{ tableLayout: 'fixed' }}>
				<TableHead className={styles.tableHeaderSticky}>
					<TableRow>
						<TableCell>Позиция</TableCell>
						<TableCell align="right" width={240}>
							Количество
						</TableCell>
						<TableCell align="right" width={140}>
							Цена покупки
						</TableCell>
						<TableCell align="right" width={140}>
							Цена продажи
						</TableCell>
						<TableCell width={50} />
					</TableRow>
				</TableHead>
				<TableBody className={styles.tableBody}>
					{positionGroups.map(positionGroup => (
						<PositionGroup
							key={positionGroup._id}
							positionGroup={positionGroup}
							onOpenDialogPositionGroup={onOpenDialogByName}
							onOpenDialogPosition={onOpenDialogByName}
						/>
					))}
					{positions.map(position => {
						if (position.positionGroup || position.isArchived) return null;

						return <Position key={position._id} position={position} onOpenDialogPosition={onOpenDialogByName} />;
					})}
				</TableBody>
			</Table>
		</Paper>
	);
};

export default Positions;
