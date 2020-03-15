import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import styles from './index.module.css';

const qiClasses = ClassNames({
	[styles.container]: true,
	[styles.disappearing]: true,
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
	const { type, unitReceipt, unitRelease, minimumBalance, receipts, positions } = props;

	let quantity = 0;
	let quantityPackages = 0;
	let quantityInUnit = 0;

	if (type === 'positionGroup' && !positions.length) return null;

	if (type === 'positionGroup') {
		quantity = positions.reduce((sum, position) => {
			return sum + position.receipts.reduce((sum, receipt) => sum + receipt.current.quantity, 0);
		}, 0);
	} else {
		receipts.forEach(receipt => {
			quantity += receipt.quantity;

			if (receipt.quantityPackages) quantityPackages += receipt.quantityPackages;
			if (receipt.quantityInUnit) quantityInUnit = receipt.quantityInUnit;
		});
	}

	if (type === 'positionGroup') {
		const positionExpiring = positions.length ? positions.slice(0).sort(compareQuantity)[0] : undefined;
		const receiptExpiringQuantity =
			positionExpiring && positionExpiring.receipts.reduce((sum, receipt) => sum + receipt.current.quantity, 0);

		return (
			<div className={qiClasses}>
				<span className={qiCircleClasses(receiptExpiringQuantity, positionExpiring.minimumBalance)} />
			</div>
		);
	}

	if (type === 'position' || type === 'receipt' || type === 'procurementReceipt') {
		const unitReleaseTransform = unitReceipt === 'pce' ? 'шт.' : unitRelease === 'pce' ? 'шт.' : 'уп.';

		return receipts.length ? (
			<div className={styles.container}>
				{type === 'procurementReceipt' && unitReceipt === 'nmp' && unitRelease === 'pce' ? (
					<div className={styles.quantityContainer}>
						<span className={styles.quantityLarge}>{`${quantity} ${unitReleaseTransform}`}</span>
						<span className={styles.quantitySmall}>{`${quantityPackages} уп. по ${quantityInUnit} шт.`}</span>
					</div>
				) : (
					`${quantity} ${unitReleaseTransform}`
				)}
				{minimumBalance ? (
					<span className={styles.minimumBalance} style={{ marginLeft: 5 }}>
						{`/ ${minimumBalance}`}
					</span>
				) : null}
				{minimumBalance ? <span className={qiCircleClasses(quantity, minimumBalance)} /> : null}
			</div>
		) : (
			'-'
		);
	}
};

QuantityIndicator.propTypes = {
	children: PropTypes.node,
	type: PropTypes.oneOf(['positionGroup', 'position', 'receipt', 'procurementReceipt']).isRequired,
	unitReceipt: PropTypes.oneOf(['pce', 'nmp']),
	unitRelease: PropTypes.oneOf(['pce', 'nmp']),
	receipts: PropTypes.array,
	minimumBalance: PropTypes.number,
	positions: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default QuantityIndicator;
