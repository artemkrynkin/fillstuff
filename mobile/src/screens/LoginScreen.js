import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AsyncStorage, Button, StyleSheet, Text, View } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';

import { registrationViaInvitation } from '../actions/registration';

class LoginScreen extends Component {
	state = {
		hasCameraPermission: null,
		type: Camera.Constants.Type.back,
		scanned: false,
	};

	handleBarCodeScanned = async ({ type, data }) => {
		try {
			const qrData = JSON.parse(data);

			this.setState({ scanned: true });

			if (qrData.type === 'invitation-member') {
				this.props.registrationViaInvitation(qrData.memberId).then(async response => {
					if (response.status === 'success') {
						await AsyncStorage.multiSet([
							['authorized', 'true'],
							['studioId', String(response.data.studioId)],
							['role', String(response.data.role)],
						]);

						this.props.navigation.navigate('App');
					} else {
						this.setState({ scanned: false });
					}
				});
			} else if (qrData.type === 'login') {
				await AsyncStorage.multiSet([
					['authorized', 'true'],
					['studioId', String(qrData.studioId)],
					['memberId', String(qrData.memberId)],
					['roles', String(qrData.roles)],
				]);

				this.props.navigation.navigate('App');
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
				<View style={{ flex: 1 }}>
					<Camera
						focusDepth={1}
						barCodeScannerSettings={{
							barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
						}}
						onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
						style={StyleSheet.absoluteFillObject}
					/>
					<View style={styles.scanningContainer}>
						<View style={styles.scanningContainerBox} />
						<View>
							<Text style={styles.scanningContainerText}>Наведите камеру</Text>
							<Text style={styles.scanningContainerText}>на QR-код</Text>
							<Text style={styles.scanningContainerText}>чтобы Войти.</Text>
						</View>
					</View>
					{/*{scanned && (*/}
					{/*<View style={styles.scanningAgainContainer}>*/}
					{/*	<Button title={'Tap to Scan Again'} onPress={() => this.setState({ scanned: false })}/>*/}
					{/*</View>*/}
					{/*)}*/}
				</View>
			);
		}
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	scanningContainer: {
		height: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	scanningContainerBox: {
		borderWidth: 6,
		borderColor: 'white',
		borderStyle: 'dashed',
		borderRadius: 30,
		marginBottom: 40,
		height: 250,
		width: 250,
	},
	scanningContainerText: {
		color: 'white',
		fontSize: 26,
		textAlign: 'center',
		marginTop: 10,
	},
});

const mapDispatchToProps = dispatch => {
	return {
		registrationViaInvitation: values => dispatch(registrationViaInvitation(values)),
	};
};

export default connect(null, mapDispatchToProps)(LoginScreen);
