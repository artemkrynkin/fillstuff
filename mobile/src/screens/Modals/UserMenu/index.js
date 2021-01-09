import React from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableHighlight, FlatList, Alert, Image } from 'react-native';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import theme from 'mobile/src/constants/theme';

import { logout } from 'mobile/src/actions/authentication';

import styles from './styles';

function ModalUserMenu(props) {
	const {
		visible,
		onClose,
		currentStudio: {
			data: currentStudio,
			// isFetching: isLoadingCurrentUser,
			// error: errorCurrentUser
		},
		currentUser: {
			data: currentUser,
			// isFetching: isLoadingCurrentUser,
			// error: errorCurrentUser
		},
	} = props;

	const onLogout = () => {
		Alert.alert(
			'Уверены, что хотите выйти из аккаунта?',
			'',
			[
				{
					text: 'Отмена',
					style: 'cancel',
				},
				{
					text: 'Выйти',
					onPress: () => {
						onClose();
						props.logout();
					},
					style: 'destructive',
				},
			],
			{ cancelable: false }
		);
	};

	const menu = [
		{
			onPress: () => onLogout(),
			title: 'Выйти',
			icon: <FontAwesomeIcon style={styles.modalCloseIcon} icon={['far', 'door-open']} size={28} />,
		},
	];

	return (
		<Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
			<View style={styles.modalHeader}>
				<TouchableOpacity
					style={styles.modalClose}
					onPress={onClose}
					children={<FontAwesomeIcon style={styles.modalCloseIcon} icon={['fal', 'times']} size={24} />}
				/>
			</View>
			<FlatList
				data={menu}
				ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
				ListHeaderComponent={
					<View style={styles.contentHeader}>
						<Image
							style={styles.userAvatar}
							source={{
								uri: currentUser.picture,
							}}
						/>
						<Text style={styles.userName}>{currentUser.name}</Text>
						{currentStudio ? <Text style={styles.studioName}>{currentStudio.name}</Text> : null}
					</View>
				}
				renderItem={({ item: menuItem, index }) => (
					<TouchableHighlight onPress={menuItem.onPress} underlayColor={theme.brightness['4']}>
						<View style={styles.menuItem}>
							<View style={styles.menuIcon}>{menuItem.icon}</View>
							<View style={styles.menuTitleContainer}>
								<Text style={styles.menuTitle}>{menuItem.title}</Text>
							</View>
						</View>
					</TouchableHighlight>
				)}
				keyExtractor={() => ''.concat(Math.random())}
			/>
		</Modal>
	);
}

const mapStateToProps = state => {
	const { user, studios } = state;

	let currentStudio = {
		data: studios.data && user.data ? studios.data.data.find(studio => studio._id === user.data.settings.studio) : null,
		isFetching: studios.isFetching,
	};

	return {
		currentStudio: currentStudio,
		currentUser: state.user,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		logout: () => dispatch(logout()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalUserMenu);
