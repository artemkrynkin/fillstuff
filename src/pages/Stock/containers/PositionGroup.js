import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import MenuList from '@material-ui/core/MenuList';
import Divider from '@material-ui/core/Divider';

import { declensionNumber } from 'src/helpers/utils';

import QuantityIndicator from 'src/components/QuantityIndicator';
import Dropdown from 'src/components/Dropdown';
import MenuItem from 'src/components/MenuItem';

import { Accordion, AccordionSummary, AccordionDetails, TableCellAccordion } from './styles';
import stylesPositions from './Positions.module.css';
import styles from './PositionGroup.module.css';

import Position from './Position';
import ParentPosition from './ParentPosition';

const PositionGroup = props => {
	const { positions, positionsInGroup, positionGroup, onOpenDialogPositionGroup, onOpenDialogPosition } = props;
	const refDropdownActions = useRef(null);
	const [dropdownActions, setDropdownActions] = useState(false);

	const onHandleDropdownActions = value => setDropdownActions(value === null || value === undefined ? prevValue => !prevValue : value);

	return (
		<TableRow className={stylesPositions.positionGroup}>
			<td colSpan={6} style={{ position: 'relative' }}>
				<Accordion
					TransitionProps={{
						timeout: 300,
						unmountOnExit: true,
					}}
					defaultExpanded={true}
				>
					<AccordionSummary
						expandIcon={<FontAwesomeIcon icon={['far', 'angle-down']} />}
						IconButtonProps={{
							size: 'small',
						}}
					>
						<Table>
							<TableBody>
								<TableRow>
									<TableCellAccordion style={{ paddingLeft: 41 }}>
										<span className={styles.positionGroupName}>{positionGroup.name}</span>
										<span className={stylesPositions.caption} style={{ marginLeft: 5 }}>
											{declensionNumber(positionsInGroup.length, ['позиция', 'позиции', 'позиций'], true)}
										</span>
									</TableCellAccordion>
									<TableCellAccordion align="right" width={240}>
										<QuantityIndicator
											type="positionGroup"
											positions={positionsInGroup.filter(
												position => position.activeReceipt && position.receipts.length && !position.archivedAfterEnded
											)}
										/>
									</TableCellAccordion>
									<TableCellAccordion width={280} />
									<TableCellAccordion width={50} />
								</TableRow>
							</TableBody>
						</Table>
					</AccordionSummary>

					{positionsInGroup.length ? (
						<AccordionDetails>
							<Table style={{ tableLayout: 'fixed' }}>
								<TableBody>
									{positionsInGroup.map(position => {
										const childPosition = position.childPosition ? positions.find(({ _id }) => _id === position.childPosition) : null;

										if (!childPosition) {
											return <Position key={position._id} position={position} onOpenDialogPosition={onOpenDialogPosition} />;
										} else {
											return (
												<ParentPosition
													key={position._id}
													position={position}
													childPosition={childPosition}
													onOpenDialogPosition={onOpenDialogPosition}
												/>
											);
										}
									})}
								</TableBody>
							</Table>
						</AccordionDetails>
					) : null}
				</Accordion>
				<div className={styles.positionGroupActions}>
					<IconButton
						ref={refDropdownActions}
						className={ClassNames({
							[stylesPositions.actionButton]: true,
							activeAction: dropdownActions,
						})}
						onClick={() => onHandleDropdownActions()}
					>
						<FontAwesomeIcon icon={['far', 'ellipsis-h']} />
					</IconButton>
				</div>
			</td>

			<Dropdown
				anchor={refDropdownActions}
				open={dropdownActions}
				onClose={() => onHandleDropdownActions(false)}
				placement="bottom-end"
				disablePortal={false}
			>
				<MenuList>
					<MenuItem
						onClick={() => {
							onHandleDropdownActions();
							onOpenDialogPositionGroup('dialogPositionGroupQRCode', 'positionGroup', positionGroup);
						}}
						iconBefore={<FontAwesomeIcon icon={['far-c', 'qr-code']} />}
					>
						Печать QR-кода
					</MenuItem>
				</MenuList>
				<Divider />
				<MenuList>
					<MenuItem
						onClick={() => {
							onHandleDropdownActions();
							onOpenDialogPositionGroup('dialogPositionGroupAdd', 'positionGroup', positionGroup);
						}}
						iconBefore={<FontAwesomeIcon icon={['far', 'folder-plus']} style={{ fontSize: 16 }} />}
					>
						Добавить позиции
					</MenuItem>
					<MenuItem
						onClick={() => {
							onHandleDropdownActions();
							onOpenDialogPositionGroup('dialogPositionGroupEdit', 'positionGroup', positionGroup);
						}}
						iconBefore={<FontAwesomeIcon icon={['far', 'pen']} />}
					>
						Редактировать
					</MenuItem>
				</MenuList>
			</Dropdown>
		</TableRow>
	);
};

PositionGroup.propTypes = {
	positionGroup: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
	const positions = state.positions.data;
	const { positionGroup } = ownProps;

	const positionsInGroup = positions
		? positionGroup.positions.map(positionIdGroup => {
				return positions.find(({ _id }) => _id === positionIdGroup);
		  })
		: [];

	return {
		positions,
		positionsInGroup,
	};
};

export default connect(mapStateToProps, null)(PositionGroup);
