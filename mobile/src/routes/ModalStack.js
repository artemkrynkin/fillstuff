import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import JoiningStudio from 'mobile/src/screens/JoiningStudio';

import MainTabStack from './MainTabStack';

const StackModal = createStackNavigator();

function ModalStack(props) {
	const {
		route: { params: routeParams },
	} = props;

	return (
		<StackModal.Navigator
			screenOptions={({ route, navigation }) => ({
				headerShown: false,
				gestureEnabled: true,
				cardOverlayEnabled: true,
				headerStatusBarHeight: navigation.dangerouslyGetState().routes.findIndex(r => r.key === route.key) > 0 ? 0 : undefined,
				...TransitionPresets.ModalPresentationIOS,
			})}
			mode="modal"
		>
			<StackModal.Screen name="MainTabStack" component={MainTabStack} initialParams={{ isCurrentStudio: routeParams.isCurrentStudio }} />
			<StackModal.Screen
				name="JoiningStudio"
				component={JoiningStudio}
				options={{
					gestureResponseDistance: { vertical: 500 },
				}}
			/>
		</StackModal.Navigator>
	);
}

export default ModalStack;
