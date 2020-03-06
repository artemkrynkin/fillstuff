import MuiButton from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core';

import theme from 'shared/theme';

export const Button = withStyles({
	containedPrimary: {
		backgroundColor: theme.teal.cT400,
		'&:hover': {
			backgroundColor: theme.teal.cT500,
		},
	},
})(MuiButton);
