import React from 'react';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Avatar from 'mobile/src/components/Avatar';

import styles from './HeaderStyles';

function Header(props) {
	const { currentUser, onVisibleModalByName } = props;

	return (
		<SafeAreaView style={styles.header}>
			<TouchableOpacity
				onPress={() => {
					onVisibleModalByName('modalUserMenu');
				}}
				activeOpacity={0.6}
			>
				<Avatar sourceUri={currentUser.picture} />
			</TouchableOpacity>
		</SafeAreaView>
	);
}

export default Header;
