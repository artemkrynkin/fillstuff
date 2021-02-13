import { withStyles } from '@material-ui/core/styles';

import StepConnector from '@material-ui/core/StepConnector';

import colorTheme from 'shared/colorTheme';

export default withStyles({
	alternativeLabel: {
		top: 10,
		left: 'calc(-50% + 11px)',
		right: 'calc(50% + 11px)',
		zIndex: 1,
	},
	active: {
		'& $line': {
			borderColor: colorTheme.teal['300'],
		},
	},
	completed: {
		'& $line': {
			borderColor: colorTheme.teal['300'],
		},
	},
	line: {
		borderColor: colorTheme.blueGrey['100'],
		borderTopWidth: 3,
	},
})(StepConnector);
