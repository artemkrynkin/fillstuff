import { makeStyles } from '@material-ui/core/styles';

import theme from 'shared/theme';
import { blue as blueColor, orange as orangeColor, red as redColor } from '@material-ui/core/colors';

const useStylesSnackbar = makeStyles(themeDefault => ({
	message: {
		alignItems: 'initial',
	},
	success: {
		backgroundColor: 'white',
		'& $message svg[data-icon="check-circle"]': {
			color: theme.teal.cT300,
			fontSize: 20,
			marginRight: 10,
		},
	},
	error: {
		backgroundColor: 'white',
		'& $message svg[data-icon="times-circle"]': {
			color: redColor['600'],
			fontSize: 20,
			marginRight: 10,
		},
	},
	warning: {
		backgroundColor: 'white',
		'& $message svg[data-icon="exclamation-circle"]': {
			color: orangeColor['600'],
			fontSize: 20,
			marginRight: 10,
		},
	},
	info: {
		backgroundColor: 'white',
		'& $message svg[data-icon="exclamation-circle"]': {
			color: blueColor['600'],
			fontSize: 20,
			marginRight: 10,
		},
	},
}));

export default useStylesSnackbar;
