import { withStyles } from '@material-ui/core/styles';
import ColorConvert from 'color-convert';

import AvatarCustom from 'src/components/Avatar';

import colorTheme from 'shared/colorTheme';

const hexToRgb = color => ColorConvert.hex.rgb(color);

export const Avatar = withStyles({
	colorDefault: {
		backgroundColor: 'white',
		border: `2px solid rgba(${hexToRgb(colorTheme.blueGrey['100'])}, 0.8)`,
	},
})(AvatarCustom);
