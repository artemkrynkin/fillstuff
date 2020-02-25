import React from 'react';
import PropTypes from 'prop-types';

import ReactNumberFormat from 'react-number-format';

const NumberFormat = props => {
	const { inputRef, onChange, ...remainingProps } = props;

	return (
		<ReactNumberFormat
			getInputRef={inputRef}
			onValueChange={
				props.displayType === 'text'
					? () => {}
					: values => {
							onChange({
								target: {
									name: props.name,
									...values,
								},
							});
					  }
			}
			{...remainingProps}
		/>
	);
};

NumberFormat.propTypes = {
	inputRef: PropTypes.func,
	onChange: PropTypes.func,
};

export const moneyFormatProps = {
	decimalSeparator: '.',
	thousandSeparator: ' ',
	decimalScale: 2,
};

export const currencyMoneyFormatProps = {
	decimalSeparator: '.',
	thousandSeparator: ' ',
	decimalScale: 2,
	allowNegative: false,
	suffix: ' ₽',
};

export const moneyInputFormatProps = {
	// thousandSeparator: ' ',
	decimalScale: 2,
	allowNegative: false,
	// suffix: ' ₽',
	isAllowed: values => {
		const { formattedValue, floatValue } = values;
		return formattedValue === '' || floatValue <= 9999999;
	},
};

export default NumberFormat;
