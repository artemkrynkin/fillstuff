import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import { declensionNumber } from 'src/helpers/utils';

import styles from './index.module.css';

const qiClasses = dividedPositions =>
	ClassNames({
		[styles.disappearing]: dividedPositions,
	});

const qiTextClasses = ClassNames({
	[styles.minimumBalance]: true,
	[styles.circleText]: true,
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
	const { type, dividedPositions, divided, unitReceipt, unitRelease, minimumBalance, receipts, positions } = props;

	let quantity;

	if (type === 'positionGroup' && !positions.length) return null;

	if (type === 'positionGroup') {
		quantity = positions.reduce((sum, position) => {
			return sum + position.receipts.reduce((sum, receipt) => sum + receipt.current.quantity, 0);
		}, 0);
	} else {
		quantity = receipts.reduce((sum, receipt) => sum + receipt.quantity, 0);
	}

	if (type === 'positionGroup') {
		const unitReleaseGroup = positions.reduce((unitRelease, position) => {
			return !unitRelease ? position.unitRelease : unitRelease !== position.unitRelease ? 'units' : unitRelease;
		}, '');
		const unitReleaseGroupTransform = unitReleaseGroup === 'pce' ? 'шт.' : unitReleaseGroup === 'nmp' ? 'уп.' : 'ед.';

		const positionExpiring = positions.length ? positions.slice(0).sort(compareQuantity)[0] : undefined;
		const receiptExpiring =
			positionExpiring &&
			positionExpiring.receipts.reduce(
				(indicators, receipt) => {
					indicators.quantity += receipt.current.quantity;
					indicators.positions += 1;

					return indicators;
				},
				{
					quantity: 0,
					positions: 0,
				}
			);

		return (
			<div className={qiClasses(dividedPositions)}>
				{!dividedPositions ? (
					<div>
						<span className={styles.quantity}>{quantity + ' ' + unitReleaseGroupTransform}</span>
						<span className={styles.minimumBalance} style={{ marginLeft: 5 }}>
							{'/ ' + minimumBalance}
						</span>
						<span className={qiCircleClasses(quantity, minimumBalance)} />
					</div>
				) : (
					<div>
						{(receiptExpiring.quantity / positionExpiring.minimumBalance) * 100 > 100 &&
						(receiptExpiring.quantity / positionExpiring.minimumBalance) * 100 <= 150 ? (
							<span className={qiTextClasses} style={{ marginLeft: 5 }}>
								{declensionNumber(
									receiptExpiring.positions,
									['Одна из позиций заканчивается', 'Две позиции заканчиваются', 'Несколько позиций заканчиваются'],
									false
								)}
							</span>
						) : null}
						<span className={qiCircleClasses(receiptExpiring.quantity, positionExpiring.minimumBalance)} />
					</div>
				)}
			</div>
		);
	}

	if (type === 'position' || type === 'receipt') {
		const unitReleaseTransform = unitReceipt === 'pce' ? 'шт.' : unitRelease === 'pce' ? 'шт.' : 'уп.';

		return receipts.length ? (
			<div>
				<span className={styles.quantity}>{quantity + ' ' + unitReleaseTransform}</span>
				{divided ? (
					<span className={styles.minimumBalance} style={{ marginLeft: 5 }}>
						{'/ ' + minimumBalance}
					</span>
				) : null}
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
	unitRelease: PropTypes.oneOf(['pce', 'nmp']),
	receipts: PropTypes.array,
	minimumBalance: PropTypes.number,
	positions: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default QuantityIndicator;
