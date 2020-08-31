import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';

import { declensionNumber } from 'src/helpers/utils';

import QuantityIndicator from 'src/components/QuantityIndicator';

import { Accordion, AccordionSummary, AccordionDetails, TableCellAccordion } from './styles';
import stylesPositions from './Positions.module.css';
import styles from './PositionGroup.module.css';

import PositionGroupDropdown from '../components/PositionGroupDropdown';
import Position from './Position';
import ParentPosition from './ParentPosition';

const PositionGroup = props => {
	const { positions, positionsInGroup, positionGroup, onOpenDialogPositionGroup, onOpenDialogPosition } = props;
	const refDropdownActions = useRef(null);
	const [dropdownActions, setDropdownActions] = useState(false);

	const onToggleDropdownActions = value => setDropdownActions(value === null || value === undefined ? prevValue => !prevValue : value);

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
										if (!position.positionGroup || position.parentPosition || position.isArchived) return null;

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
						onClick={() => onToggleDropdownActions()}
					>
						<FontAwesomeIcon icon={['far', 'ellipsis-h']} />
					</IconButton>
				</div>
			</td>

			<PositionGroupDropdown
				refDropdownActions={refDropdownActions}
				dropdownActions={dropdownActions}
				onToggleDropdownActions={onToggleDropdownActions}
				onOpenDialogPositionGroup={onOpenDialogPositionGroup}
				positionGroup={positionGroup}
			/>
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
