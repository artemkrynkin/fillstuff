import MuiTableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core';

import colorTheme from 'shared/colorTheme';

export const TableCell = withStyles({
	root: {
		padding: '14px 15px',
		'&:first-child': {
			paddingLeft: 0,
		},
		'&:last-child': {
			paddingRight: 0,
		},
	},
	head: {
		paddingTop: 18,
		paddingBottom: 18,
	},
	body: {
		borderTop: `1px solid ${colorTheme.brightness['4']}`,
		borderBottom: 'none',
	},
})(MuiTableCell);
