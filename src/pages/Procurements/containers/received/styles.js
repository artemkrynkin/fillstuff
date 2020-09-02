import ColorConvert from 'color-convert';

import MuiTableCell from '@material-ui/core/TableCell';
import { withStyles, makeStyles } from '@material-ui/core';

import colorTheme from 'shared/colorTheme';

export const TableCell = withStyles({
	root: {
		padding: '9px 15px',
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

export const TableRowHighlight = makeStyles({
	root: {
		backgroundColor: `rgba(${ColorConvert.hex.rgb(colorTheme.teal['50'])}, 0.6)`,
	},
});

export const TableCellHighlight = makeStyles({
	root: {
		fontWeight: 600,
	},
});
