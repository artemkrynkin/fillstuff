import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';

import { getItemObject } from './helpers/storage';

import Login from './screens/Login';
import Main from './screens/Main';
import Settings from './screens/Settings';

import { restore } from './actions/authentication';

const StackRoot = createStackNavigator();

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

	return (
		<StackRoot.Navigator
			screenOptions={({ route, navigation }) => {
				if (/^(Login|Main)$/.test(route.name))
					return {
						headerShown: false,
					};
			}}
		>
			{currentUser === null ? (
				<>
					<StackRoot.Screen name="Login" component={Login} options={{ title: 'Вход', animationEnabled: false }} />
				</>
			) : (
				<>
					<StackRoot.Screen name="Main" component={Main} options={{ title: 'Камера', animationEnabled: false }} />
					<StackRoot.Screen name="Settings" component={Settings} options={{ title: 'Настройки', headerBackTitle: 'Назад' }} />
				</>
			)}
		</StackRoot.Navigator>
	);
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
