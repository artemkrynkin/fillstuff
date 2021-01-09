import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

import theme from 'mobile/src/constants/theme';

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
	},
	modalHeader: {
		flexDirection: 'row',
		paddingTop: 15,
		paddingBottom: 0,
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
	modalContent: {
		paddingTop: 20,
		paddingBottom: 0,
		paddingLeft: 15,
		paddingRight: 15,
		maxHeight: 500,
	},
	priceQuantityContainer: {
		alignItems: 'center',
		flexDirection: 'row',
		marginBottom: 20,
	},
	writeOffQuantity: {
		color: theme.blueGrey['700'],
		fontSize: 18,
		fontWeight: '600',
	},
	writeOffQuantityIcon: {
		color: theme.blueGrey['700'],
		marginLeft: 5,
		marginRight: 5,
	},
	sellingPrice: {
		color: theme.blueGrey['700'],
		fontSize: 18,
	},
	outOfStock: {
		color: theme.red['500'],
	},
	quantityActions: {
		alignItems: 'center',
		flexDirection: 'row',
		marginLeft: 'auto',
	},
	buttonChangeQuantity: {
		borderRadius: 8,
		borderWidth: 1,
		borderColor: theme.blueGrey['100'],
		marginLeft: 20,
		paddingLeft: 16,
		paddingRight: 16,
		paddingTop: 12,
		paddingBottom: 12,
	},
	buttonChangeQuantityActive: {
		backgroundColor: theme.blueGrey['50'],
		borderColor: theme.blueGrey['300'],
	},
	buttonChangeQuantityIcon: {
		color: theme.blueGrey['600'],
	},
	button: {
		borderRadius: 8,
		display: 'flex',
		alignItems: 'center',
		backgroundColor: theme.teal['300'],
		marginTop: 20,
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
