import MuiButton from '@material-ui/core/Button';
import MuiTableCell from '@material-ui/core/TableCell';
import { red as redColor } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core';

import colorTheme from 'shared/colorTheme';

export const TableCell = withStyles({
	root: {
		'&:first-child': {
			paddingLeft: 0,
		},
		'&:last-child': {
			paddingRight: 0,
		},
	},
	head: {
		paddingTop: 6,
		paddingBottom: 16,
	},
	body: {
		borderTop: `1px solid ${colorTheme.brightness['4']}`,
		borderBottom: 'none',
		padding: '15px 16px',
	},
})(MuiTableCell);

export const ButtonRed = withStyles({
	root: {
		'&:hover': {
			backgroundColor: redColor['50'],
		},
	},
	text: {
		'& $label': {
			color: redColor['600'],
		},
	},
	label: {},
})(MuiButton);
