import InputBase from '@material-ui/core/InputBase';
import { withStyles } from '@material-ui/core';

import colorTheme from 'shared/colorTheme';

export const FilterSearchTextField = withStyles({
	root: {
		backgroundColor: 'transparent !important',
		borderBottom: `1px solid ${colorTheme.brightness['5']}`,
		boxShadow: 'none !important',
		borderRadius: 0,
		minHeight: 40,
		'& input': {
			padding: '6px 10px',
		},
	},
})(InputBase);
