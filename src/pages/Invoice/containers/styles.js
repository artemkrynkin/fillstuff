import MuiTableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core';

import theme from 'shared/theme';

export const TableCell = withStyles({
	root: {},
	head: {},
	body: {
		borderTop: `1px solid ${theme.brightness['4']}`,
		borderBottom: 'none',
		padding: '9px 15px',
	},
})(MuiTableCell);
