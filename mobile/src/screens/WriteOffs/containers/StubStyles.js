import { StyleSheet } from 'react-native';

import theme from 'mobile/src/constants/theme';

export default StyleSheet.create({
	stub: {
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 100,
	},
	stubImage: {
		height: 260,
		marginBottom: 30,
		width: '70%',
	},
	stubTitle: {
		color: theme.blueGrey['900'],
		fontSize: 22,
		fontWeight: '600',
		marginBottom: 10,
	},
	stubSubhead: {
		color: theme.blueGrey['700'],
		fontSize: 16,
	},
	button: {
		borderRadius: 8,
		display: 'flex',
		alignItems: 'center',
		backgroundColor: theme.teal['300'],
		marginTop: 20,
		paddingLeft: 20,
		paddingRight: 20,
		paddingBottom: 10,
		paddingTop: 10,
	},
	buttonActive: {
		backgroundColor: theme.teal['400'],
	},
	buttonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '500',
	},
});
