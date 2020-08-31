import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ButtonBase from '@material-ui/core/ButtonBase';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';

import { formatNumber } from 'shared/utils';

import NumberFormat, { currencyMoneyFormatProps } from 'src/components/NumberFormat';
import PositionNameInList from 'src/components/PositionNameInList';
import QuantityIndicator from 'src/components/QuantityIndicator';

import { archivePositionAfterEnded } from 'src/actions/positions';

import SellingPriceDisplay from '../components/SellingPriceDisplay';
import PositionDropdown from '../components/PositionDropdown';

import { TableCell } from './styles';
import stylesPositions from './Positions.module.css';
import styles from './Position.module.css';

const Position = props => {
	const { position, onOpenDialogPosition } = props;
	const refDropdownActions = useRef(null);
	const [dropdownActions, setDropdownActions] = useState(false);

	const onToggleDropdownActions = value => setDropdownActions(value === null || value === undefined ? prevValue => !prevValue : value);

	return (
		<TableRow className={stylesPositions.position}>
			<TableCell style={position.positionGroup ? { paddingLeft: 41 } : {}} width={330}>
				<Link className={styles.positionLink} to={`/stock/${position._id}`}>
					<PositionNameInList
						name={position.name}
						characteristics={position.characteristics}
						archivedAfterEnded={position.archivedAfterEnded}
						deliveryIsExpected={Boolean(position.deliveryIsExpected.length)}
					/>
				</Link>
			</TableCell>
			<TableCell />
			<TableCell align="right" width={240}>
				{position.receipts.length ? (
					<QuantityIndicator
						type="position"
						unitReceipt={position.unitReceipt}
						unitRelease={position.unitRelease}
						minimumBalance={position.minimumBalance}
						archivedAfterEnded={position.archivedAfterEnded}
						receipts={position.receipts.map(receipt => ({ ...receipt.current }))}
					/>
				) : null}
			</TableCell>
			{position.receipts.length ? (
				<TableCell align="right" width={140}>
					<NumberFormat
						value={formatNumber(position.activeReceipt.unitPurchasePrice, { toString: true })}
						renderText={value => value}
						displayType="text"
						{...currencyMoneyFormatProps}
					/>
				</TableCell>
			) : null}
			{position.receipts.length ? (
				<TableCell align="right" width={140}>
					<SellingPriceDisplay position={position} />
				</TableCell>
			) : null}
			{!position.receipts.length ? (
				<TableCell align="left" colSpan={2} width={280}>
					<ButtonBase
						onClick={() => onOpenDialogPosition('dialogReceiptConfirmCreate', 'position', position)}
						className={styles.createReceipt}
					>
						Создать поступление
					</ButtonBase>
				</TableCell>
			) : null}
			<TableCell align="right" width={50} style={{ padding: '0 7px' }}>
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
			</TableCell>

			<PositionDropdown
				refDropdownActions={refDropdownActions}
				dropdownActions={dropdownActions}
				onToggleDropdownActions={onToggleDropdownActions}
				position={position}
				onOpenDialogPosition={onOpenDialogPosition}
				archivePositionAfterEnded={props.archivePositionAfterEnded}
			/>
		</TableRow>
	);
};

Position.propTypes = {
	position: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => {
	return {
		archivePositionAfterEnded: (positionId, data) => dispatch(archivePositionAfterEnded({ params: { positionId }, data })),
	};
};

export default connect(null, mapDispatchToProps)(Position);
