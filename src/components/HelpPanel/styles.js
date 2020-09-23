import ColorConvert from 'color-convert';

import { makeStyles } from '@material-ui/core/styles';

import colorTheme from 'shared/colorTheme';

const hexToRgb = color => ColorConvert.hex.rgb(color);

export const useStylesAvatar = makeStyles(({ transitions }) => ({
	root: {
		backgroundColor: active => (!active ? 'transparent' : `rgba(${hexToRgb(colorTheme.slateGrey['2'])}, 0.2)`),
		border: `2px solid rgba(${hexToRgb(colorTheme.slateGrey['2'])}, 0.8)`,
		borderColor: active => (active ? colorTheme.slateGrey['1'] : null),
		transition: transitions.create(['background-color', 'border-color'], { duration: transitions.duration.shortest }),
	},
	fallback: {
		color: active => (!active ? `rgba(${hexToRgb(colorTheme.slateGrey['2'])}, 0.5)` : `rgba(${hexToRgb(colorTheme.slateGrey['2'])}, 0.7)`),
		transition: transitions.create('color', { duration: transitions.duration.shortest }),
	},
}));
