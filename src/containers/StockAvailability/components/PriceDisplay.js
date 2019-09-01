import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Tooltip from 'src/components/Tooltip';

const priceDisplayChangeIconClasses = priceChangeIsGood =>
	ClassNames({
		'sa-positions__price-display-change-icon': true,
		'sa-positions__price-display-change-icon_green': priceChangeIsGood,
		'sa-positions__price-display-change-icon_red': !priceChangeIsGood,
	});

const PriceDisplay = props => {
	const { receiptsReceived, receiptNearestPrice, unitReceipt, unitIssue, quantity, isFree, price, priceChangeIsGood, title } = props;

	if (receiptsReceived.length && receiptNearestPrice !== price)
		return (
			<Tooltip
				title={
					<div style={{ textAlign: 'center' }}>
						После списания {quantity} {unitReceipt === 'pce' ? 'шт.' : unitIssue === 'pce' ? 'шт.' : 'уп.'}
						<br />
						{title} {receiptNearestPrice > price ? 'повысится' : 'снизится'} до {receiptNearestPrice} ₽
					</div>
				}
				interactive
			>
				<div style={{ display: 'inline-block' }}>
					{!isFree ? price : '-'} ₽
					{receiptNearestPrice > price ? (
						<span className={priceDisplayChangeIconClasses(priceChangeIsGood)}>
							<FontAwesomeIcon icon={['far', 'chevron-up']} />
						</span>
					) : (
						<span className={priceDisplayChangeIconClasses(!priceChangeIsGood)}>
							<FontAwesomeIcon icon={['far', 'chevron-down']} />
						</span>
					)}
				</div>
			</Tooltip>
		);
	else return `${!isFree ? price + ' ₽' : '-'}`;
};

PriceDisplay.propTypes = {
	unitReceipt: PropTypes.oneOf(['nmp', 'pce']),
	unitIssue: PropTypes.oneOf(['nmp', 'pce']),
	quantity: PropTypes.number,
	isFree: PropTypes.bool,
	price: PropTypes.number,
	receiptNearestPrice: PropTypes.number,
	receiptsReceived: PropTypes.array,
	priceChangeIsGood: PropTypes.bool,
	title: PropTypes.string.isRequired,
};

export default PriceDisplay;
