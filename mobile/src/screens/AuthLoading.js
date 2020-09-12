import React, { Component } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class AuthLoading extends Component {
	constructor(props) {
		super(props);
		this.bootstrapAsync();
	}

	bootstrapAsync = async () => {
		const authorized = await AsyncStorage.getItem('authorized');

		this.props.navigation.navigate(authorized ? 'App' : 'Auth');
	};

	render() {
		return (
			<View style={styles.container}>
				<ActivityIndicator />
				<StatusBar barStyle="light-content" />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default AuthLoading;
