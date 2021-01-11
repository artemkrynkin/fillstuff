import { StyleSheet } from 'react-native';

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
	scanningContainer: {
		flex: 1,
	},
	cameraDefiningBox: {
		color: 'white',
		marginTop: 'auto',
		marginBottom: 'auto',
		marginLeft: 'auto',
		marginRight: 'auto',
	},
	definingBoxDetectQr: {
		color: theme.teal.A400,
		position: 'absolute',
	},
	detectQrContent: {
		position: 'absolute',
		height: '100%',
		width: '100%',
	},
	cameraInfo: {
		position: 'absolute',
		bottom: 30,
		color: 'white',
		fontSize: 15,
		fontWeight: '600',
		textAlign: 'center',
		width: '100%',
	},
});
