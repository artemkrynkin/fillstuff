import React, { useState, useRef, Fragment } from 'react';
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

import PositionGroupDropdown from '../components/PositionGroupDropdown';
import Position from './Position';

import { Accordion, AccordionSummary, AccordionDetails, TableCellAccordion } from './styles';
import stylesPositions from './Positions.module.css';
import styles from './PositionGroup.module.css';

const PositionGroup = props => {
	const { positions, positionsInGroup, positionGroup, onOpenDialogPositionGroup, onOpenDialogPosition } = props;
	const refDropdownActions = useRef(null);
	const [dropdownActions, setDropdownActions] = useState(false);

	const onToggleDropdownActions = value => setDropdownActions(value === null || value === undefined ? prevValue => !prevValue : value);

	return (
		<>
			<Accordion
				className={stylesPositions.positionGroup}
				TransitionProps={{
					timeout: 'auto',
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
								<TableCellAccordion align="center" width={48} padding="none">
									<IconButton
										ref={refDropdownActions}
										className={ClassNames(stylesPositions.actionButton, { activeAction: dropdownActions })}
										onClick={event => {
											event.stopPropagation();
											onToggleDropdownActions();
										}}
									>
										<FontAwesomeIcon icon={['far', 'ellipsis-h']} />
									</IconButton>
								</TableCellAccordion>
							</TableRow>
						</TableBody>
					</Table>
				</AccordionSummary>

				{positionsInGroup.length ? (
					<AccordionDetails>
						<Table style={{ tableLayout: 'fixed' }}>
							<TableBody className={stylesPositions.tableBody}>
								{positionsInGroup.map(position => {
									if (!position.positionGroup || position.parentPosition || position.isArchived) return null;

									const childPosition = position.childPosition
										? positions.find(({ parentPosition }) => parentPosition === position._id)
										: null;
									if (!childPosition) {
										return <Position key={position._id} position={position} onOpenDialogPosition={onOpenDialogPosition} />;
									} else {
										return (
											<Fragment key={position._id}>
												<Position position={position} onOpenDialogPosition={onOpenDialogPosition} />
												<Position position={childPosition} onOpenDialogPosition={onOpenDialogPosition} />
											</Fragment>
										);
									}
								})}
							</TableBody>
						</Table>
					</AccordionDetails>
				) : null}
			</Accordion>

			<PositionGroupDropdown
				refDropdownActions={refDropdownActions}
				dropdownActions={dropdownActions}
				onToggleDropdownActions={onToggleDropdownActions}
				onOpenDialogPositionGroup={onOpenDialogPositionGroup}
				positionGroup={positionGroup}
			/>
		</>
	);
};

PositionGroup.propTypes = {
	positionGroup: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
	const positions = state.positions.data;
	const { positionGroup } = ownProps;

	const positionsInGroup = positions
		? positionGroup.positions.map(positionIdGroup => positions.find(({ _id }) => _id === positionIdGroup))
		: [];

	return {
		positions,
		positionsInGroup,
	};
};

export default connect(mapStateToProps, null)(PositionGroup);
