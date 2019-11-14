import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import {
	AsyncStorage,
	StyleSheet,
	Text,
	View,
	TouchableHighlight,
	TouchableOpacity,
	FlatList,
	ScrollView,
	AppState,
	Vibration,
	ImageBackground,
	TextInput,
	Alert,
} from 'react-native';
import { Asset } from 'expo-asset';
import Constants from 'expo-constants';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import Modal from 'react-native-modal';

import theme from '../constants/theme';

import { percentOfNumber } from '../helpers/utils';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { getPosition, getPositionGroup, createWriteOff } from '../actions/positions';

class PositionScanningScreen extends Component {
	initialRemainingState = {
		barCodeScanned: false,
		position: null,
		positionGroup: null,
		modalPosition: false,
		modalPositionGroup: false,
		quantity: '',
	};

	state = {
		appState: AppState.currentState,
		hasCameraPermission: null,
		type: BarCodeScanner.Constants.Type.back,
		...this.initialRemainingState,
	};

	cameraRef = createRef();
	textFieldQuantity = createRef();

	onSetInitialRemainingState = () => {
		this.setState(this.initialRemainingState);
		this.cameraRef.resumePreview();
	};

	onBarCodeScanned = async ({ data }) => {
		try {
			const qrData = JSON.parse(data);

			const stockId = await AsyncStorage.getItem('stockId');

			this.setState({ barCodeScanned: true }, () => {
				if (
					Constants.platform.android ||
					Constants.platform.ios.model.match(/iPhone 5|iPhone 5C|iPhone 5s|iPhone 6|iPhone 6 Plus|iPhone 6s|iPhone 6s Plus|iPhone SE/)
				) {
					Vibration.vibrate();
				}

				switch (qrData.type) {
					case 'positionGroup':
						return this.props.getPositionGroup(stockId, qrData.id).then(response => {
							if (response.status === 'error') return this.onSetInitialRemainingState();

							const positionGroup = response.data;

							Haptics.impactAsync('heavy');
							this.cameraRef.pausePreview();

							this.setState({ positionGroup: positionGroup });
							this.onHandlerModalPositionGroup(true);
						});
					case 'position':
						return this.props.getPosition(stockId, qrData.id).then(response => {
							if (response.status === 'error') return this.onSetInitialRemainingState();

							const position = response.data;

							Haptics.impactAsync('heavy');
							this.cameraRef.pausePreview();

							this.onSavePosition(position);
							this.onHandlerModalPosition(true);
						});
					default:
						return this.onSetInitialRemainingState();
				}
			});
		} catch {
			return this.onSetInitialRemainingState();
		}
	};

	onSavePosition = position => this.setState({ position });

	onHandlerModalPosition = visible => {
		const { modalPositionGroup } = this.state;

		const setState = {
			modalPosition: visible,
		};

		if (!visible) {
			setState.barCodeScanned = false;
		}

		if (!modalPositionGroup) {
			this.setState(setState, () => {
				if (!visible) {
					this.cameraRef.resumePreview();
					this.setState({ quantity: '' });
				}
			});

			setTimeout(
				() => {
					if (visible) this.textFieldQuantity.current.focus();
					else this.textFieldQuantity.current.blur();
				},
				visible ? 150 : 0
			);
		} else {
			this.setState({ modalPositionGroup: false }, () => {
				setTimeout(() => {
					this.setState(setState);

					setTimeout(
						() => {
							if (visible) this.textFieldQuantity.current.focus();
							else this.textFieldQuantity.current.blur();
						},
						visible ? 150 : 0
					);
				}, 450);
			});
		}
	};

	onHandlerModalPositionGroup = visible => {
		const setState = {
			modalPositionGroup: visible,
		};

		if (!visible) {
			setState.barCodeScanned = false;
		}

		this.setState(setState, () => {
			if (!visible) {
				this.cameraRef.resumePreview();
			}
		});
	};

	onChangeQuantity = value => this.setState({ quantity: value });

	writeOffConfirm = async (positionId, quantity) => {
		const stockId = await AsyncStorage.getItem('stockId');
		const userId = await AsyncStorage.getItem('userId');

		this.props.createWriteOff(stockId, userId, positionId, quantity).then(async response => {
			if (response.data.code === 7) {
				await Haptics.notificationAsync('error');

				this.onSetInitialRemainingState();
				setTimeout(() => {
					Alert.alert(
						response.data.message,
						'',
						[
							{
								text: 'ОК',
							},
						],
						{ cancelable: false }
					);
				}, 450);
			} else {
				try {
					const soundObject = new Audio.Sound();

					await soundObject.loadAsync(require('../../assets/sounds/write-off_confirmation.aac'));

					await Promise.all([soundObject.playAsync(), Haptics.notificationAsync('success')]);
				} catch {}

				this.onSetInitialRemainingState();
			}
		});
	};

