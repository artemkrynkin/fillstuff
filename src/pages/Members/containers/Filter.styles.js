import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import { red as redColor } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core';

export const SearchTextField = withStyles({
	root: {
		backgroundColor: 'transparent !important',
		boxShadow: 'none !important',
		borderRadius: 0,
		minHeight: 40,
		'& input': {
			padding: '7px 15px',
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
