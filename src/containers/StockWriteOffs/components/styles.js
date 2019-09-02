import MuiTableCell from '@material-ui/core/TableCell';
// import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
// import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
// import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { withStyles } from '@material-ui/core';

import colorPalette from 'shared/colorPalette';

// export const ExpansionPanel = withStyles({
// 	root: {
// 		backgroundColor: 'transparent',
// 		boxShadow: 'none',
// 		marginBottom: 0,
// 		'&$expanded': {
// 			margin: '0',
// 		},
// 		'&$disabled': {
// 			backgroundColor: 'transparent',
// 		},
// 		'.sa-positions__position-group:last-child &': {
// 			borderRadius: '0 0 8px 8px',
// 			overflow: 'hidden',
// 		},
// 	},
// 	rounded: {
// 		'&:first-child': {
// 			borderRadius: 0,
// 		},
// 		'&:last-child': {
// 			borderRadius: 0,
// 		},
// 	},
// 	expanded: {},
// 	disabled: {},
// })(MuiExpansionPanel);
//
// export const ExpansionPanelSummary = withStyles({
// 	root: {
// 		backgroundColor: colorPalette.brightness.cBr2,
// 		minHeight: 'initial',
// 		padding: 0,
// 		'&$expanded': {
// 			minHeight: 'initial',
// 		},
// 		'&$focused': {
// 			backgroundColor: 'transparent',
// 		},
// 		'&$disabled': {
// 			opacity: 1,
// 		},
// 		'&$disabled $expandIcon': {
// 			opacity: 0,
// 		},
// 		'&:hover': {
// 			backgroundColor: colorPalette.brightness.cBr3,
// 		},
// 		'tr:first-child &': {
// 			borderTop: 'none',
// 		},
// 	},
// 	content: {
// 		margin: '0 0 0 -41px',
// 		'&$expanded': {
// 			margin: '0 0 0 -41px',
// 		},
// 	},
// 	expandIcon: {
// 		color: colorPalette.blueGrey.cBg200,
// 		order: -1,
// 		marginLeft: 5,
// 		marginRight: '0 !important',
// 		padding: 8,
// 		transform: 'rotate(-90deg)',
// 		width: 36,
// 		'&$expanded': {
// 			transform: 'rotate(0deg)',
// 		},
// 		'& svg': {
// 			fontSize: 20,
// 		},
// 	},
// 	expanded: {},
// 	focused: {},
// 	disabled: {},
// })(MuiExpansionPanelSummary);
//
// export const ExpansionPanelDetails = withStyles({
// 	root: {
// 		padding: 0,
// 	},
// })(MuiExpansionPanelDetails);

export const TableCell = withStyles({
	root: {
		padding: '14px 15px',
	},
	head: {
		paddingTop: 18,
		paddingBottom: 18,
	},
	body: {
		borderTop: `1px solid ${colorPalette.brightness.cBr4}`,
		borderBottom: 'none',
	},
})(MuiTableCell);
