import React from 'react';
import PropTypes from 'prop-types';

import ReactNumberFormat from 'react-number-format';

const NumberFormat = props => {
	const { inputRef, onChange, ...remainingProps } = props;

	return (
		<ReactNumberFormat
			getInputRef={inputRef}
			onValueChange={values => {
				onChange({
					target: {
						name: props.name,
						...values,
					},
				});
			}}
			{...remainingProps}
		/>
	);
};

NumberFormat.propTypes = {
	inputRef: PropTypes.func,
	onChange: PropTypes.func,
};

export default NumberFormat;
