import MuiTableCell from '@material-ui/core/TableCell';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import { withStyles } from '@material-ui/core';

import colorTheme from 'shared/colorTheme';

export const Accordion = withStyles({
	root: {
		backgroundColor: 'transparent',
		marginBottom: 0,
		'&$expanded': {
			margin: '0',
		},
		'&$disabled': {
			backgroundColor: 'transparent',
		},
		'&:before': {
			display: 'none',
		},
	},
	expanded: {},
	disabled: {},
})(MuiAccordion);

export const AccordionSummary = withStyles({
	root: {
		minHeight: 'initial',
		padding: 0,
		'&$expanded': {
			minHeight: 'initial',
		},
		'&$focusVisible': {
			backgroundColor: 'transparent',
		},
		'&$disabled': {
			opacity: 1,
		},
		'&$disabled $expandIcon': {
			opacity: 0,
		},
		'tr:first-child &': {
			borderTop: 'none',
		},
	},
	content: {
		margin: '0 0 0 -41px',
		'&$expanded': {
			margin: '0 0 0 -41px',
		},
	},
	expandIcon: {
		color: colorTheme.blueGrey['200'],
		order: -1,
		marginLeft: 5,
		marginRight: '0 !important',
		padding: 8,
		transform: 'rotate(-90deg)',
		width: 36,
		'&:hover': {
			color: colorTheme.blueGrey['200'],
		},
		'&$expanded': {
			transform: 'rotate(0deg)',
		},
		'& svg': {
			fontSize: 20,
		},
	},
	expanded: {},
  focusVisible: {},
	disabled: {},
})(MuiAccordionSummary);

export const AccordionDetails = withStyles({
	root: {
		padding: 0,
	},
})(MuiAccordionDetails);

export const TableCellAccordion = withStyles({
	root: {
		padding: '20px 16px',
	},
	body: {
		borderTop: `1px solid ${colorTheme.brightness['4']}`,
		borderBottom: 'none',
	},
})(MuiTableCell);

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
