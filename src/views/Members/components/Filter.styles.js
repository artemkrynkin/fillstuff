import InputBase from '@material-ui/core/InputBase';
import { withStyles } from '@material-ui/core';

export const SearchTextField = withStyles({
	root: {
		backgroundColor: 'transparent !important',
		boxShadow: 'none !important',
		borderRadius: 0,
		fontSize: 14,
		minHeight: 40,
	},
	input: {
		padding: '7px 36px 7px 16px',
	},
})(InputBase);
