import React, { useEffect, useRef, useState } from 'react';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { Text, TouchableOpacity, View, Pressable, ScrollView, TouchableWithoutFeedback, TouchableHighlight, FlatList } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import theme from 'mobile/src/constants/theme';

import { sleep } from 'mobile/src/helpers/utils';

import PositionSummary from 'mobile/src/components/PositionSummary';

import { getPosition } from 'mobile/src/actions/positions';

import styles from './styles';

function ModalPositionGroup(props) {
	const { visible, onClose, positionGroup, onVisibleModalByName, onDisableModalByName } = props;

	const onOpenPosition = async positionId => {
		const { data: position } = await props.getPosition({ params: { positionId } });

		onDisableModalByName('modalPositionGroup', 'positionGroup');

		await sleep(400);

		onVisibleModalByName('modalPositionWriteOff', 'position', position);
	};

	return (
		<SafeAreaInsetsContext.Consumer>
			{insets => (
				<Modal
					animationInTiming={200}
					animationOutTiming={400}
					isVisible={visible}
					onBackdropPress={() => onClose()}
					onSwipeComplete={() => onClose()}
					swipeDirection="down"
					style={styles.modal}
					propagateSwipe
				>
					<View style={{ ...styles.modalContainer }}>
						{positionGroup ? (
							<>
								<View style={styles.modalHeader}>
									<Text style={styles.modalTitle}>{positionGroup.name}</Text>
									<TouchableOpacity
										style={styles.modalClose}
										onPress={() => onClose()}
										children={<FontAwesomeIcon style={styles.modalCloseIcon} icon={['fal', 'times']} size={24} />}
									/>
								</View>
								<FlatList
									data={positionGroup.positions}
									ItemSeparatorComponent={() => <View style={styles.positionSeparator} />}
									keyExtractor={position => position._id}
									renderItem={({ item: position }) => (
										<TouchableHighlight onPress={() => onOpenPosition(position._id)} underlayColor={theme.brightness['4']}>
											<PositionSummary
												name={position.name}
												characteristics={position.characteristics}
												size="sm"
												style={styles.position}
												avatar
											/>
										</TouchableHighlight>
									)}
									ListFooterComponent={<View />}
									ListFooterComponentStyle={{ height: insets.bottom }}
								/>
							</>
						) : null}
					</View>
				</Modal>
			)}
		</SafeAreaInsetsContext.Consumer>
	);
}

const mapDispatchToProps = {
	getPosition,
};

export default connect(null, mapDispatchToProps)(ModalPositionGroup);
