import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, StyleSheet, Linking, Platform, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { debounce } from 'lodash';
import { Asset } from 'expo-asset';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import { SvgUri } from 'react-native-svg';
import { useIsFocused } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { isJson } from 'mobile/src/helpers/utils';

import { getPosition } from 'mobile/src/actions/positions';
import { getPositionGroup } from 'mobile/src/actions/positionGroups';

import styles from './PositionScanStyles';

const cameraDefiningBox = Asset.fromModule(require('mobile/assets/images/camera/defining_box.svg'));
const definingBoxDetectQrLT = Asset.fromModule(require('mobile/assets/images/camera/defining_box_detect_qr_lt.svg'));
const definingBoxDetectQrLB = Asset.fromModule(require('mobile/assets/images/camera/defining_box_detect_qr_lb.svg'));
const definingBoxDetectQrRB = Asset.fromModule(require('mobile/assets/images/camera/defining_box_detect_qr_rb.svg'));
const definingBoxDetectQrRT = Asset.fromModule(require('mobile/assets/images/camera/defining_box_detect_qr_rt.svg'));

function PositionScan(props) {
	const { modals, modalData, onVisibleModalByName, cameraScanned, setCameraScanned } = props;
	const isFocusedScreen = useIsFocused();
	const tabBarHeight = useBottomTabBarHeight();
	const [hasPermissionCamera, setHasPermissionCamera] = useState(null);
	const [barcodeObject, setBarcodeObject] = useState(null);
	const [cameraInfo, setCameraInfo] = useState('');

	const onOpenSettings = useCallback(async () => {
		await Linking.openSettings();
	}, []);

	const onBarCodeScanned = async barCodeEvent => {
		const barcodeData = isJson(barCodeEvent.data) ? JSON.parse(barCodeEvent.data) : barCodeEvent.data;

		if (barCodeEvent.bounds && barCodeEvent.cornerPoints) {
			if (
				(cameraScanned && barcodeData?.id !== modalData.position?.qrcodeId && barcodeData?.id !== modalData.positionGroup?.qrcodeId) ||
				(cameraScanned && !barcodeData.type && !barcodeData.id)
			) {
				return;
			}

			setBarcodeObject(barCodeEvent);
		}

		onClearBarcodeObject();

		if (cameraScanned) return;

		if (barcodeData.type && barcodeData.id) {
			switch (barcodeData.type) {
				case 's-p': {
					setCameraScanned(true);

					const { data: position } = await props.getPosition({ params: { qrcodeId: barcodeData.id } });

					if (position?.length) {
						const positionGroup = {
							name: position[0].name,
							positions: position,
						};

						return onVisibleModalByName('modalPositionGroup', 'positionGroup', positionGroup);
					} else if (position && !Array.isArray(position)) {
						return onVisibleModalByName('modalPositionWriteOff', 'position', position);
					} else {
						setCameraScanned(false);
						return setCameraInfo('Неизвестная ошибка');
					}
				}
				case 's-pg': {
					setCameraScanned(true);

					const { data: positionGroup } = await props.getPositionGroup({ params: { qrcodeId: barcodeData.id } });

					if (positionGroup) {
						return onVisibleModalByName('modalPositionGroup', 'positionGroup', positionGroup);
					} else {
						setCameraScanned(false);
						return setCameraInfo('Неизвестная ошибка');
					}
				}
				default: {
					return setCameraInfo('Неизвестная ошибка');
				}
			}
		} else {
			setCameraInfo('Данные о позиции не обнаружены');
		}
	};

	const onClearBarcodeObject = useCallback(
		debounce(
			() => {
				setBarcodeObject(null);
				setCameraInfo('');
			},
			100,
			{ leading: false, trailing: true }
		),
		[]
	);

	useEffect(() => {
		(async () => {
			const { status } = await Camera.requestPermissionsAsync();

			setHasPermissionCamera(status === 'granted');
		})();
	}, []);

	if (hasPermissionCamera === false) {
		return (
			<View style={styles.notEnoughPermission}>
				<Text style={styles.notEnoughPermissionTitle}>Разрешите доступ</Text>
				<Text style={styles.notEnoughPermissionSubhead}>Чтобы распознавать QR-коды, нужен доступ к&nbsp;камере</Text>
				<TouchableOpacity onPress={() => onOpenSettings()}>
					<Text style={styles.notEnoughPermissionLinkText}>Предоставить доступ</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{isFocusedScreen ? (
				<>
					{Platform.OS === 'ios' ? (
						<BarCodeScanner
							onBarCodeScanned={modals.modalUserMenu ? undefined : onBarCodeScanned}
							barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
							style={StyleSheet.absoluteFillObject}
						/>
					) : (
						<View style={[styles.camera, StyleSheet.absoluteFillObject]}>
							<Camera
								onBarCodeScanned={modals.modalUserMenu ? undefined : onBarCodeScanned}
								barCodeScannerSettings={{
									barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
								}}
								ratio="16:9"
								style={StyleSheet.absoluteFillObject}
							/>
						</View>
					)}
				</>
			) : null}
			<SafeAreaView style={styles.scanningContainer}>
				<SvgUri
					width={250}
					height={250}
					uri={cameraDefiningBox.uri}
					style={[styles.cameraDefiningBox, { opacity: Number(!Boolean(barcodeObject) && !cameraScanned) }]}
				/>
				{cameraInfo ? (
					<Text style={[styles.cameraInfo, { bottom: tabBarHeight, opacity: Number(Boolean(cameraInfo)) }]}>{cameraInfo}</Text>
				) : null}
				<View style={[styles.detectQrContent, { opacity: Number(Boolean(barcodeObject)) }]}>
					<SvgUri
						width={15}
						height={15}
						uri={definingBoxDetectQrLT.uri}
						style={[
							styles.definingBoxDetectQr,
							{
								top: barcodeObject?.bounds.origin.y || 0,
								left: barcodeObject?.bounds.origin.x || 0,
							},
						]}
					/>
					<SvgUri
						width={15}
						height={15}
						uri={definingBoxDetectQrLB.uri}
						style={[
							styles.definingBoxDetectQr,
							{
								top: barcodeObject?.bounds.origin.y + barcodeObject?.bounds.size.height - 15 || 0,
								left: barcodeObject?.bounds.origin.x || 0,
							},
						]}
					/>
					<SvgUri
						width={15}
						height={15}
						uri={definingBoxDetectQrRB.uri}
						style={[
							styles.definingBoxDetectQr,
							{
								top: barcodeObject?.bounds.origin.y + barcodeObject?.bounds.size.height - 15 || 0,
								left: barcodeObject?.bounds.origin.x + barcodeObject?.bounds.size.width - 15 || 0,
							},
						]}
					/>
					<SvgUri
						width={15}
						height={15}
						uri={definingBoxDetectQrRT.uri}
						style={[
							styles.definingBoxDetectQr,
							{
								top: barcodeObject?.bounds.origin.y || 0,
								left: barcodeObject?.bounds.origin.x + barcodeObject?.bounds.size.width - 15 || 0,
							},
						]}
					/>
				</View>
			</SafeAreaView>
		</View>
	);
}

const mapDispatchToProps = {
	getPosition,
	getPositionGroup,
};

export default connect(null, mapDispatchToProps)(PositionScan);
