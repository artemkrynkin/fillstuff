import MuiTableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core';

import colorTheme from 'shared/colorTheme';

export const TableCell = withStyles({
	head: {
		borderBottom: 'none',
	},
	body: {
		borderTop: `1px solid ${colorTheme.brightness['4']}`,
		borderBottom: 'none',
		padding: '11px 16px',
	},
})(MuiTableCell);
