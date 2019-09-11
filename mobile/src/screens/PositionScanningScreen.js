import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	AsyncStorage,
	StyleSheet,
	Text,
	View,
	Alert,
	Modal,
	TouchableHighlight,
	TouchableOpacity,
	FlatList,
	ScrollView,
	AppState,
	Vibration,
} from 'react-native';
import Constants from 'expo-constants';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import * as MailComposer from 'expo-mail-composer';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { getPosition, getPositionGroup, createWriteOff } from '../actions/positions';

class PositionScanningScreen extends Component {
	state = {
		appState: AppState.currentState,
		hasCameraPermission: null,
		type: BarCodeScanner.Constants.Type.back,
		scanned: false,
		positionGroup: null,
		modalPositionList: false,
		confirmation: false,
	};

	onSendBugReport = async () => {
		const { appState, hasCameraPermission, type, scanned, positionGroup, modalPositionList } = this.state;

		const authorized = await AsyncStorage.getItem('authorized');
		const stockId = await AsyncStorage.getItem('stockId');
		const userId = await AsyncStorage.getItem('userId');
		const role = await AsyncStorage.getItem('role');

		await MailComposer.composeAsync({
			recipients: ['pagesppl@icloud.com'],
			subject: 'Отчёт об ошибке',
			body: `STORAGE DATA
			authorized: ${authorized}
			stockId: ${stockId}
			userId: ${userId}
			role: ${role}
			
			STATE SCREEN
			appState: ${appState}
			hasCameraPermission: ${hasCameraPermission}
			type: ${type}
			scanned: ${scanned}
			positionGroup: ${positionGroup ? 'object' : 'null'}
			modalPositionList: ${modalPositionList}
			
			PLATFORM AND VERSION:
			Model: ${Constants.platform.ios.model}
			Version: ${Constants.platform.ios.systemVersion}`,
		});
	};

	onCloseModalPositionList = () => {
		this.setState({
			modalPositionList: false,
			positionGroup: null,
		});
	};

	onCloseModalPositionListAndScannedEnable = () => {
		this.setState({
			scanned: false,
			modalPositionList: false,
			positionGroup: null,
			confirmation: false,
		});
	};

	onBarCodeScanned = async ({ data }) => {
		try {
			const qrData = JSON.parse(data);

			const stockId = await AsyncStorage.getItem('stockId');

			this.setState({ scanned: true }, () => {
				if (Constants.platform.ios.model.match(/iPhone 5|iPhone 5C|iPhone 5s|iPhone 6|iPhone 6 Plus|iPhone 6s|iPhone 6s Plus|iPhone SE/)) {
					Vibration.vibrate();
				}

				switch (qrData.type) {
					case 'positionGroup':
						return this.props.getPositionGroup(stockId, qrData.id).then(response => {
							const positionGroup = response.data;

							Haptics.impactAsync('heavy');

							this.setState({
								modalPositionList: true,
								positionGroup: positionGroup,
							});
						});
					case 'position':
						return this.props.getPosition(stockId, qrData.id).then(response => {
							const position = response.data;

							Haptics.impactAsync('heavy');

							this.writeOffConfirm(position);
						});
					default:
						return this.onCloseModalPositionListAndScannedEnable();
				}
			});
		} catch {
			this.onCloseModalPositionListAndScannedEnable();
		}
	};

	writeOffConfirm = async position => {
		const { modalPositionList } = this.state;
		const stockId = await AsyncStorage.getItem('stockId');
		const userId = await AsyncStorage.getItem('userId');

		this.setState({ confirmation: true }, () => {
			Alert.alert(
				position.name,
				'',
				[
					{
						text: 'Отмена',
						onPress: () => (!modalPositionList ? this.setState({ scanned: false, confirmation: false }) : null),
					},
					{
						text: 'Подтвердить',
						onPress: () =>
							this.props.createWriteOff(stockId, userId, position._id).then(async response => {
								if (response.data.code === 7) {
									await Haptics.notificationAsync('error');

									Alert.alert(
										response.data.message,
										'',
										[
											{
												text: 'Отмена',
												onPress: () => this.onCloseModalPositionListAndScannedEnable(),
											},
										],
										{ cancelable: false }
									);
								} else {
									try {
										const soundObject = new Audio.Sound();

										await soundObject.loadAsync(require('../../assets/sounds/write-off_confirmation.aac'));

										await Promise.all([soundObject.playAsync(), Haptics.notificationAsync('success')]);
									} catch {}

									this.onCloseModalPositionListAndScannedEnable();
								}
							}),
					},
				],
				{ cancelable: false }
			);
		});
	};

