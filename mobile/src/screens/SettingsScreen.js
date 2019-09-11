import React, { Component } from 'react';
import { AsyncStorage, View, Button } from 'react-native';

class SettingsScreen extends Component {
	logout = async () => {
		await AsyncStorage.clear();
		this.props.navigation.navigate('Auth');
	};

	render() {
		return (
			<View>
				<Button title="Выйти" onPress={this.logout} />
			</View>
		);
	}
}

export default SettingsScreen;
