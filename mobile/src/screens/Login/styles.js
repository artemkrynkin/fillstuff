import { StyleSheet } from 'react-native';

import theme from '../../constants/theme';

export default StyleSheet.create({
	container: {
		backgroundColor: theme.slateGrey.cSg4,
		flex: 1,
	},
	containerScan: {
		height: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	borderScan: {
		height: 250,
		width: 250,
	},
	contentScan: {
		marginTop: 30,
	},
	textScan: {
		color: 'white',
		fontSize: 22,
		textAlign: 'center',
		marginTop: 6,
	},
});
