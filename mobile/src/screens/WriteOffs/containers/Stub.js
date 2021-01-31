import React from 'react';
import { Image, Text, View } from 'react-native';
import { Asset } from 'expo-asset';

import styles from './StubStyles';

const writeOffsEmptyStub = Asset.fromModule(require('mobile/assets/images/stubs/write_offs_empty.png'));

function Stub() {
	return (
		<View style={styles.stub}>
			<Image
				style={styles.stubImage}
				source={{
					uri: writeOffsEmptyStub.uri,
				}}
			/>
			<Text style={styles.stubTitle}>У вас пока нет списаний</Text>
			<Text style={styles.stubSubhead}>Списания появятся в этом разделе</Text>
		</View>
	);
}

export default Stub;
