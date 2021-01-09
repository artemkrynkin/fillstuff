import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import styles from './HeaderStyles';

function Header(props) {
	const { currentUser, onVisibleModalByName } = props;

	return (
		<SafeAreaView style={styles.header}>
			<TouchableOpacity
				style={styles.user}
				onPress={() => {
					onVisibleModalByName('modalUserMenu');
				}}
				activeOpacity={0.6}
			>
				<Image
					style={styles.userAvatar}
					source={{
						uri: currentUser.picture,
					}}
				/>
			</TouchableOpacity>
		</SafeAreaView>
	);
}

export default Header;
