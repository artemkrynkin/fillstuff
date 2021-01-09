import { StyleSheet } from 'react-native';

import theme from 'mobile/src/constants/theme';

export default StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
		flexGrow: 1,
		flexBasis: 0,
	},
	avatar: {
		borderRadius: 8,
		alignItems: 'center',
		borderColor: theme.blueGrey['100'],
		justifyContent: 'center',
	},
	avatarLg: {
		borderWidth: 3,
		marginRight: 20,
		height: 68,
		width: 68,
	},
	avatarMd: {
		borderWidth: 3,
		marginRight: 15,
		height: 56,
		width: 56,
	},
	avatarSm: {
		borderWidth: 2,
		marginRight: 10,
		height: 46,
		width: 46,
	},
	fallbackIcon: {
		color: theme.blueGrey['100'],
	},
	summary: {
		flex: 1,
		flexGrow: 1,
		flexBasis: 0,
		minWidth: 0,
	},
	name: {
		color: theme.blueGrey['900'],
		fontWeight: '600',
	},
	nameLg: {
		fontSize: 28,
		marginBottom: 7,
	},
	nameMd: {
		fontSize: 22,
		marginBottom: 6,
	},
	nameSm: {
		fontSize: 17,
		marginBottom: 5,
	},
	characteristics: {
		color: theme.blueGrey['600'],
	},
	characteristicsLg: {
		fontSize: 15,
	},
	characteristicsMd: {
		fontSize: 13,
	},
	characteristicsSm: {
		fontSize: 12,
	},
});
