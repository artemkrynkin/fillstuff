import MuiTableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core';

import colorTheme from 'shared/colorTheme';

export const TableCell = withStyles({
	root: {},
	head: {},
	body: {
		borderTop: `1px solid ${colorTheme.brightness['4']}`,
		borderBottom: 'none',
		padding: '9px 15px',
	},
})(MuiTableCell);
