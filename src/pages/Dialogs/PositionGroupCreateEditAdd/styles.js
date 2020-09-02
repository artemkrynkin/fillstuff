import InputBase from '@material-ui/core/InputBase';
import { withStyles } from '@material-ui/core';

import colorTheme from 'shared/colorTheme';

export const SearchTextField = withStyles({
	root: {
		borderBottom: `1px solid ${colorTheme.brightness['5']}`,
		borderTop: `1px solid ${colorTheme.brightness['5']}`,
		boxShadow: 'none !important',
		borderRadius: 0,
		minHeight: 42,
		'& input': {
			padding: '7px 20px',
		},
	},
})(InputBase);
