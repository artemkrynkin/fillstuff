import { StyleSheet } from 'react-native';

import theme from 'mobile/src/constants/theme';

export default StyleSheet.create({
	header: {
		paddingTop: 20,
		paddingLeft: 15,
		paddingRight: 15,
	},
	title: {
		color: theme.blueGrey['900'],
		fontSize: 28,
		fontWeight: '600',
	},
});
