import { withStyles } from '@material-ui/core/styles';

import AvatarCustom from 'src/components/Avatar';

import colorTheme from 'shared/colorTheme';

export const Avatar = withStyles({
	root: {
		backgroundColor: 'transparent',
		color: colorTheme.blueGrey['100'],
	},
})(AvatarCustom);
