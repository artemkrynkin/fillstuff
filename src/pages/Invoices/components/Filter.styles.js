import InputBase from '@material-ui/core/InputBase';
import { withStyles } from '@material-ui/core';

import theme from 'shared/theme';

export const FilterSearchTextField = withStyles({
	root: {
		'& input': {
			backgroundColor: 'transparent !important',
			borderBottom: `1px solid ${theme.brightness.cBr5}`,
			boxShadow: 'none !important',
			borderRadius: 0,
			minHeight: 40,
			padding: '0 10px',
		},
	},
})(InputBase);