	onHandleAppStateChange = nextAppState => {
		const { barCodeScanned } = this.state;

		if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
			if (barCodeScanned) this.onSetInitialRemainingState();
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
		const { hasCameraPermission, barCodeScanned, position, positionGroup, modalPosition, modalPositionGroup, quantity } = this.state;

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
					<Camera
						ref={ref => (this.cameraRef = ref)}
						barCodeScannerSettings={{
							barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
						}}
						onBarCodeScanned={!barCodeScanned ? this.onBarCodeScanned : undefined}
						style={StyleSheet.absoluteFillObject}
					/>
					<View style={styles.scanningContainer}>
						<ImageBackground
							source={Asset.fromModule(require('../../assets/images/cameraDetect.png'))}
							style={{ ...styles.scanningContainerBox, opacity: Number(!modalPositionGroup && !modalPosition) }}
						/>
					</View>

					<Modal
						animationInTiming={200}
						animationOutTiming={400}
						avoidKeyboard
						isVisible={modalPosition}
						onBackdropPress={() => this.onHandlerModalPosition(false)}
						onSwipeComplete={() => this.onHandlerModalPosition(false)}
						swipeDirection={['down']}
						style={styles.modal}
					>
						<View style={styles.modalContainer}>
							{position ? (
								<View>
									<View style={styles.modalHeader}>
										<Text style={styles.modalTitle}>{position.name}</Text>
										{position.characteristics.length ? (
											<Text style={styles.modalSubtitle}>
												{position.characteristics.reduce(
													(fullCharacteristics, characteristic) => `${fullCharacteristics}${characteristic.label} `,
													''
												)}
											</Text>
										) : null}
										<TouchableOpacity
											style={styles.modalClose}
											onPress={() => this.onHandlerModalPosition(false)}
											children={<FontAwesomeIcon style={styles.modalCloseIcon} icon={['fal', 'times']} size={18} />}
										/>
									</View>
									<View style={styles.modalContent}>
										{!position.isFree ? (
											<View>
												<Text style={styles.sellingPrice}>
													Цена продажи {position.unitIssue === 'pce' ? 'шт.' : 'уп.'}:{' '}
													<Text style={styles.sellingPriceBold}>
														{position.activeReceipt.unitSellingPrice +
															position.activeReceipt.costDelivery +
															percentOfNumber(position.activeReceipt.unitSellingPrice, position.extraCharge)}{' '}
														₽
													</Text>
												</Text>
												<Text style={styles.sellingPriceSubtitle}>
													C учётом стоимости доставки <Text style={{ fontWeight: '600' }}>{position.activeReceipt.costDelivery} ₽</Text>
												</Text>
											</View>
										) : (
											<Text style={styles.sellingPrice}>
												Цена продажи {position.unitIssue === 'pce' ? 'шт.' : 'уп.'}: <Text style={styles.sellingPriceBold}>Бесплатно</Text>
											</Text>
										)}
										<View style={styles.form}>
											<Text style={styles.inputLabel}>Количество:</Text>
											<TextInput
												ref={this.textFieldQuantity}
												keyboardAppearance="light"
												keyboardType="number-pad"
												maxLength={2}
												placeholder="0"
												style={styles.textField}
												onChangeText={value => this.onChangeQuantity(value)}
												value={quantity}
											/>
											<TouchableHighlight
												onPress={() => (Number(quantity) ? this.writeOffConfirm(position._id, quantity) : {})}
												style={Number(quantity) ? { ...styles.buttonSubmit } : { ...styles.buttonSubmit, ...styles.buttonSubmitDisabled }}
												underlayColor={Number(quantity) ? theme.teal.cT200 : theme.blueGrey.cBg50}
											>
												<View>
													{Number(quantity) ? (
														<Text style={styles.buttonSubmitText}>
															Списать <Text style={{ fontWeight: '800' }}>{Number(quantity)}</Text>{' '}
															{position.unitIssue === 'pce' ? 'шт.' : 'уп.'}
														</Text>
													) : (
														<Text style={{ ...styles.buttonSubmitText, ...styles.buttonSubmitTextDisabled }}>Списать</Text>
													)}
												</View>
											</TouchableHighlight>
										</View>
									</View>
								</View>
							) : null}
						</View>
					</Modal>

					<Modal
						animationInTiming={200}
						animationOutTiming={400}
						isVisible={modalPositionGroup}
						onBackdropPress={() => this.onHandlerModalPositionGroup(false)}
						onSwipeComplete={() => this.onHandlerModalPositionGroup(false)}
						swipeDirection={['down']}
						propagateSwipe
						style={styles.modal}
					>
						<View style={styles.modalContainer}>
							{positionGroup ? (
								<View>
									<View style={styles.modalHeader}>
										<Text style={styles.modalTitle}>{positionGroup.name}</Text>
										<TouchableOpacity
											style={styles.modalClose}
											onPress={() => this.onHandlerModalPositionGroup(false)}
											children={<FontAwesomeIcon style={styles.modalCloseIcon} icon={['fal', 'times']} size={18} />}
										/>
									</View>
									<View style={{ maxHeight: 500 }}>
										<ScrollView>
											<FlatList
												data={positionGroup.positions}
												keyExtractor={position => position._id}
												renderItem={({ item: position }) => (
													<TouchableHighlight
														onPress={() => {
															this.onSavePosition(position);
															this.onHandlerModalPosition(true);
														}}
														underlayColor={theme.brightness.cBr4}
													>
														<View style={styles.modalPositionListItem}>
															<Text style={styles.modalPositionListItemText}>
																{position.name}
																{position.characteristics.reduce(
																	(fullCharacteristics, characteristic) => `${fullCharacteristics} ${characteristic.label}`,
																	''
																)}
															</Text>
														</View>
													</TouchableHighlight>
												)}
											/>
										</ScrollView>
									</View>
								</View>
							) : null}
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
		height: 250,
		width: 250,
	},
	modal: {
		justifyContent: 'flex-end',
		margin: 0,
		marginTop: Constants.statusBarHeight,
	},
	modalContainer: {
		backgroundColor: 'white',
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
	},
	modalHeader: {
		borderBottomColor: theme.brightness.cBr5,
		borderBottomWidth: StyleSheet.hairlineWidth,
		paddingTop: 15,
		paddingBottom: 15,
		paddingLeft: 15,
		paddingRight: 15,
		position: 'relative',
	},
	modalTitle: {
		color: theme.blueGrey.cBg700,
		fontSize: 26,
		fontWeight: 'bold',
	},
	modalSubtitle: {
		color: theme.blueGrey.cBg400,
		fontSize: 14,
		marginTop: 5,
	},
	modalClose: {
		alignItems: 'center',
		backgroundColor: theme.blueGrey.cBg50,
		borderRadius: 30,
		justifyContent: 'center',
		height: 30,
		position: 'absolute',
		right: 20,
		top: 15,
		width: 30,
	},
	modalCloseIcon: {
		color: theme.blueGrey.cBg600,
	},
	modalContent: {
		paddingTop: 20,
		paddingBottom: 20,
		paddingLeft: 15,
		paddingRight: 15,
	},
	sellingPrice: {
		color: theme.blueGrey.cBg600,
		fontSize: 16,
	},
	sellingPriceBold: {
		fontSize: 24,
		fontWeight: 'bold',
		marginLeft: 5,
	},
	sellingPriceSubtitle: {
		color: theme.blueGrey.cBg400,
		fontSize: 11,
		marginTop: 5,
	},
	form: {
		marginTop: 20,
	},
	inputLabel: {
		color: theme.blueGrey.cBg400,
		fontSize: 14,
		fontWeight: '500',
		marginBottom: 5,
	},
	textField: {
		height: 44,
		backgroundColor: theme.brightness.cBr4,
		borderColor: theme.brightness.cBr5,
		borderWidth: 2,
		borderRadius: 5,
		paddingLeft: 10,
		paddingRight: 10,
	},
	buttonSubmit: {
		backgroundColor: theme.teal.cT300,
		borderRadius: 8,
		marginTop: 20,
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 15,
		paddingRight: 15,
	},
	buttonSubmitDisabled: {
		backgroundColor: theme.blueGrey.cBg50,
	},
	buttonSubmitText: {
		color: 'white',
		fontSize: 18,
		fontWeight: '600',
		letterSpacing: 0.25,
		textAlign: 'center',
	},
	buttonSubmitTextDisabled: {
		color: theme.blueGrey.cBg300,
	},
	modalPositionListItem: {
		borderBottomColor: theme.brightness.cBr5,
		borderBottomWidth: StyleSheet.hairlineWidth,
		paddingTop: 20,
		paddingBottom: 20,
		paddingLeft: 15,
		paddingRight: 15,
	},
	modalPositionListItemHighlight: {},
	modalPositionListItemText: {
		color: theme.blueGrey.cBg700,
		fontSize: 16,
	},
});

const mapDispatchToProps = dispatch => {
	return {
		getPosition: (stockId, positionId) => dispatch(getPosition(stockId, positionId)),
		getPositionGroup: (stockId, positionGroupId) => dispatch(getPositionGroup(stockId, positionGroupId)),
		createWriteOff: (stockId, userId, positionId, quantity) => dispatch(createWriteOff(stockId, userId, positionId, quantity)),
	};
};

export default connect(
	null,
	mapDispatchToProps
)(PositionScanningScreen);
