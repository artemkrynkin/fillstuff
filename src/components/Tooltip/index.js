import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ColorConvert from 'color-convert';

import MuiTooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/core/styles';

import theme from 'shared/theme';

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
	tooltip: {
		backgroundColor: `rgba(${ColorConvert.hex.rgb(theme.slateGrey.cSg5)}, 0.9)`,
		fontWeight: 400,
		position: 'relative',
	},
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
	popper: arrowGenerator(`rgba(${ColorConvert.hex.rgb(theme.slateGrey.cSg5)}, 0.9)`),
}));

const Tooltip = props => {
	const { arrow = true, ...remainingProps } = props;
	const { arrow: arrowClasses, ...classes } = useStylesArrow();
	const [arrowRef, setArrowRef] = useState(null);

	return (
		<MuiTooltip
			classes={classes}
			enterDelay={50}
			leaveDelay={100}
			TransitionComponent={Fade}
			TransitionProps={{ timeout: 150 }}
			PopperProps={{
				popperOptions: {
					modifiers: {
						arrow: {
							enabled: arrow,
							element: arrowRef,
						},
					},
				},
			}}
			{...remainingProps}
			title={
				<React.Fragment>
					{props.title}
					{arrow ? <span className={arrowClasses} ref={setArrowRef} /> : null}
				</React.Fragment>
			}
		/>
	);
};

Tooltip.propTypes = {
	title: PropTypes.node,
	arrow: PropTypes.bool,
};

export default Tooltip;
