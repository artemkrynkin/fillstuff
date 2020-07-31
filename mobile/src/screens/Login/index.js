import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Asset } from 'expo-asset';

import { authentication } from '../../actions/authentication';

import styles from './styles';

class Login extends Component {
	state = {
		hasCameraPermission: null,
		type: Camera.Constants.Type.back,
		scanned: false,
	};

	handleBarCodeScanned = async ({ type, data }) => {
		try {
			const { type: qrType, ...remainingData } = JSON.parse(data);

			this.setState({ scanned: true });

			if (qrType === 'login') {
				this.props.authentication(remainingData);
			} else {
				this.setState({ scanned: false });
			}
		} catch {}
	};

	async componentDidMount() {
		const { status } = await Permissions.askAsync(Permissions.CAMERA);
		this.setState({ hasCameraPermission: status === 'granted' });
	}

	render() {
		const { hasCameraPermission, scanned } = this.state;

		if (hasCameraPermission === null) {
			return <View />;
		} else if (hasCameraPermission === false) {
			return <Text>No access to camera</Text>;
		} else {
			return (
				<View style={styles.container}>
					<Camera
						focusDepth={1}
						barCodeScannerSettings={{
							barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
						}}
						onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
						style={StyleSheet.absoluteFillObject}
					/>
					<View style={styles.containerScan}>
						<ImageBackground source={Asset.fromModule(require('../../../assets/images/cameraDetect.png'))} style={styles.borderScan} />
						<View style={styles.contentScan}>
							<Text style={styles.textScan}>Наведите камеру на QR-код</Text>
							<Text style={styles.textScan}>и дождитесь авторизации</Text>
						</View>
					</View>
				</View>
			);
		}
	}
}

const mapDispatchToProps = dispatch => {
	return {
		authentication: values => dispatch(authentication(values)),
	};
};

export default connect(null, mapDispatchToProps)(Login);
