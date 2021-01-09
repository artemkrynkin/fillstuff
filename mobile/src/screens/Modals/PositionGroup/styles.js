import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { Dimensions } from 'react-native';

import theme from 'mobile/src/constants/theme';

const windowHeight = Dimensions.get('window').height;

export default StyleSheet.create({
	modal: {
		justifyContent: 'flex-end',
		margin: 0,
		marginTop: Constants.statusBarHeight,
	},
	modalContainer: {
		backgroundColor: 'white',
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
		maxHeight: windowHeight - Constants.statusBarHeight,
	},
	modalHeader: {
		borderBottomColor: theme.brightness['5'],
		borderBottomWidth: StyleSheet.hairlineWidth,
		flexDirection: 'row',
		paddingTop: 15,
		paddingBottom: 15,
		paddingLeft: 15,
		paddingRight: 10,
	},
	modalClose: {
		alignItems: 'center',
		borderRadius: 30,
		justifyContent: 'center',
		marginLeft: 'auto',
		height: 34,
		width: 34,
	},
	modalCloseIcon: {
		color: theme.teal['300'],
	},
	modalTitle: {
		color: theme.blueGrey['700'],
		fontSize: 28,
		fontWeight: '600',
	},
	position: {
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 15,
		paddingRight: 15,
	},
	positionSeparator: {
		backgroundColor: theme.brightness['4'],
		height: 1,
		marginLeft: 71,
	},
});
