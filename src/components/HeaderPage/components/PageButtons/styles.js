import MuiButton from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core';

import theme from 'shared/theme';

export const Button = withStyles({
	containedPrimary: {
		backgroundColor: theme.teal['400'],
		'&:hover': {
			backgroundColor: theme.teal['500'],
		},
	},
})(MuiButton);
