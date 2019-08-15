import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { withStyles } from '@material-ui/core';

import colorPalette from 'shared/colorPalette';

export const ExpansionPanel = withStyles({
	root: {
		border: 'none',
		boxShadow: 'none',
		'&:before': {
			display: 'none',
		},
		'&$expanded': {
			backgroundColor: colorPalette.slateGrey.cSg5,
			borderRadius: 0,
			margin: 0,
			paddingBottom: 10,
			opacity: 1,
			'&:hover': {
				backgroundColor: colorPalette.slateGrey.cSg5,
			},
		},
	},
	expanded: {},
})(MuiExpansionPanel);

export const ExpansionPanelSummary = withStyles({
	root: {
		minHeight: 42,
		'&$expanded': {
			minHeight: 42,
		},
		'&$focused': {
			backgroundColor: 'transparent',
		},
	},
	content: {
		'&$expanded': {
			margin: '12px 0',
		},
	},
	focused: {},
	expanded: {},
})(MuiExpansionPanelSummary);
