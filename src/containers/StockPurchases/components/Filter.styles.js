import { InputBase } from 'formik-material-ui';
import { withStyles } from '@material-ui/core';

export const SearchTextField = withStyles({
	root: {
		'& input': {
			backgroundColor: 'transparent !important',
			boxShadow: 'none !important',
			borderRadius: 0,
			minHeight: 40,
			padding: '0 15px',
		},
	},
})(InputBase);
