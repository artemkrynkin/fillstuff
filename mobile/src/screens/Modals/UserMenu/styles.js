import { StyleSheet } from 'react-native';

import theme from 'mobile/src/constants/theme';

export default StyleSheet.create({
	modalHeader: {
		paddingLeft: 10,
		paddingRight: 10,
		paddingBottom: 10,
		paddingTop: 10,
	},
	modalClose: {
		alignItems: 'center',
		borderRadius: 30,
		justifyContent: 'center',
		height: 34,
		width: 34,
	},
	modalCloseIcon: {
		color: theme.teal['300'],
	},
	contentHeader: {
		marginBottom: 20,
		paddingLeft: 15,
		paddingRight: 15,
	},
	userAvatar: {
		borderRadius: 42,
		height: 70,
		width: 70,
	},
	userName: {
		color: theme.blueGrey['900'],
		fontSize: 28,
		fontWeight: '600',
		marginTop: 10,
	},
	studioName: {
		color: theme.blueGrey['500'],
		fontSize: 17,
		marginTop: 10,
	},
	menuItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: 15,
		paddingRight: 15,
	},
	menuIcon: {
		color: theme.teal['400'],
		marginRight: 25,
	},
	menuTitleContainer: {
		paddingBottom: 25,
		paddingTop: 25,
		flex: 1,
	},
	menuTitle: {
		fontSize: 17,
	},
	itemSeparator: {
		backgroundColor: theme.brightness['4'],
		height: 1,
		marginLeft: 68,
	},
});
