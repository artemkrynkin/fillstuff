import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { ImageBackground, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Asset } from 'expo-asset';

import { authentication } from '../../actions/authentication';

import styles from './styles';

class Login extends Component {
	state = {
		hasCameraPermission: null,
		scanned: false,
	};

	_focusListener = null;
	_blurListener = null;
	cameraRef = createRef();

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
		const { status } = await Camera.requestPermissionsAsync();

		this._focusListener = this.props.navigation.addListener('focus', () => {
			this.cameraRef.resumePreview();
		});

		this._blurListener = this.props.navigation.addListener('blur', () => {
			this.cameraRef.pausePreview();
		});

		this.setState({ hasCameraPermission: status === 'granted' });
	}

	componentWillUnmount() {
		if (this._focusListener) {
			this._focusListener();
			this._focusListener = null;
		}

		if (this._blurListener) {
			this._blurListener();
			this._blurListener = null;
		}
	}

	render() {
		const { hasCameraPermission, scanned } = this.state;

		if (hasCameraPermission === null) {
			return <View />;
		} else if (hasCameraPermission === false) {
			return <Text>No access to camera</Text>;
		} else {
			return (
				<>
					<StatusBar barStyle="light-content" animated />
					<View style={styles.container}>
						<Camera
							ref={ref => (this.cameraRef = ref)}
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
				</>
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
