import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';

function arrowGenerator(color) {
	return {
		'&[x-placement*="bottom"] $arrow': {
			top: 0,
			left: 0,
			marginTop: '-0.95em',
			width: '2em',
			height: '1em',
			'&::before': {
				borderWidth: '0 1em 1em 1em',
				borderColor: `transparent transparent ${color} transparent`,
			},
		},
		'&[x-placement*="top"] $arrow': {
			bottom: 0,
			left: 0,
			marginBottom: '-0.95em',
			width: '2em',
			height: '1em',
			'&::before': {
				borderWidth: '1em 1em 0 1em',
				borderColor: `${color} transparent transparent transparent`,
			},
		},
		'&[x-placement*="right"] $arrow': {
			left: 0,
			marginLeft: '-0.95em',
			height: '2em',
			width: '1em',
			'&::before': {
				borderWidth: '1em 1em 1em 0',
				borderColor: `transparent ${color} transparent transparent`,
			},
		},
		'&[x-placement*="left"] $arrow': {
			right: 0,
			marginRight: '-0.95em',
			height: '2em',
			width: '1em',
			'&::before': {
				borderWidth: '1em 0 1em 1em',
				borderColor: `transparent transparent transparent ${color}`,
			},
		},
	};
}

const useStylesArrow = makeStyles(() => ({
	arrow: {
		position: 'absolute',
		fontSize: 6,
		'&::before': {
			content: '""',
			margin: 'auto',
			display: 'block',
			width: 0,
			height: 0,
			borderStyle: 'solid',
		},
	},
	popper: arrowGenerator('white'),
}));

const Dropdown = props => {
	const { anchor, open, onClose, arrow, headerElement, children, style, innerContentStyle, ...remainingProps } = props;
	const { arrow: arrowClasses, popper } = useStylesArrow();
	const [arrowRef, setArrowRef] = useState(null);
	const [scrollTop, setScrollTop] = useState(0);
	const scrollRef = useRef(null);

	const handleClose = event => {
		if (anchor.current && anchor.current.contains(event.target)) return;

		onClose();
	};

	const handleScroll = event => {
		setScrollTop(event.currentTarget.scrollTop);
	};

	if (scrollRef.current) scrollRef.current.scrollTop = scrollTop;

	const popperStyle = {
		zIndex: 1300,
		...style,
	};

	return (
		<Popper
			anchorEl={anchor.current}
			open={open}
			modifiers={{
				arrow: {
					enabled: arrow,
					element: arrowRef,
				},
			}}
			className={popper}
			style={popperStyle}
			transition
			disablePortal
			{...remainingProps}
		>
			{({ TransitionProps, placement }) => (
				<Fade
					{...TransitionProps}
					style={{
						transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
						timeout: 150,
					}}
				>
					<Paper style={{ overflow: 'hidden' }} elevation={3}>
						{arrow ? <span className={arrowClasses} ref={setArrowRef} /> : null}
						<ClickAwayListener onClickAway={handleClose}>
							<div>
								{headerElement ? headerElement : null}
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

Dropdown.defaultProps = {
	arrow: true,
};

Dropdown.propTypes = {
	anchor: PropTypes.object.isRequired,
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	headerElement: PropTypes.node,
};

export default Dropdown;
