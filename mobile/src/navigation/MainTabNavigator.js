import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import PositionScanningScreen from '../screens/PositionScanningScreen';
import SettingsScreen from '../screens/SettingsScreen';

const PositionScanningStack = createStackNavigator(
	{
		PositionScanning: PositionScanningScreen,
	},
	{
		headerMode: 'none',
	}
);

PositionScanningStack.navigationOptions = {
	tabBarLabel: 'Сканирование товара',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon
			focused={focused}
			name={Platform.OS === 'ios' ? `ios-information-circle${focused ? '' : '-outline'}` : 'md-information-circle'}
		/>
	),
};

const HomeStack = createStackNavigator({
	Home: HomeScreen,
});

HomeStack.navigationOptions = {
	tabBarLabel: 'Добавление товара',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon
			focused={focused}
			name={Platform.OS === 'ios' ? `ios-information-circle${focused ? '' : '-outline'}` : 'md-information-circle'}
		/>
	),
};

const SettingsStack = createStackNavigator({
	Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
	tabBarLabel: 'Настройки',
	tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />,
};

export default createBottomTabNavigator({
	PositionScanningStack,
	// HomeStack,
	SettingsStack,
});