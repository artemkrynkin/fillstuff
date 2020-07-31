import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Button } from 'react-native';

import { logout } from '../actions/authentication';

class Settings extends Component {
	logout = () => this.props.logout();

	render() {
		return (
			<View>
				<Button title="Выйти" onPress={this.logout} />
			</View>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		logout: () => dispatch(logout()),
	};
};

export default connect(null, mapDispatchToProps)(Settings);
