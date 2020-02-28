import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tooltip from '@material-ui/core/Tooltip';

import { formatNumber } from 'shared/utils';

import NumberFormat, { currencyMoneyFormatProps } from 'src/components/NumberFormat';

import styles from './Positions.module.css';

const priceDisplayChangeIconClasses = priceChangeIsGood =>
	ClassNames({
		[styles.priceDisplayChangeIcon]: true,
		[styles.priceDisplayChangeIcon_green]: priceChangeIsGood,
		[styles.priceDisplayChangeIcon_red]: !priceChangeIsGood,
	});

const PriceDisplay = props => {
	const { receiptsReceived, receiptNearestPrice, unitReceipt, unitIssue, quantity, isFree, price, priceChangeIsGood, title } = props;

	if (!isFree && receiptsReceived.length && receiptNearestPrice !== price)
		return (
			<Tooltip
				title={
					<div style={{ textAlign: 'center' }}>
						После списания {quantity} {unitReceipt === 'pce' ? 'шт.' : unitIssue === 'pce' ? 'шт.' : 'уп.'}
						<br />
						{title} {receiptNearestPrice > price ? 'повысится' : 'снизится'} до {formatNumber(receiptNearestPrice, { toString: true })} ₽
					</div>
				}
				interactive
			>
				<div style={{ display: 'inline-block' }}>
					<NumberFormat
						value={formatNumber(price, { toString: true })}
						renderText={value => value}
						displayType="text"
						{...currencyMoneyFormatProps}
					/>
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
	else if (!isFree) return `${formatNumber(price, { toString: true })} ₽`;
	else return <span className={styles.caption}>Бесплатно</span>;
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
