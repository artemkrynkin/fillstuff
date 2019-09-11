import React, { Component } from 'react';
import { ActivityIndicator, AsyncStorage, StatusBar, StyleSheet, View } from 'react-native';

class AuthLoadingScreen extends Component {
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
				<StatusBar barStyle="default" />
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

export default AuthLoadingScreen;
