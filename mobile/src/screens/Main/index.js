import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import {
	StyleSheet,
	Text,
	View,
	TouchableHighlight,
	TouchableOpacity,
	FlatList,
	AppState,
	Vibration,
	ImageBackground,
	TextInput,
	Alert,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-community/async-storage';
import { Asset } from 'expo-asset';
import Constants from 'expo-constants';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import Modal from 'react-native-modal';
import { SafeAreaView, SafeAreaInsetsContext } from 'react-native-safe-area-context';

import theme from '../../constants/theme';

import { getPosition, getPositionGroup, createWriteOff } from '../../actions/positions';

import styles from './styles';

class PositionScanning extends Component {
	initialRemainingState = {
		barCodeScanned: 'ready',
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

	timerAppState = {
		timer: null,
		drop: false,
	};

	cameraRef = createRef();
	textFieldQuantity = createRef();

	onSetInitialRemainingState = () => {
		this.setState(this.initialRemainingState);
		this.cameraRef.resumePreview();
	};

	onDropModals = () => {
		const { barCodeScanned, modalPosition, modalPositionGroup } = this.state;

		if (barCodeScanned.match(/scanning|scanned/)) {
			if (modalPosition) setTimeout(() => this.onHandlerModalPosition(false), 500);
			else if (modalPositionGroup) setTimeout(() => this.onHandlerModalPositionGroup(false), 500);
			// setTimeout(() => this.setState(this.initialRemainingState), 450);
		}
	};

	onBarCodeScanned = async ({ data }) => {
		try {
			const { studioId } = JSON.parse(await AsyncStorage.getItem('user'));
			const { type, id: qrcodeId } = JSON.parse(data);

			this.setState({ barCodeScanned: 'scanning' }, () => {
				if (
					Constants.platform.android ||
					(Constants.platform.ios &&
						Constants.platform.ios.model.match(/iPhone 5|iPhone 5C|iPhone 5s|iPhone 6|iPhone 6 Plus|iPhone 6s|iPhone 6s Plus|iPhone SE/))
				) {
					Vibration.vibrate();
				}

				switch (type) {
					case 's-pg':
						return this.props.getPositionGroup(studioId, { qrcodeId }).then(response => {
							if (response.status === 'error') return this.onSetInitialRemainingState();

							const positionGroup = response.data;

							Haptics.impactAsync('heavy');
							if (this.cameraRef) this.cameraRef.pausePreview();

							this.setState(
								{
									barCodeScanned: 'scanned',
									positionGroup,
								},
								() => {
									this.onHandlerModalPositionGroup(true);
								}
							);
						});
					case 's-p':
						return this.props.getPosition(studioId, { qrcodeId }).then(response => {
							if (response.status === 'error') return this.onSetInitialRemainingState();

							const position = response.data;

							Haptics.impactAsync('heavy');
							if (this.cameraRef) this.cameraRef.pausePreview();

							this.setState(
								{
									barCodeScanned: 'scanned',
									position,
								},
								() => {
									this.onHandlerModalPosition(true);
								}
							);
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
		const { barCodeScanned, modalPositionGroup } = this.state;

		const setState = {
			modalPosition: visible,
		};

		if (!visible) {
			setTimeout(() => this.setState({ barCodeScanned: 'ready', position: null }), 450);
		}

		if (!modalPositionGroup) {
			setState.quantity = '';

			this.setState(setState, () => {
				if (!visible && this.cameraRef) this.cameraRef.resumePreview();
			});

			if (barCodeScanned === 'scanned' && visible)
				setTimeout(() => {
					if (this.textFieldQuantity && this.textFieldQuantity.current) this.textFieldQuantity.current.focus();
				}, 100);
			else {
				if (this.textFieldQuantity && this.textFieldQuantity.current) this.textFieldQuantity.current.blur();
			}
		} else {
			this.setState({ modalPositionGroup: false }, () => {
				setTimeout(() => {
					this.setState(setState);

					if (barCodeScanned === 'scanned' && visible)
						setTimeout(() => {
							if (this.textFieldQuantity && this.textFieldQuantity.current) this.textFieldQuantity.current.focus();
						}, 100);
					else {
						if (this.textFieldQuantity && this.textFieldQuantity.current) this.textFieldQuantity.current.blur();
					}
				}, 450);
			});
		}
	};

	onHandlerModalPositionGroup = visible => {
		const setState = {
			modalPositionGroup: visible,
		};

		if (!visible) {
			setTimeout(() => this.setState({ barCodeScanned: 'ready', positionGroup: null }), 450);
		}

		this.setState(setState, () => {
			if (!visible && this.cameraRef) this.cameraRef.resumePreview();
		});
	};

	onChangeQuantity = value => this.setState({ quantity: value });

	writeOffConfirm = async (positionId, quantity) => {
		const { memberId, studioId } = JSON.parse(await AsyncStorage.getItem('user'));

		this.props.createWriteOff(studioId, memberId, positionId, quantity).then(async response => {
			if (response.data.code === 7) {
				await Haptics.notificationAsync('error');

				this.onDropModals();
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
				}, 1000);
			} else {
				try {
					const soundObject = new Audio.Sound();

					await soundObject.loadAsync(require('../../../assets/sounds/write-off_confirmation.aac'));

					await Promise.all([soundObject.playAsync(), Haptics.notificationAsync('success')]);
				} catch {}

				this.onDropModals();
			}
		});
	};

	onHandleAppStateChange = nextAppState => {
		if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
			clearTimeout(this.timerAppState.timer);

			if (this.timerAppState.drop) {
				this.timerAppState.drop = false;
				this.onDropModals();
			}
		}
		if (nextAppState.match(/inactive|background/) && this.state.appState === 'active') {
			this.timerAppState.timer = setTimeout(() => {
				this.timerAppState.drop = true;
			}, 15000);
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
				<>
					<View style={{ flex: 1 }}>
						<Camera
							ref={ref => (this.cameraRef = ref)}
							barCodeScannerSettings={{
								barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
							}}
							onBarCodeScanned={barCodeScanned === 'ready' ? this.onBarCodeScanned : undefined}
							style={StyleSheet.absoluteFillObject}
						/>
					</View>
					<SafeAreaView style={styles.safeAreaContent}>
						<View style={{ flex: 1 }}>
							<View style={styles.scanningContainer}>
								<ImageBackground
									source={Asset.fromModule(require('../../../assets/images/cameraDetect.png'))}
									style={{ ...styles.scanningContainerBox, opacity: Number(barCodeScanned !== 'scanned') }}
								/>
								<TouchableOpacity
									style={styles.settingsButton}
									onPress={() => this.props.navigation.push('Settings')}
									children={<FontAwesomeIcon style={styles.settingsIcon} icon={['fal', 'cog']} size={24} />}
								/>
							</View>
						</View>
					</SafeAreaView>

					<SafeAreaInsetsContext.Consumer>
						{insets => (
							<View>
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
									<View style={{ ...styles.modalContainer, paddingBottom: insets.bottom }}>
										{position ? (
											<View>
												<View style={styles.modalHeader1}>
													<Text style={styles.modalTitle}>{position.name}</Text>
													{position.characteristics.length ? (
														<Text style={styles.modalSubtitle}>
															{position.characteristics.reduce(
																(fullCharacteristics, characteristic) => `${fullCharacteristics}${characteristic.name} `,
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
																Цена продажи {position.unitRelease === 'pce' ? 'шт.' : 'уп.'}:{' '}
																<Text style={styles.sellingPriceBold}>
																	{position.activeReceipt.unitSellingPrice}
																	{' ₽'}
																</Text>
															</Text>
														</View>
													) : (
														<Text style={styles.sellingPrice}>
															Цена продажи {position.unitRelease === 'pce' ? 'шт.' : 'уп.'}:{' '}
															<Text style={styles.sellingPriceBold}>Бесплатно</Text>
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
															placeholderTextColor={theme.blueGrey.cBg200}
															selectionColor={theme.teal.cT300}
															style={styles.textField}
															onChangeText={value => this.onChangeQuantity(value)}
															value={quantity}
														/>
														<TouchableHighlight
															onPress={() => (Number(quantity) ? this.writeOffConfirm(position._id, quantity) : {})}
															style={
																Number(quantity) ? { ...styles.buttonSubmit } : { ...styles.buttonSubmit, ...styles.buttonSubmitDisabled }
															}
															underlayColor={Number(quantity) ? theme.teal.cT200 : theme.blueGrey.cBg50}
														>
															<View>
																{Number(quantity) ? (
																	<Text style={styles.buttonSubmitText}>
																		Списать <Text style={{ fontWeight: '800' }}>{Number(quantity)}</Text>{' '}
																		{position.unitRelease === 'pce' ? 'шт.' : 'уп.'}
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
									<View style={{ ...styles.modalContainer, paddingBottom: insets.bottom }}>
										{positionGroup ? (
											<View>
												<View style={styles.modalHeader2}>
													<Text style={styles.modalTitle}>{positionGroup.name}</Text>
													<TouchableOpacity
														style={styles.modalClose}
														onPress={() => this.onHandlerModalPositionGroup(false)}
														children={<FontAwesomeIcon style={styles.modalCloseIcon} icon={['fal', 'times']} size={18} />}
													/>
												</View>
												<View style={{ maxHeight: 500 }}>
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
																			(fullCharacteristics, characteristic) => `${fullCharacteristics} ${characteristic.name}`,
																			''
																		)}
																	</Text>
																</View>
															</TouchableHighlight>
														)}
													/>
												</View>
											</View>
										) : null}
									</View>
								</Modal>
							</View>
						)}
					</SafeAreaInsetsContext.Consumer>
				</>
			);
		}
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getPosition: (studioId, params) => dispatch(getPosition(studioId, params)),
		getPositionGroup: (studioId, params) => dispatch(getPositionGroup(studioId, params)),
		createWriteOff: (studioId, memberId, positionId, quantity) => dispatch(createWriteOff(studioId, memberId, positionId, quantity)),
	};
};

export default connect(null, mapDispatchToProps)(PositionScanning);
