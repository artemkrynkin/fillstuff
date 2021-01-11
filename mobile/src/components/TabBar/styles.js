import { StyleSheet } from 'react-native';

import theme from 'mobile/src/constants/theme';

export default StyleSheet.create({
	container: {
		borderTopWidth: 1,
		borderTopColor: theme.brightness['5'],
		flexDirection: 'row',
		bottom: 0,
		position: 'absolute',
		width: '100%',
	},
	containerMain: {
		borderTopColor: 'rgba(255, 255, 255, 0.1)',
	},
	tabBarItem: {
		flex: 1,
		alignItems: 'center',
	},
	tabBarLabel: {
		fontSize: 11,
		fontWeight: '500',
	},
});
