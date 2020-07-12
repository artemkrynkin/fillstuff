import MuiTableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core';

import theme from 'shared/theme';

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
		paddingTop: 6,
		paddingBottom: 18,
	},
	body: {
		borderTop: `1px solid ${theme.brightness.cBr4}`,
		borderBottom: 'none',
	},
})(MuiTableCell);