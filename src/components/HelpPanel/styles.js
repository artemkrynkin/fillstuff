import ColorConvert from 'color-convert';

import { makeStyles } from '@material-ui/core/styles';

import colorTheme from 'shared/colorTheme';

const hexToRgb = color => ColorConvert.hex.rgb(color);

export const useStylesAvatar = makeStyles(({ transitions }) => ({
	root: {
		'&:after': {
			display: 'none',
		},
		boxShadow: active =>
			active ? `0 0 0 2px ${colorTheme.slateGrey['1']}` : `0 0 0 2px rgba(${hexToRgb(colorTheme.slateGrey['2'])}, 0.5)`,
		transition: transitions.create(['box-shadow'], { duration: transitions.duration.shortest }),
	},
	colorDefault: {
		backgroundColor: active => (!active ? 'transparent' : `rgba(${hexToRgb(colorTheme.slateGrey['2'])}, 0.2)`),
		transition: transitions.create(['background-color', 'box-shadow'], { duration: transitions.duration.shortest }),
	},
	fallback: {
		color: active => (!active ? `rgba(${hexToRgb(colorTheme.slateGrey['2'])}, 0.5)` : colorTheme.slateGrey['1']),
		transition: transitions.create('color', { duration: transitions.duration.shortest }),
	},
}));
