import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import './index.styl';

const quantityIndicatorClasses = dividedMarkers =>
	ClassNames({
		'quantity-indicator': true,
		'quantity-indicator_disappearing': dividedMarkers,
	});

const quantityIndicatorCircleClasses = (quantity, minimumBalance) =>
	ClassNames({
		'quantity-indicator__circle': true,
		'quantity-indicator__circle_red': (quantity / minimumBalance) * 100 <= 100,
		'quantity-indicator__circle_yellow': (quantity / minimumBalance) * 100 > 100 && (quantity / minimumBalance) * 100 <= 150,
		'quantity-indicator__circle_green': (quantity / minimumBalance) * 100 > 150,
	});

const compareQuantity = (a, b) => {
	if (a.quantity > b.quantity) return 1;
	if (a.quantity === b.quantity) return 0;
	if (a.quantity < b.quantity) return -1;
};

const QuantityIndicator = props => {
	const { type, dividedMarkers, receiptUnits, unitIssue, quantity, minimumBalance, markers } = props;

	if (type === 'product') {
		const markerExpiring = markers ? markers.sort(compareQuantity)[0] : undefined;

		return (
			<div className={quantityIndicatorClasses(dividedMarkers)}>
				{dividedMarkers ? (
					<div className={quantityIndicatorCircleClasses(markerExpiring.quantity, markerExpiring.minimumBalance)} />
				) : (
					<div>
						{quantity} {receiptUnits === 'pce' ? 'шт.' : unitIssue === 'pce' ? 'шт.' : 'уп.'}
						{receiptUnits === 'nmp' && unitIssue === 'pce' ? (
							<span className="quantity-indicator__quantity-packages">
								{markers.reduce((sum, marker) => sum + Math.ceil(marker.quantityPackages), 0)} уп.
							</span>
						) : null}
						<div className={quantityIndicatorCircleClasses(quantity, minimumBalance)} />
					</div>
				)}
			</div>
		);
	}

	if (type === 'marker')
		return (
			<div className="quantity-indicator">
				{quantity} {receiptUnits === 'pce' ? 'шт.' : unitIssue === 'pce' ? 'шт.' : 'уп.'}
				{dividedMarkers ? <div className={quantityIndicatorCircleClasses(quantity, minimumBalance)} /> : null}
			</div>
		);
};

QuantityIndicator.propTypes = {
	children: PropTypes.node,
	type: PropTypes.oneOf(['product', 'marker']).isRequired,
	dividedMarkers: PropTypes.bool.isRequired,
	receiptUnits: PropTypes.oneOf(['pce', 'nmp']).isRequired,
	unitIssue: PropTypes.oneOf(['pce', 'nmp']),
	quantity: PropTypes.number,
	minimumBalance: PropTypes.number,
	markers: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default QuantityIndicator;
