import MuiTableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core';

import theme from 'shared/theme';

export const TableCell = withStyles({
	root: {
		padding: '14px 15px',
	},
	head: {
		paddingTop: 18,
		paddingBottom: 18,
	},
	body: {
		borderTop: `1px solid ${theme.brightness.cBr4}`,
		borderBottom: 'none',
	},
})(MuiTableCell);
