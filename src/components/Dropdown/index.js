import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';

const Dropdown = props => {
	const { anchor, open, onClose, header, children, style, innerContentStyle, ...remainingProps } = props;
	const [scrollTop, setScrollTop] = useState(0);
	const scrollRef = useRef(null);

	const handleClose = event => {
		if (anchor.current && anchor.current.contains(event.target)) return;

		onClose();
	};

	const handleScroll = event => {
		setScrollTop(event.currentTarget.scrollTop);
	};

	useEffect(() => {
		if (scrollRef.current && open) {
			scrollRef.current.scrollTop = scrollTop;
		}
	});

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
					<Paper style={{ overflow: 'hidden' }} elevation={3}>
						<ClickAwayListener onClickAway={handleClose}>
							<div>
								{header ? header : null}
								<div ref={scrollRef} onScroll={handleScroll} style={innerContentStyle}>
									{children}
								</div>
							</div>
						</ClickAwayListener>
					</Paper>
				</Fade>
			)}
		</Popper>
	);
};

Dropdown.propTypes = {
	anchor: PropTypes.object.isRequired,
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	header: PropTypes.node,
};

export default Dropdown;
