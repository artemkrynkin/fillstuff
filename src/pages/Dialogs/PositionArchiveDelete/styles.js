import MuiButton from '@material-ui/core/Button';
import { red as redColor } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core';

import ColorConvert from 'color-convert';

export const ButtonRed = withStyles({
	root: {},
	label: {
		'$outlinedPrimary &': {
			color: redColor['600'],
		},
	},
	containedPrimary: {
		backgroundColor: redColor['400'],
		boxShadow: [
			`0 1px 5px 0 rgba(${ColorConvert.hex.rgb(redColor['600'])}, 0.2)`,
			`0 2px 2px 0 rgba(${ColorConvert.hex.rgb(redColor['600'])}, 0.14)`,
			`0 3px 1px -2px rgba(${ColorConvert.hex.rgb(redColor['600'])}, 0.12)`,
		].join(),
		'&:hover': {
			backgroundColor: redColor['600'],
			boxShadow: [
				`0 2px 4px -1px rgba(${ColorConvert.hex.rgb(redColor['600'])}, 0.2)`,
				`0 4px 5px 0 rgba(${ColorConvert.hex.rgb(redColor['600'])}, 0.14)`,
				`0 1px 10px 0 rgba(${ColorConvert.hex.rgb(redColor['600'])}, 0.12)`,
			].join(),
		},
		'&:active': {
			boxShadow: [
				`0 1px 5px 0 rgba(${ColorConvert.hex.rgb(redColor['600'])}, 0.2)`,
				`0 2px 2px 0 rgba(${ColorConvert.hex.rgb(redColor['600'])}, 0.14)`,
				`0 3px 1px -2px rgba(${ColorConvert.hex.rgb(redColor['600'])}, 0.12)`,
			].join(),
		},
	},
	outlinedPrimary: {
		color: redColor['600'],
		border: `1px solid ${redColor['200']}`,
		'&:hover': {
			backgroundColor: redColor['50'],
			border: `1px solid ${redColor['600']}`,
		},
	},
})(MuiButton);
