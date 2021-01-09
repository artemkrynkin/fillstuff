import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import MyTabBar from 'mobile/src/components/TabBar';

import LoginAndSignup from 'mobile/src/screens/LoginAndSignup';
import Main from 'mobile/src/screens/Main';
import WriteOffs from 'mobile/src/screens/WriteOffs';

import { getMyAccount } from 'mobile/src/actions/user';
import { getStudios } from 'mobile/src/actions/studios';

import theme from 'mobile/src/constants/theme';

const StackRoot = createStackNavigator();
const Tab = createBottomTabNavigator();

function Routes(props) {
	const {
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

	useEffect(() => {
		(async () => {
			try {
				const authData = JSON.parse(await SecureStore.getItemAsync('authData'));

				if (authData) {
					axios.defaults.headers.common['authorization'] = `${authData.token_type} ${authData.access_token}`;

					await Promise.all(props.getMyAccount(), props.getStudios());
				}
			} catch (error) {}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			{currentUser === null ? (
				<StackRoot.Navigator
					screenOptions={({ route, navigation }) => {
						if (/^(LoginAndSignup)$/.test(route.name))
							return {
								headerShown: false,
							};
					}}
				>
					<StackRoot.Screen
						name="LoginAndSignup"
						component={LoginAndSignup}
						options={{ title: 'Вход и регистрация', animationEnabled: false }}
					/>
				</StackRoot.Navigator>
			) : (
				<Tab.Navigator
					tabBar={props => <MyTabBar {...props} />}
					initialRouteName="Main"
					tabBarOptions={{
						currentStudio: currentStudio,
					}}
					sceneContainerStyle={{
						backgroundColor: theme.brightness['4'],
					}}
				>
					<Tab.Screen
						name="Main"
						component={Main}
						options={{
							tabBarLabel: 'Главная',
							tabBarIcon: ({ color, size }) => <FontAwesomeIcon icon={['far', 'home-alt']} color={color} size={size} />,
						}}
					/>
					<Tab.Screen
						name="writeOffs"
						component={WriteOffs}
						options={{
							tabBarLabel: 'Списания',
							tabBarIcon: ({ color, size }) => <FontAwesomeIcon icon={['far', 'scanner']} color={color} size={size} />,
						}}
					/>
				</Tab.Navigator>
			)}
		</>
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
		getMyAccount: () => dispatch(getMyAccount()),
		getStudios: () => dispatch(getStudios()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
