import React from 'react';
import PropTypes from 'prop-types';

import Tooltip from '@material-ui/core/Tooltip';

const SliderTooltip = props => {
	const { children, open, value } = props;

	console.log(children);

	return (
		<Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
			{children}
		</Tooltip>
	);
};

SliderTooltip.propTypes = {
	children: PropTypes.element.isRequired,
	open: PropTypes.bool.isRequired,
	value: PropTypes.number.isRequired,
};

export default SliderTooltip;
