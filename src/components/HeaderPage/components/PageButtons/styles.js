import MuiButton from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core';

import colorTheme from 'shared/colorTheme';

export const Button = withStyles({
	containedPrimary: {
		backgroundColor: colorTheme.teal['400'],
		'&:hover': {
			backgroundColor: colorTheme.teal['500'],
		},
	},
})(MuiButton);
