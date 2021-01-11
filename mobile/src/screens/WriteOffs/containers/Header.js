import React from 'react';
import { Text, View } from 'react-native';

import styles from './HeaderStyles';

function Header(props) {
	return (
		<View style={styles.header}>
			<Text style={styles.title}>История списаний</Text>
		</View>
	);
}

export default Header;
