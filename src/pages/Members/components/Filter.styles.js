import InputBase from '@material-ui/core/InputBase';
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
