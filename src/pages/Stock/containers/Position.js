import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ButtonBase from '@material-ui/core/ButtonBase';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';

import { formatNumber } from 'shared/utils';

import history from 'src/helpers/history';

import NumberFormat, { currencyMoneyFormatProps } from 'src/components/NumberFormat';
import PositionSummary from 'src/components/PositionSummary';
import QuantityIndicator from 'src/components/QuantityIndicator';

import { archivePositionAfterEnded } from 'src/actions/positions';

import SellingPriceDisplay from '../components/SellingPriceDisplay';
import PositionDropdown from '../components/PositionDropdown';

import { TableCell } from '../components/styles';
import stylesPositions from './Positions.module.css';
import styles from './Position.module.css';

import { ReactComponent as UnifierPosition } from 'public/img/other/unifier_position.svg';

const Position = props => {
	const { position, onOpenDialogPosition } = props;
	const refDropdownActions = useRef(null);
	const [dropdownActions, setDropdownActions] = useState(false);

	const onToggleDropdownActions = value => setDropdownActions(value === null || value === undefined ? prevValue => !prevValue : value);

	const openPositionPage = event => {
		const positionLink = `/stock/${position._id}`;

		return event.ctrlKey || event.shiftKey || event.metaKey ? window.open(positionLink) : history.push(positionLink);
	};

	const positionBadges = (badges = []) => {
		if (position.archivedAfterEnded) badges.push('archiving-after-ended');
		if (Boolean(position.deliveryIsExpected.length)) badges.push('delivery-is-expected');

		return badges;
	};

	const containerClasses = ClassNames(stylesPositions.position, styles.position, {
		[styles.positionInGroup]: position.positionGroup,
		[styles.childPosition]: position.parentPosition,
	});

	return (
		<TableRow onClick={openPositionPage} className={containerClasses}>
			<TableCell width={330} style={position.positionGroup ? { paddingLeft: 41 } : {}}>
				<div className={styles.positionName}>
					{position.parentPosition ? <UnifierPosition className={styles.unifierPosition} /> : null}
					<PositionSummary name={position.name} characteristics={position.characteristics} badges={positionBadges()} avatar />
				</div>
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
						className={styles.createReceipt}
						onClick={event => {
							event.stopPropagation();
							onOpenDialogPosition('dialogReceiptConfirmCreate', 'position', position);
						}}
					>
						Создать поступление
					</ButtonBase>
				</TableCell>
			) : null}
			<TableCell align="center" width={48} padding="none">
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
