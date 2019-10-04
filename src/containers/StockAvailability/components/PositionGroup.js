import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';

import { declensionNumber } from 'src/helpers/utils';

import QuantityIndicator from 'src/components/QuantityIndicator';
import DropdownMenu from 'src/components/DropdownMenu';

import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, TableCell } from './styles';
import styles from './Positions.module.css';

import Position from './Position';

const positionGroupActionsButtonClasses = dropdownMenu =>
	ClassNames({
		[styles.positionGroupActionsButton]: true,
		[styles.positionGroupActionsButton_active]: Boolean(dropdownMenu),
	});

const PositionGroup = props => {
	const { currentStockId, positionGroup, onOpenDialogPositionGroup, onOpenDialogPosition } = props;
	const anchorDropdownMenu = useRef(null);
	const [dropdownMenu, setDropdownMenu] = useState(false);

	function onHandleDropdownMenu() {
		setDropdownMenu(prevValue => !prevValue);
	}

	return (
		<TableRow className={styles.positionGroup}>
			<td colSpan={6} style={{ position: 'relative' }}>
				<ExpansionPanel
					TransitionProps={{
						timeout: 300,
						unmountOnExit: true,
					}}
					defaultExpanded={positionGroup.positions.length !== 0 && positionGroup.dividedPositions}
					disabled={!positionGroup.positions.length}
				>
					<ExpansionPanelSummary
						expandIcon={<FontAwesomeIcon icon={['far', 'angle-down']} />}
						IconButtonProps={{
							disableRipple: true,
							size: 'small',
						}}
					>
						<Table>
							<TableBody>
								<TableRow>
									<TableCell width={36} style={{ paddingLeft: 5, paddingRight: 0 }} />
									<TableCell style={{ paddingLeft: 5 }}>
										{/*<TableCell>*/}
										<span className={styles.positionGroupName}>{positionGroup.name}</span>
										<span className={styles.positionsCount}>
											{positionGroup.positions.length +
												' ' +
												declensionNumber(positionGroup.positions.length, ['позиция', 'позиции', 'позиций'])}
										</span>
									</TableCell>
									<TableCell align="right" width={160}>
										<QuantityIndicator
											type="positionGroup"
											dividedPositions={positionGroup.dividedPositions}
											minimumBalance={positionGroup.minimumBalance}
											positions={positionGroup.positions}
										/>
									</TableCell>
									<TableCell align="right" width={130}>
										{positionGroup.positions.length ? positionGroup.minimumBalance : null}
									</TableCell>
									<TableCell width={280 + 50} />
								</TableRow>
							</TableBody>
						</Table>
					</ExpansionPanelSummary>

					{positionGroup.positions.length ? (
						<ExpansionPanelDetails>
							<Table>
								<TableBody>
									{positionGroup.positions.sort().map(position => {
										return (
											<Position
												key={position._id}
												currentStockId={currentStockId}
												position={position}
												onOpenDialogPosition={onOpenDialogPosition}
											/>
										);
									})}
								</TableBody>
							</Table>
						</ExpansionPanelDetails>
					) : null}
				</ExpansionPanel>
				<div className={styles.positionGroupActions}>
					<IconButton
						ref={anchorDropdownMenu}
						className={positionGroupActionsButtonClasses(dropdownMenu)}
						onClick={onHandleDropdownMenu}
						size="small"
					>
						<FontAwesomeIcon icon={['far', 'ellipsis-h']} />
					</IconButton>

					<DropdownMenu
						anchor={anchorDropdownMenu}
						open={dropdownMenu}
						onClose={onHandleDropdownMenu}
						placement="bottom-end"
						disablePortal={false}
					>
						<MenuList>
							<MenuItem
								onClick={() => {
									onHandleDropdownMenu();
									onOpenDialogPositionGroup('dialogPositionGroupAdd', positionGroup);
								}}
							>
								Добавить позиции
							</MenuItem>
						</MenuList>
						<Divider />
						<MenuList>
							<MenuItem
								onClick={() => {
									onHandleDropdownMenu();
									onOpenDialogPositionGroup('dialogPositionGroupQRCodeGeneration', positionGroup);
								}}
							>
								Генерация QR-кода
							</MenuItem>
							<MenuItem
								onClick={() => {
									onHandleDropdownMenu();
									onOpenDialogPositionGroup('dialogPositionGroupEdit', positionGroup);
								}}
							>
								Редактировать
							</MenuItem>
						</MenuList>
					</DropdownMenu>
				</div>
			</td>
		</TableRow>
	);
};

PositionGroup.propTypes = {
	currentStockId: PropTypes.string.isRequired,
	positionGroup: PropTypes.object.isRequired,
};

export default PositionGroup;
