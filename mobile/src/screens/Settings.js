import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Button, StatusBar } from 'react-native';

import { logout } from '../actions/authentication';

class Settings extends Component {
	logout = () => this.props.logout();

	render() {
		return (
			<>
				<StatusBar barStyle="dark-content" animated />
				<View>
					<Button title="Выйти" onPress={this.logout} />
				</View>
			</>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		logout: () => dispatch(logout()),
	};
};

export default connect(null, mapDispatchToProps)(Settings);
