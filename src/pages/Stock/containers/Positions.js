import React, { Fragment } from 'react';
import ClassNames from 'classnames';

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

	const positionsShow = positions.some(position => !position.positionGroup && !position.isArchived);

	return (
		<Paper>
			<Table className={styles.tableHeaderSticky} style={{ tableLayout: 'fixed' }}>
				<TableHead>
					<TableRow>
						<TableCell width={330}>Позиция</TableCell>
						<TableCell />
						<TableCell align="right" width={240}>
							Количество
						</TableCell>
						<TableCell align="right" width={140}>
							Цена покупки
						</TableCell>
						<TableCell align="right" width={140}>
							Цена продажи
						</TableCell>
						<TableCell width={48} />
					</TableRow>
				</TableHead>
			</Table>

			{positionGroups.length ? (
				<div className={ClassNames(styles.positionGroups, { [styles.positionGroupsRounded]: !positionsShow })}>
					{positionGroups.map(positionGroup => (
						<PositionGroup
							key={positionGroup._id}
							positionGroup={positionGroup}
							onOpenDialogPositionGroup={onOpenDialogByName}
							onOpenDialogPosition={onOpenDialogByName}
						/>
					))}
				</div>
			) : null}

			{positionsShow ? (
				<Table className={styles.positions} style={{ tableLayout: 'fixed' }}>
					<TableBody className={styles.tableBody}>
						{positions.map(position => {
							if (position.positionGroup || position.parentPosition || position.isArchived) return null;

							const childPosition = position.childPosition ? positions.find(({ _id }) => _id === position.childPosition) : null;

							if (!childPosition) {
								return <Position key={position._id} position={position} onOpenDialogPosition={onOpenDialogByName} />;
							} else {
								return (
									<Fragment key={position._id}>
										<Position position={position} onOpenDialogPosition={onOpenDialogByName} />
										<Position position={childPosition} onOpenDialogPosition={onOpenDialogByName} />
									</Fragment>
								);
							}
						})}
					</TableBody>
				</Table>
			) : null}
		</Paper>
	);
};

export default Positions;
