import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { getItemObject } from './helpers/storage';

import Login from './screens/Login';
import Main from './screens/Main';
import Settings from './screens/Settings';

import { restore } from './actions/authentication';

const StackLoggedOut = createDrawerNavigator();
const StackLoggedIn = createDrawerNavigator();

const StackRoot = createStackNavigator();

const StackRootScreens = () => {
	return (
		<StackRoot.Navigator
			screenOptions={({ route, navigation }) => {
				if (route.name === 'Main')
					return {
						headerShown: false,
					};
			}}
		>
			<StackRoot.Screen name="Main" options={{ title: 'Камера' }} component={Main} />
			<StackRoot.Screen name="Settings" options={{ title: 'Настройки', headerBackTitle: 'Назад' }} component={Settings} />
		</StackRoot.Navigator>
	);
};

const Routes = props => {
	const {
		currentUser: {
			data: currentUser,
			// isFetching: isLoadingCurrentUser,
			// error: errorCurrentUser
		},
	} = props;

	useEffect(() => {
		const bootstrapAsync = async () => {
			let user;

			try {
				user = await getItemObject('user');
			} catch (e) {}

			props.restore(user);
		};

		bootstrapAsync();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (currentUser === null) {
		return (
			<StackLoggedOut.Navigator>
				<StackLoggedOut.Screen name="Login" component={Login} />
			</StackLoggedOut.Navigator>
		);
	} else {
		return (
			<StackLoggedIn.Navigator>
				<StackLoggedIn.Screen name="StackRootScreens" component={StackRootScreens} />
			</StackLoggedIn.Navigator>
		);
	}
};

const mapStateToProps = state => {
	return {
		currentUser: state.user,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		restore: values => dispatch(restore(values)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
