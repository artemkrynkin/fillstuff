import { StyleSheet } from 'react-native';

import theme from 'mobile/src/constants/theme';

export default StyleSheet.create({
	safeAreaContent: {
		backgroundColor: theme.slateGrey['4'],
		flex: 1,
		height: '100%',
		justifyContent: 'center',
		width: '100%',
	},
	container: {
		paddingLeft: 20,
		paddingRight: 20,
		paddingBottom: 50,
		paddingTop: 50,
		width: '100%',
	},
	logo: {
		marginLeft: 'auto',
		marginRight: 'auto',
		marginBottom: 100,
	},
	button: {
		borderRadius: 8,
		display: 'flex',
		alignItems: 'center',
		backgroundColor: theme.teal['300'],
		marginBottom: 20,
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
	buttonOutlined: {
		borderRadius: 8,
		display: 'flex',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: theme.teal['100'],
		paddingLeft: 20,
		paddingRight: 20,
		paddingBottom: 10,
		paddingTop: 10,
	},
	buttonOutlinedActive: {
		backgroundColor: 'rgba(255, 255, 255, 0.1)',
		borderColor: 'white',
	},
	buttonOutlinedText: {
		color: theme.teal['300'],
		fontSize: 16,
		fontWeight: '500',
	},
});
