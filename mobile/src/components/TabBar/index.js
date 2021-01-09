import React from 'react';
import { Dimensions, Text, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { initialSafeAreaInsets } from '@react-navigation/bottom-tabs/src/views/SafeAreaProviderCompat';
import { getTabBarHeight } from '@react-navigation/bottom-tabs/src/views/BottomTabBar';

import theme from 'mobile/src/constants/theme';

import styles from './styles';

function MyTabBar({ state, descriptors, navigation, ...remainingProps }) {
	const { currentStudio } = remainingProps;

	const focusedOptions = descriptors[state.routes[state.index].key].options;
	const isStateMain = state.routes[state.index].name === 'Main';

	if (focusedOptions.tabBarVisible === false) return null;

	const stylesContainer = currentStudio && isStateMain ? [styles.container, styles.containerMain] : [styles.container];

	const dimensions = Dimensions.get('window');
	const tabBarHeight = getTabBarHeight({
		state,
		dimensions,
		layout: { width: dimensions.width, height: 0 },
		insets: initialSafeAreaInsets,
		adaptive: remainingProps?.adaptive,
		labelPosition: remainingProps?.labelPosition,
		tabStyle: remainingProps?.tabStyle,
		style: remainingProps?.style,
	});

	return (
		<SafeAreaInsetsContext.Consumer>
			{insets => (
				<View
					style={[
						...stylesContainer,
						{ height: tabBarHeight, paddingBottom: insets.bottom, alignItems: insets.bottom ? 'flex-end' : 'center' },
					]}
				>
					{state.routes.map((route, index) => {
						const { options } = descriptors[route.key];

						const label = options?.tabBarLabel || options?.title || route?.name;
						const Icon = options?.tabBarIcon;
						const isFocused = state.index === index;

						const colorTabBarItem = isFocused ? theme.teal.A700 : currentStudio && isStateMain ? 'white' : theme.blueGrey['400'];

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
									<Text style={[{ color: colorTabBarItem }, styles.tabBarLabel]}>{label}</Text>
								</View>
							</TouchableWithoutFeedback>
						);
					})}
				</View>
			)}
		</SafeAreaInsetsContext.Consumer>
	);
}

export default MyTabBar;
