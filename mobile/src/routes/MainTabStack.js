import React from 'react';
import { connect } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import theme from 'mobile/src/constants/theme';

import WriteOffs from 'mobile/src/screens/WriteOffs';
import Main from 'mobile/src/screens/Main';

import MyTabBar from 'mobile/src/components/TabBar';

const Tab = createBottomTabNavigator();

function MainTabStack(props) {
	const {
		currentStudio: {
			data: currentStudio,
			// isFetching: isLoadingCurrentUser,
			// error: errorCurrentUser
		},
	} = props;

	return (
		<Tab.Navigator
			tabBar={props => (Boolean(currentStudio) ? <MyTabBar {...props} /> : null)}
			initialRouteName="Main"
			tabBarOptions={{
				isCurrentStudio: Boolean(currentStudio),
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
	};
};

export default connect(mapStateToProps, null)(MainTabStack);