	onHandleAppStateChange = nextAppState => {
		const { confirmation, modalPositionList } = this.state;

		if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
			if (!confirmation && !modalPositionList) this.setState({ scanned: false });
		}
		this.setState({ appState: nextAppState });
	};

	async componentDidMount() {
		const { status } = await Permissions.askAsync(Permissions.CAMERA);

		this.setState({ hasCameraPermission: status === 'granted' });

		AppState.addEventListener('change', this.onHandleAppStateChange);
	}

	componentWillUnmount() {
		AppState.removeEventListener('change', this.onHandleAppStateChange);
	}

	render() {
		const { hasCameraPermission, scanned, positionGroup, modalPositionList } = this.state;

		if (hasCameraPermission === null) {
			return <View />;
		} else if (hasCameraPermission === false) {
			return (
				<View style={{ flex: 1 }}>
					<View style={styles.scanningContainer}>
						<Text>Нет прав для доступа к камере</Text>
					</View>
				</View>
			);
		} else {
			return (
				<View style={{ flex: 1 }}>
					<BarCodeScanner
						barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
						onBarCodeScanned={!scanned ? this.onBarCodeScanned : undefined}
						style={StyleSheet.absoluteFillObject}
					/>
					<TouchableOpacity
						style={styles.sendBugReportButton}
						onPress={this.onSendBugReport}
						children={<FontAwesomeIcon color="white" icon={['fal', 'bug']} size={25} />}
					/>
					<View style={styles.scanningContainer}>
						<View style={styles.scanningContainerBox} />
						<View>
							<Text style={styles.scanningContainerText}>Наведите камеру</Text>
							<Text style={styles.scanningContainerText}>на QR-код</Text>
						</View>
					</View>
					<Modal
						animationType="slide"
						transparent={false}
						visible={modalPositionList}
						onDismiss={this.onCloseModalPositionListAndScannedEnable}
					>
						<View style={styles.modalSelectPositionContainer}>
							<TouchableOpacity
								style={styles.modalSelectPositionClose}
								onPress={this.onCloseModalPositionList}
								children={<FontAwesomeIcon icon={['fal', 'times']} size={25} />}
							/>
							<ScrollView style={styles.modalSelectPositionScroll}>
								{positionGroup ? <Text style={styles.modalSelectPositionTitle}>{positionGroup.name}</Text> : null}
								{positionGroup ? (
									<FlatList
										data={positionGroup.positions}
										keyExtractor={position => position._id}
										renderItem={({ item: position }) => (
											<TouchableHighlight onPress={() => this.writeOffConfirm(position)} underlayColor="#ddd">
												<View style={styles.modalSelectPositionListItem}>
													<Text style={styles.modalSelectPositionListItemText}>
														{position.name}{' '}
														{position.characteristics.reduce(
															(fullCharacteristics, characteristic) => `${fullCharacteristics} ${characteristic.label}`,
															''
														)}
													</Text>
												</View>
											</TouchableHighlight>
										)}
									/>
								) : null}
							</ScrollView>
						</View>
					</Modal>
				</View>
			);
		}
	}
}

const styles = StyleSheet.create({
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
	sendBugReportButton: {
		color: 'white',
		marginTop: Constants.statusBarHeight + 5,
		position: 'absolute',
		right: 20,
		zIndex: 1,
	},
	modalSelectPositionContainer: {
		flex: 1,
		paddingTop: Constants.statusBarHeight,
	},
	modalSelectPositionScroll: {
		flex: 1,
	},
	modalSelectPositionClose: {
		marginLeft: 15,
		width: 25,
	},
	modalSelectPositionTitle: {
		fontSize: 30,
		marginLeft: 15,
		marginTop: 5,
		marginBottom: 10,
	},
	modalSelectPositionListItem: {
		borderTopColor: '#bbb',
		borderTopWidth: StyleSheet.hairlineWidth,
		paddingTop: 20,
		paddingBottom: 20,
		paddingLeft: 15,
		paddingRight: 15,
	},
	modalSelectPositionListItemHighlight: {},
	modalSelectPositionListItemText: {
		fontSize: 16,
	},
});

const mapDispatchToProps = dispatch => {
	return {
		getPosition: (stockId, positionId) => dispatch(getPosition(stockId, positionId)),
		getPositionGroup: (stockId, positionGroupId) => dispatch(getPositionGroup(stockId, positionGroupId)),
		createWriteOff: (stockId, userId, positionId) => dispatch(createWriteOff(stockId, userId, positionId)),
	};
};

export default connect(
	null,
	mapDispatchToProps
)(PositionScanningScreen);
