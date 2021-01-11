import { StyleSheet } from 'react-native';

import theme from 'mobile/src/constants/theme';

export default StyleSheet.create({
	container: {
		alignItems: 'center',
		flexDirection: 'row',
		paddingTop: 15,
		paddingBottom: 15,
	},
	priceAndQuantity: {
		alignItems: 'flex-end',
		paddingLeft: 5,
	},
	price: {
		color: theme.blueGrey['900'],
		fontSize: 17,
		fontWeight: '600',
		marginBottom: 4,
	},
	quantityMultPrice: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	quantity: {
		color: theme.blueGrey['600'],
		fontSize: 13,
		fontWeight: '600',
	},
	unitPrice: {
		color: theme.blueGrey['600'],
		fontSize: 13,
	},
	multIcon: {
		color: theme.blueGrey['400'],
		marginLeft: 5,
		marginRight: 5,
		marginTop: 1,
	},
});
