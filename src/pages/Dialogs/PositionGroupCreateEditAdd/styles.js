import InputBase from '@material-ui/core/InputBase';
import { withStyles } from '@material-ui/core';

import theme from 'shared/theme';

export const SearchTextField = withStyles({
	root: {
		borderBottom: `1px solid ${theme.brightness['5']}`,
		borderTop: `1px solid ${theme.brightness['5']}`,
		boxShadow: 'none !important',
		borderRadius: 0,
		minHeight: 42,
		'& input': {
			padding: '7px 20px',
		},
	},
})(InputBase);
