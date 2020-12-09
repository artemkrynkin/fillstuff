import React from 'react';
import PropTypes from 'prop-types';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';

const Dropdown = props => {
	const { anchor, open, onClose, header, footer, children, style, innerContentStyle, stopPropagation, ...remainingProps } = props;

	const popperStyle = {
		zIndex: 1300,
		...style,
	};

	return (
		<Popper anchorEl={anchor.current} open={open} style={popperStyle} transition disablePortal {...remainingProps}>
			{({ TransitionProps, placement }) => (
				<Fade
					{...TransitionProps}
					style={{
						transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
						timeout: 150,
					}}
				>
					<Paper onClick={stopPropagation ? event => event.stopPropagation() : null} style={{ overflow: 'hidden' }} elevation={3}>
						<ClickAwayListener onClickAway={onClose}>
							<div>
								{header ? header : null}
								<div style={innerContentStyle}>{children}</div>
								{footer ? footer : null}
							</div>
						</ClickAwayListener>
					</Paper>
				</Fade>
			)}
		</Popper>
	);
};

Dropdown.defaultProps = {
	stopPropagation: false,
};

Dropdown.propTypes = {
	anchor: PropTypes.object.isRequired,
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	header: PropTypes.node,
	footer: PropTypes.node,
	stopPropagation: PropTypes.bool,
};

export default Dropdown;
