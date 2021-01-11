import { StyleSheet, Dimensions } from 'react-native';

import theme from 'mobile/src/constants/theme';

export default StyleSheet.create({
	notEnoughPermission: {
		alignItems: 'center',
		backgroundColor: 'black',
		flex: 1,
		justifyContent: 'center',
	},
	notEnoughPermissionTitle: {
		color: 'white',
		fontSize: 22,
		fontWeight: '600',
		marginBottom: 10,
	},
	notEnoughPermissionSubhead: {
		color: theme.blueGrey['200'],
		fontSize: 16,
		textAlign: 'center',
	},
	notEnoughPermissionLinkText: {
		color: theme.teal['300'],
		fontSize: 16,
		marginTop: 20,
	},
	screen: {
		flex: 1,
	},
	header: {
		paddingLeft: 15,
		paddingRight: 10,
		paddingTop: 15,
	},
	close: {
		alignItems: 'center',
		borderRadius: 30,
		justifyContent: 'center',
		marginLeft: 'auto',
		height: 34,
		width: 34,
	},
	closeIcon: {
		color: theme.teal['300'],
	},
	content: {
		flex: 1,
		paddingLeft: 20,
		paddingRight: 20,
	},
	title: {
		color: theme.blueGrey['900'],
		fontSize: 22,
		fontWeight: '600',
		textAlign: 'center',
		marginBottom: 10,
	},
	subhead: {
		color: theme.blueGrey['700'],
		fontSize: 16,
		textAlign: 'center',
	},
	cameraContainer: {
		backgroundColor: 'black',
		borderRadius: 10,
		height: (Dimensions.get('window').width - 40) * (5 / 4),
		marginTop: 30,
		overflow: 'hidden',
		width: '100%',
	},
	camera: {
		flex: 1,
		width: '100%',
	},
	cameraInfo: {
		color: theme.blueGrey['700'],
		fontSize: 15,
		fontWeight: '600',
		marginTop: 20,
		textAlign: 'center',
	},
	studioContainer: {
		alignItems: 'center',
		overflow: 'hidden',
	},
	studioAvatar: {
		height: 150,
		marginTop: 20,
		width: 150,
	},
	studioName: {
		color: theme.blueGrey['900'],
		fontSize: 34,
		fontWeight: '600',
		textAlign: 'center',
		marginTop: 20,
	},
	bottomActions: {
		marginTop: 'auto',
	},
	linkText: {
		color: theme.teal['300'],
		fontSize: 16,
		marginBottom: 15,
		textAlign: 'center',
	},
	button: {
		borderRadius: 8,
		display: 'flex',
		alignItems: 'center',
		backgroundColor: theme.teal['300'],
		paddingLeft: 20,
		paddingRight: 20,
		paddingBottom: 14,
		paddingTop: 14,
	},
	buttonActive: {
		backgroundColor: theme.teal['400'],
	},
	buttonDisabled: {
		opacity: 0.5,
	},
	buttonText: {
		color: 'white',
		fontSize: 18,
		fontWeight: '500',
	},
});
