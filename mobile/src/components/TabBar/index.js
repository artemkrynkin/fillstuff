import React from 'react';
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import theme from 'mobile/src/constants/theme';

import ViewContainer from './ViewContainer';

import styles from './styles';

function MyTabBar({ state, descriptors, navigation, ...remainingProps }) {
	const { isCurrentStudio, studiosTest } = remainingProps;

	const focusedOptions = descriptors[state.routes[state.index].key].options;
	const isStateMain = state.routes[state.index].name === 'Main';

	if (focusedOptions.tabBarVisible === false) return null;

	return (
		<ViewContainer isStateMain={isStateMain} {...remainingProps}>
			{state.routes.map((route, index) => {
				const { options } = descriptors[route.key];

				const label = options?.tabBarLabel || options?.title || route?.name;
				const Icon = options?.tabBarIcon;
				const isFocused = state.index === index;

				const colorTabBarItem = isFocused ? theme.teal.A700 : isCurrentStudio && isStateMain ? 'white' : theme.blueGrey['400'];

				const onPress = () => {
					const event = navigation.emit({
						type: 'tabPress',
						target: route.key,
						canPreventDefault: true,
					});

					if (!isFocused && !event.defaultPrevented) {
						navigation.navigate(route.name);
					}
				};

				return (
					<TouchableWithoutFeedback
						key={route.key}
						accessibilityRole="button"
						accessibilityState={isFocused ? { selected: true } : {}}
						accessibilityLabel={options.tabBarAccessibilityLabel}
						onPress={onPress}
					>
						<View style={styles.tabBarItem}>
							<Icon size={26} color={colorTabBarItem} focused={isFocused} />
							<Text style={[{ color: colorTabBarItem }, styles.tabBarLabel]}>
								{label}
								{studiosTest}
							</Text>
						</View>
					</TouchableWithoutFeedback>
				);
			})}
		</ViewContainer>
	);
}

export default MyTabBar;
