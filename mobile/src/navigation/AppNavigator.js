import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';

import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import MainTabNavigator from './MainTabNavigator';

const AppStack = createStackNavigator(
	{
		Main: MainTabNavigator,
	},
	{
		headerMode: 'none',
	}
);
const AuthStack = createStackNavigator(
	{
		Login: LoginScreen,
	},
	{
		headerMode: 'none',
	}
);

export default createAppContainer(
	createSwitchNavigator(
		{
			AuthLoading: AuthLoadingScreen,
			App: AppStack,
			Auth: AuthStack,
		},
		{
			initialRouteName: 'AuthLoading',
		}
	)
);
