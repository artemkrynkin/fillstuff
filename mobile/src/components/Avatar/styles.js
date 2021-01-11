import { StyleSheet, Dimensions } from 'react-native';

import theme from 'mobile/src/constants/theme';

export default StyleSheet.create({
	container: {
		height: 45,
		width: 45,
	},
	containerCircle: {
		borderRadius: Dimensions.get('window').width,
	},
	containerRounded: {
		borderRadius: 8,
	},
	fallbackBorder: {
		backgroundColor: theme.blueGrey['100'],
		borderColor: theme.blueGrey['200'],
		borderWidth: 2,
	},
	picture: {
		flex: 1,
	},
	pictureCircle: {
		borderRadius: Dimensions.get('window').width,
	},
	pictureRounded: {
		borderRadius: 8,
	},
	fallback: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
	},
});
