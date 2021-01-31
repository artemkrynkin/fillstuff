import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { Text, TouchableOpacity, View, Pressable } from 'react-native';
import { Audio } from 'expo-av';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import * as Haptics from 'expo-haptics';

import { sleep } from 'mobile/src/helpers/utils';

import PositionSummary from 'mobile/src/components/PositionSummary';

import { createWriteOff } from 'mobile/src/actions/writeOffs';

import styles from './styles';

let timer;

function ModalPositionWriteOff(props) {
	const {
		visible,
		onClose,
		position,
		currentUser: {
			data: currentUser,
			// isFetching: isLoadingCurrentUser,
			// error: errorCurrentUser
		},
	} = props;
	const [availableQuantity, setAvailableQuantity] = useState(0);
	const [writeOffQuantity, setWriteOffQuantity] = useState(0);
	const [buttonChangeQuantityPressed, setButtonChangeQuantityPressed] = useState(false);
	const [successWriteOffSound, setSuccessWriteOffSound] = useState();

	const onChangeQuantity = action =>
		setWriteOffQuantity(prevQuantity => {
			const maxQuantityWriteOffOneTime = availableQuantity < 30 ? availableQuantity : 30;

			return prevQuantity < maxQuantityWriteOffOneTime && action === 'plus'
				? prevQuantity + 1
				: prevQuantity > 0 && action === 'minus'
				? prevQuantity - 1
				: prevQuantity;
		});

	const onPressedChangeQuantity = async action => {
		await Haptics.impactAsync('light');

		setButtonChangeQuantityPressed(true);
		timer = setInterval(() => onChangeQuantity(action), 70);
	};

	const onPressOutChangeQuantity = () => {
		if (buttonChangeQuantityPressed) {
			setButtonChangeQuantityPressed(false);
			clearTimeout(timer);
		}
	};

	const onWriteOffSubmit = async () => {
		try {
			const { sound } = await Audio.Sound.createAsync(require('mobile/assets/sounds/write-off_confirmation.aac'));

			setSuccessWriteOffSound(sound);

			await props.createWriteOff({ params: { positionId: position._id }, data: { quantity: writeOffQuantity } });

			await Promise.all(sound.playAsync(), Haptics.notificationAsync('success'));
		} catch (error) {
			await Haptics.notificationAsync('error');
		}

		onClose();
	};

	useEffect(() => {
		const availableQuantity =
			position && position.receipts.length ? position.receipts.reduce((total, receipt) => total + receipt.current.quantity, 0) : 0;

		setAvailableQuantity(availableQuantity);

		if (position && position.printDestination === 'eachUnit' && availableQuantity !== 0) {
			setWriteOffQuantity(1);
		}
	}, [position]);

	useEffect(() => {
		(async () => {
			if (visible) {
				await Haptics.impactAsync('medium');
			} else {
				setAvailableQuantity(0);
				setWriteOffQuantity(0);
				setButtonChangeQuantityPressed(false);
			}
		})();
	}, [visible]);

	React.useEffect(() => {
		return successWriteOffSound
			? () => {
					successWriteOffSound.unloadAsync();
			  }
			: undefined;
	}, [successWriteOffSound]);

	return (
		<SafeAreaInsetsContext.Consumer>
			{insets => (
				<Modal
					animationInTiming={200}
					animationOutTiming={400}
					isVisible={visible}
					onBackdropPress={() => onClose()}
					onSwipeComplete={() => onClose()}
					swipeDirection={['down']}
					style={styles.modal}
				>
					<View style={{ ...styles.modalContainer, paddingBottom: insets.bottom || 15 }}>
						{position ? (
							<>
								<View style={styles.modalHeader}>
									<PositionSummary name={position.name} characteristics={position.characteristics} size="md" avatar />
									<TouchableOpacity
										style={styles.modalClose}
										onPress={() => onClose()}
										children={<FontAwesomeIcon style={styles.modalCloseIcon} icon={['fal', 'times']} size={24} />}
									/>
								</View>
								<View style={styles.modalContent}>
									<View style={styles.priceQuantityContainer}>
										{availableQuantity !== 0 ? (
											<>
												<View
													style={{
														flexDirection: !position.isFree ? 'row' : 'column',
														alignItems: !position.isFree ? 'center' : 'flex-start',
													}}
												>
													{writeOffQuantity ? (
														<Text style={styles.writeOffQuantity}>
															{writeOffQuantity} {position.unitRelease === 'pce' ? 'шт.' : 'уп.'}
														</Text>
													) : null}
													{writeOffQuantity && !position.isFree ? (
														<FontAwesomeIcon style={styles.writeOffQuantityIcon} icon={['fal', 'times']} size={14} />
													) : null}
													{!position.isFree ? (
														<Text style={styles.sellingPrice}>
															{currentUser.settings.member.markupPosition
																? position.activeReceipt.unitSellingPrice
																: position.activeReceipt.unitSellingPrice - position.activeReceipt.unitMarkup}
															{' ₽'}
														</Text>
													) : (
														<Text style={styles.sellingPrice}>Бесплатно</Text>
													)}
												</View>
												{position.printDestination === 'storage' ? (
													<View style={styles.quantityActions}>
														<Pressable
															onPress={() => onChangeQuantity('minus')}
															onLongPress={() => onPressedChangeQuantity('minus')}
															onPressOut={() => onPressOutChangeQuantity()}
															delayLongPress={200}
															style={({ pressed }) =>
																pressed ? [styles.buttonChangeQuantity, styles.buttonChangeQuantityActive] : [styles.buttonChangeQuantity]
															}
															children={<FontAwesomeIcon style={styles.buttonChangeQuantityIcon} icon={['far', 'minus']} size={20} />}
														/>
														<Pressable
															onPress={() => onChangeQuantity('plus')}
															onLongPress={() => onPressedChangeQuantity('plus')}
															onPressOut={() => onPressOutChangeQuantity()}
															delayLongPress={200}
															style={({ pressed }) =>
																pressed ? [styles.buttonChangeQuantity, styles.buttonChangeQuantityActive] : [styles.buttonChangeQuantity]
															}
															children={<FontAwesomeIcon style={styles.buttonChangeQuantityIcon} icon={['far', 'plus']} size={20} />}
														/>
													</View>
												) : null}
											</>
										) : (
											<Text style={styles.outOfStock}>Отсутствует на складе</Text>
										)}
									</View>
									<Pressable
										onPress={() => onWriteOffSubmit()}
										style={({ pressed }) =>
											availableQuantity === 0 || writeOffQuantity === 0
												? [styles.button, styles.buttonDisabled]
												: pressed
												? [styles.button, styles.buttonActive]
												: [styles.button]
										}
										disabled={availableQuantity === 0 || writeOffQuantity === 0}
									>
										<Text style={styles.buttonText}>Списать</Text>
									</Pressable>
								</View>
							</>
						) : null}
					</View>
				</Modal>
			)}
		</SafeAreaInsetsContext.Consumer>
	);
}

const mapStateToProps = state => {
	const { user } = state;

	return {
		currentUser: state.user,
	};
};

ModalPositionWriteOff.propTypes = {
	visible: PropTypes.bool.isRequired,
	position: PropTypes.object,
	onClose: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
	createWriteOff,
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalPositionWriteOff);
