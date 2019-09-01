import MuiTextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core';

import colorPalette from 'shared/colorPalette';

export const SearchTextField = withStyles({
	root: {
		borderBottom: `1px solid ${colorPalette.brightness.cBr5}`,
		borderTop: `1px solid ${colorPalette.brightness.cBr5}`,
		'& input': {
			boxShadow: 'none !important',
			borderRadius: 0,
			minHeight: 40,
			padding: '0 25px',
		},
	},
})(MuiTextField);
