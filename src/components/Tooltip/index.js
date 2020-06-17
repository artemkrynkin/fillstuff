import React, { useState } from 'react';
import PropTypes from 'prop-types';

import MuiTooltip from '@material-ui/core/Tooltip';
// import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const Tooltip = props => {
	const { children, open: initialOpen, style, className, ...remainingProps } = props;
	const [open, setOpen] = useState(initialOpen);

	const onHandleOpen = value => setOpen(value === null || value === undefined ? value => !value : value);

	// const onClickAway = (event, value) => {
	//   if (event.target.closest(`div[id=${id}]`) && event.target.closest(`div[id=${id}]`).id === id) {
	//     console.log(event.target, event.target.closest(`div[id=${id}]`).id);
	//   }
	// };

	return (
		// <ClickAwayListener onClickAway={event => onClickAway(event, false)}>
		<MuiTooltip onOpen={() => onHandleOpen(true)} onClose={() => onHandleOpen(false)} open={open} {...remainingProps}>
			<div className={className} onClick={() => onHandleOpen()} style={{ cursor: 'pointer', ...style }}>
				{children}
			</div>
		</MuiTooltip>
		// </ClickAwayListener>
	);
};

Tooltip.defaultProps = {
	className: '',
	open: false,
};

Tooltip.propTypes = {
	className: PropTypes.string,
	open: PropTypes.bool,
};

export default Tooltip;
