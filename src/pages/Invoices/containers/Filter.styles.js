import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import { red as redColor } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core';

import theme from 'shared/theme';

export const FilterSearchTextField = withStyles({
	root: {
		backgroundColor: 'transparent !important',
		borderBottom: `1px solid ${theme.brightness.cBr5}`,
		boxShadow: 'none !important',
		borderRadius: 0,
		minHeight: 40,
		'& input': {
			padding: '6px 10px',
		},
	},
})(InputBase);

export const IconButtonRed = withStyles({
	colorPrimary: {
		color: redColor['400'],
		'&:hover': {
			backgroundColor: redColor['50'],
		},
	},
})(IconButton);
