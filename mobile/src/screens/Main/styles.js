import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

import theme from '../../constants/theme';

export default StyleSheet.create({
	safeAreaContent: {
		flex: 1,
		height: '100%',
		position: 'absolute',
		justifyContent: 'center',
		width: '100%',
	},
	settingsButton: {
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute',
		right: 20,
		top: 15,
	},
	settingsIcon: {
		color: 'white',
	},
	scanningContainer: {
		height: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	scanningContainerBox: {
		height: 250,
		width: 250,
	},
	modal: {
		justifyContent: 'flex-end',
		margin: 0,
		marginTop: Constants.statusBarHeight,
	},
	modalContainer: {
		backgroundColor: 'white',
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
	},
	modalHeader1: {
		paddingTop: 15,
		paddingBottom: 0,
		paddingLeft: 15,
		paddingRight: 15,
		position: 'relative',
	},
	modalHeader2: {
		borderBottomColor: theme.brightness.cBr5,
		borderBottomWidth: StyleSheet.hairlineWidth,
		paddingTop: 15,
		paddingBottom: 15,
		paddingLeft: 15,
		paddingRight: 15,
		position: 'relative',
	},
	modalTitle: {
		color: theme.blueGrey.cBg700,
		fontSize: 28,
		fontWeight: '600',
	},
	modalSubtitle: {
		color: theme.blueGrey.cBg400,
		fontSize: 15,
	},
	modalClose: {
		alignItems: 'center',
		backgroundColor: theme.blueGrey.cBg50,
		borderRadius: 30,
		justifyContent: 'center',
		height: 30,
		position: 'absolute',
		right: 20,
		top: 15,
		width: 30,
	},
	modalCloseIcon: {
		color: theme.blueGrey.cBg600,
	},
	modalContent: {
		paddingTop: 20,
		paddingBottom: 20,
		paddingLeft: 15,
		paddingRight: 15,
	},
	sellingPrice: {
		color: theme.blueGrey.cBg400,
		fontSize: 15,
		fontWeight: '500',
	},
	sellingPriceBold: {
		color: theme.blueGrey.cBg500,
		fontSize: 17,
		fontWeight: '700',
		marginLeft: 5,
	},
	sellingPriceSubtitle: {
		color: theme.blueGrey.cBg400,
		fontSize: 11,
		marginTop: 5,
	},
	form: {
		marginTop: 20,
	},
	inputLabel: {
		color: theme.blueGrey.cBg400,
		fontSize: 15,
		fontWeight: '500',
		marginBottom: 5,
	},
	textField: {
		backgroundColor: theme.brightness.cBr4,
		borderColor: theme.brightness.cBr5,
		borderWidth: 2,
		borderRadius: 5,
		height: 44,
		fontSize: 15,
		paddingLeft: 10,
		paddingRight: 10,
	},
	buttonSubmit: {
		backgroundColor: theme.teal.cT300,
		borderRadius: 8,
		marginTop: 20,
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 15,
		paddingRight: 15,
	},
	buttonSubmitDisabled: {
		backgroundColor: theme.blueGrey.cBg50,
	},
	buttonSubmitText: {
		color: 'white',
		fontSize: 18,
		fontWeight: '600',
		letterSpacing: 0.25,
		textAlign: 'center',
	},
	buttonSubmitTextDisabled: {
		color: theme.blueGrey.cBg300,
	},
	modalPositionListItem: {
		borderBottomColor: theme.brightness.cBr5,
		borderBottomWidth: StyleSheet.hairlineWidth,
		paddingTop: 20,
		paddingBottom: 20,
		paddingLeft: 15,
		paddingRight: 15,
	},
	modalPositionListItemHighlight: {},
	modalPositionListItemText: {
		color: theme.blueGrey.cBg700,
		fontSize: 16,
	},
});
