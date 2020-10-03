import ColorConvert from 'color-convert';

import MuiTableCell from '@material-ui/core/TableCell';
import { withStyles, makeStyles } from '@material-ui/core';

import colorTheme from 'shared/colorTheme';

export const useStylesProcurementExpected = makeStyles(theme => ({
	card: {
		cursor: 'pointer',
		minHeight: 165,
		position: 'relative',
		transition: 'box-shadow 150ms ease-out',
		'&:hover': {
			boxShadow: theme.shadows[3],
		},
	},
}));

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
