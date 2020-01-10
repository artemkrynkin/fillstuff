import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import styles from './index.module.css';

const qiClasses = dividedPositions =>
	ClassNames({
		[styles.disappearing]: dividedPositions,
	});

const qiCircleClasses = (quantity, minimumBalance) =>
	ClassNames({
		[styles.circle]: true,
		[styles.circle_red]: (quantity / minimumBalance) * 100 <= 100,
		[styles.circle_yellow]: (quantity / minimumBalance) * 100 > 100 && (quantity / minimumBalance) * 100 <= 150,
		[styles.circle_green]: (quantity / minimumBalance) * 100 > 150,
	});

const compareQuantity = (a, b) => {
	if (a.activeReceipt.current.quantity > b.activeReceipt.current.quantity) return 1;
	if (a.activeReceipt.current.quantity === b.activeReceipt.current.quantity) return 0;
	if (a.activeReceipt.current.quantity < b.activeReceipt.current.quantity) return -1;
};

const QuantityIndicator = props => {
	const { type, dividedPositions, divided, unitReceipt, unitIssue, minimumBalance, receipts, positions } = props;
	let quantity, quantityPackages;

	if (type === 'positionGroup' && !positions.length) return null;

	if (type === 'positionGroup') {
		quantity = positions.reduce((sum, position) => {
			return sum + position.receipts.reduce((sum, receipt) => sum + receipt.current.quantity, 0);
		}, 0);
	} else {
		quantity = receipts.reduce((sum, receipt) => sum + receipt.quantity, 0);
	}

	if (unitReceipt === 'nmp' && unitIssue === 'pce') {
		if (type === 'positionGroup') {
			quantityPackages = positions.reduce((sum, position) => {
				return sum + position.receipts.reduce((sum, receipt) => sum + receipt.current.quantityPackages, 0);
			}, 0);
		} else {
			quantityPackages = receipts.reduce((sum, receipt) => sum + receipt.quantityPackages, 0);
		}
	}

	if (type === 'positionGroup') {
		const unitIssueGroup = positions.reduce((unitIssue, position) => {
			return !unitIssue ? position.unitIssue : unitIssue !== position.unitIssue ? 'units' : unitIssue;
		}, '');
		const unitIssueGroupTransform = unitIssueGroup === 'pce' ? 'шт.' : unitIssueGroup === 'nmp' ? 'уп.' : 'ед.';

		const positionExpiring = positions.length ? positions.slice(0).sort(compareQuantity)[0] : undefined;
		const receiptExpiringQuantity = positionExpiring
			? positionExpiring.receipts.reduce((sum, receipt) => sum + receipt.current.quantity, 0)
			: undefined;

		return (
			<div className={qiClasses(dividedPositions)}>
				{!dividedPositions ? (
					<div>
						{quantity + ' ' + unitIssueGroupTransform}
						<span className={qiCircleClasses(quantity, minimumBalance)} />
					</div>
				) : (
					<span className={qiCircleClasses(receiptExpiringQuantity, positionExpiring.minimumBalance)} />
				)}
			</div>
		);
	}

	if (type === 'position' || type === 'receipt') {
		const unitIssueTransform = unitReceipt === 'pce' ? 'шт.' : unitIssue === 'pce' ? 'шт.' : 'уп.';

		return receipts.length ? (
			<div>
				{quantity + ' ' + unitIssueTransform}
				{divided && type === 'position' ? <span className={qiCircleClasses(quantity, minimumBalance)} /> : null}
			</div>
		) : (
			'-'
		);
	}
};

QuantityIndicator.propTypes = {
	children: PropTypes.node,
	dividedPositions: PropTypes.bool,
	type: PropTypes.oneOf(['positionGroup', 'position', 'receipt']).isRequired,
	unitReceipt: PropTypes.oneOf(['pce', 'nmp']),
	unitIssue: PropTypes.oneOf(['pce', 'nmp']),
	receipts: PropTypes.array,
	minimumBalance: PropTypes.number,
	positions: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default QuantityIndicator;
