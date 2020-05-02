import ColorConvert from 'color-convert';

import MuiTableCell from '@material-ui/core/TableCell';
import { withStyles, makeStyles } from '@material-ui/core';

import theme from 'shared/theme';

export const TableCell = withStyles({
	root: {
		padding: '9px 15px',
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

export const TableRowHighlight = makeStyles({
	root: {
		backgroundColor: `rgba(${ColorConvert.hex.rgb(theme.teal.cT50)}, 0.6)`,
	},
});

export const TableCellHighlight = makeStyles({
	root: {
		fontWeight: 600,
	},
});
