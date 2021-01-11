import React from 'react';
import { Image, Text, View } from 'react-native';
import { Asset } from 'expo-asset';

import styles from './StubStyles';

const scanQrStudioInvitationStub = Asset.fromModule(require('mobile/assets/images/stubs/scan_qr_studio_invitation.png'));

function Stub(props) {
	return (
		<View style={styles.stub}>
			<Image
				style={styles.stubImage}
				source={{
					uri: scanQrStudioInvitationStub.uri,
				}}
			/>
			<Text style={styles.stubTitle}>У вас пока нет списаний</Text>
			<Text style={styles.stubSubhead}>Списания появятся в этой разделе</Text>
		</View>
	);
}

export default Stub;
