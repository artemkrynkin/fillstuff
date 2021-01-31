import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar, View, Text, TouchableOpacity, Pressable, Linking } from 'react-native';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useIsFocused } from '@react-navigation/native';
import { debounce } from 'lodash';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import { isJson } from 'mobile/src/helpers/utils';

import Avatar from 'mobile/src/components/Avatar';

import { getStudio } from 'mobile/src/actions/studios';
import { linkUserAndStudio } from 'mobile/src/actions/members';
import { getMyAccount } from 'mobile/src/actions/user';
import { getStudios } from 'mobile/src/actions/studios';

import styles from './styles';

function ModalJoiningStudio(props) {
	const isFocusedScreen = useIsFocused();
	const [hasPermissionCamera, setHasPermissionCamera] = useState(null);
	const [cameraScanned, setCameraScanned] = useState(false);
	const [cameraInfo, setCameraInfo] = useState('');
	const [studio, setStudio] = useState(null);

	const onClose = () => {
		props.navigation.goBack();
	};

	const onOpenSettings = useCallback(async () => {
		await Linking.openSettings();
	}, []);

	const onBarCodeScanned = async barCodeEvent => {
		const barcodeData = isJson(barCodeEvent.data) ? JSON.parse(barCodeEvent.data) : barCodeEvent.data;

		onClearBarcodeObject();

		if (cameraScanned) return;

		if (barcodeData.type && barcodeData.id) {
			switch (barcodeData.type) {
				case 'm-i': {
					setCameraScanned(true);

					const { data: studio } = await props.getStudio({ params: { studioId: barcodeData.id } });

					setStudio(studio);

					return;
				}
				default: {
					return setCameraInfo('Неизвестная ошибка');
				}
			}
		} else {
			setCameraInfo('Данные о студии не обнаружены');
		}
	};

	const onClearBarcodeObject = useCallback(
		debounce(
			() => {
				setCameraInfo('');
			},
			100,
			{ leading: false, trailing: true }
		),
		[]
	);

	const onClearStudio = () => {
		setCameraScanned(false);
		setStudio(null);
	};

	const onConnectedStudioSubmit = async () => {
		try {
			await props.linkUserAndStudio({ data: { studioId: studio._id } });

			await Promise.all(props.getMyAccount(), props.getStudios());

			onClose();
		} catch (error) {}
	};

	useEffect(() => {
		(async () => {
			const { status } = await Camera.requestPermissionsAsync();

			setHasPermissionCamera(status === 'granted');
		})();
	}, []);

	return (
		<>
			<StatusBar barStyle="light-content" />
			<SafeAreaInsetsContext.Consumer>
				{insets => (
					<View style={[styles.screen, { paddingBottom: insets.bottom || 20 }]}>
						<View style={styles.header}>
							<TouchableOpacity
								style={styles.close}
								onPress={onClose}
								children={<FontAwesomeIcon style={styles.closeIcon} icon={['fal', 'times']} size={24} />}
							/>
						</View>
						<View style={styles.content}>
							<Text style={styles.title}>Присоединение к студии</Text>
							{!studio ? <Text style={styles.subhead}>Отсканируйте QR-код приглашения студии</Text> : null}
							<View style={[styles.cameraContainer, studio ? { height: 0 } : null]}>
								{hasPermissionCamera ? (
									<>
										{isFocusedScreen ? (
											<Camera
												onBarCodeScanned={onBarCodeScanned}
												barCodeScannerSettings={{
													barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
												}}
												style={styles.camera}
											/>
										) : null}
									</>
								) : (
									<View style={styles.notEnoughPermission}>
										<Text style={styles.notEnoughPermissionTitle}>Разрешите доступ</Text>
										<Text style={styles.notEnoughPermissionSubhead}>Чтобы распознавать QR-коды, нужен доступ к&nbsp;камере</Text>
										<TouchableOpacity onPress={() => onOpenSettings()}>
											<Text style={styles.notEnoughPermissionLinkText}>Предоставить доступ</Text>
										</TouchableOpacity>
									</View>
								)}
							</View>
							<View style={[styles.studioContainer, !studio ? { height: 0 } : null]}>
								<Avatar sourceUri={studio?.avatar} style={styles.studioAvatar} />
								<Text style={styles.studioName}>{studio?.name}</Text>
							</View>
							<Text style={styles.cameraInfo}>{cameraInfo}</Text>
							<View style={styles.bottomActions}>
								{studio ? (
									<TouchableOpacity onPress={() => onClearStudio()}>
										<Text style={styles.linkText}>Сканировать QR-код еще раз</Text>
									</TouchableOpacity>
								) : null}
								<Pressable
									onPress={() => onConnectedStudioSubmit()}
									style={({ pressed }) =>
										!studio ? [styles.button, styles.buttonDisabled] : pressed ? [styles.button, styles.buttonActive] : [styles.button]
									}
									disabled={!studio}
								>
									<Text style={styles.buttonText}>Присоединиться</Text>
								</Pressable>
							</View>
						</View>
					</View>
				)}
			</SafeAreaInsetsContext.Consumer>
		</>
	);
}

ModalJoiningStudio.defaultProps = {
	// visible: false
};

ModalJoiningStudio.propTypes = {
	// visible: PropTypes.bool.isRequired,
	// onClose: PropTypes.func
};

const mapDispatchToProps = {
	getStudio,
	linkUserAndStudio,
	getMyAccount,
	getStudios,
};

export default connect(null, mapDispatchToProps)(ModalJoiningStudio);
