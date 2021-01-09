import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { debounce } from 'lodash';
import { Asset } from 'expo-asset';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import { SvgUri } from 'react-native-svg';
import { useIsFocused } from '@react-navigation/native';

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
	const { modalData, onVisibleModalByName, cameraScanned, setCameraScanned } = props;
	const isFocusedScreen = useIsFocused();
	const [hasPermissionCamera, setHasPermissionCamera] = useState(null);
	const [barcodeObject, setBarcodeObject] = useState(null);
	const [cameraInfo, setCameraInfo] = useState('');

	const onOpenSettings = useCallback(async () => {
		await Linking.openSettings();
	}, []);

	const onBarCodeScanned = async barCodeEvent => {
		const barcodeData = isJson(barCodeEvent.data) ? JSON.parse(barCodeEvent.data) : barCodeEvent.data;

		if (
			(cameraScanned && barcodeData?.id !== modalData.position?.qrcodeId && barcodeData?.id !== modalData.positionGroup?.qrcodeId) ||
			(cameraScanned && !barcodeData.type && !barcodeData.id)
		) {
			return;
		}

		setBarcodeObject(barCodeEvent);
		onClearBarcodeObject();

		if (cameraScanned) return;

		if (barcodeData.type && barcodeData.id) {
			switch (barcodeData.type) {
				case 's-p': {
					setCameraScanned(true);

					const { data: position } = await props.getPosition({ qrcodeId: barcodeData.id });

					if (position?.length) {
						const positionGroup = {
							name: position[0].name,
							positions: position,
						};

						return onVisibleModalByName('modalPositionGroup', 'positionGroup', positionGroup);
					}

					return onVisibleModalByName('modalPositionWriteOff', 'position', position);
				}
				case 's-pg': {
					setCameraScanned(true);

					const { data: positionGroup } = await props.getPositionGroup({ qrcodeId: barcodeData.id });

					return onVisibleModalByName('modalPositionGroup', 'positionGroup', positionGroup);
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
					<Text style={styles.linkText}>Предоставить доступ</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<>
			{isFocusedScreen ? (
				<BarCodeScanner
					zoom={0}
					onBarCodeScanned={onBarCodeScanned}
					barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
					style={StyleSheet.absoluteFillObject}
				/>
			) : null}
			<SafeAreaView style={styles.scanningContainer}>
				<SvgUri
					width={250}
					height={250}
					uri={cameraDefiningBox.uri}
					style={[styles.cameraDefiningBox, { opacity: Number(!Boolean(barcodeObject) && !cameraScanned) }]}
				/>
				<View style={[styles.detectQrContent, { opacity: Number(Boolean(barcodeObject)) }]}>
					{cameraInfo ? <Text style={styles.cameraInfo}>{cameraInfo}</Text> : null}
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
		</>
	);
}

const mapDispatchToProps = dispatch => {
	return {
		getPosition: params => dispatch(getPosition({ params })),
		getPositionGroup: params => dispatch(getPositionGroup({ params })),
	};
};

export default connect(null, mapDispatchToProps)(PositionScan);
