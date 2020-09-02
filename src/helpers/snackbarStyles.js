import { makeStyles } from '@material-ui/core/styles';

import colorTheme from 'shared/colorTheme';
import { blue as blueColor, orange as orangeColor, red as redColor } from '@material-ui/core/colors';

const useStylesSnackbar = makeStyles(themeDefault => ({
	message: {
		alignItems: 'initial',
		color: colorTheme.blueGrey['700'],
	},
	success: {
		backgroundColor: 'white',
		color: colorTheme.blueGrey['700'],
		'& $message svg[data-icon="check-circle"]': {
			color: colorTheme.teal['300'],
			fontSize: 20,
			marginRight: 10,
		},
	},
	error: {
		backgroundColor: 'white',
		color: colorTheme.blueGrey['700'],
		'& $message svg[data-icon="times-circle"]': {
			color: redColor['600'],
			fontSize: 20,
			marginRight: 10,
		},
	},
	warning: {
		backgroundColor: 'white',
		color: colorTheme.blueGrey['700'],
		'& $message svg[data-icon="exclamation-circle"]': {
			color: orangeColor['600'],
			fontSize: 20,
			marginRight: 10,
		},
	},
	info: {
		backgroundColor: 'white',
		color: colorTheme.blueGrey['700'],
		'& $message svg[data-icon="exclamation-circle"]': {
			color: blueColor['600'],
			fontSize: 20,
			marginRight: 10,
		},
	},
}));

export default useStylesSnackbar;
