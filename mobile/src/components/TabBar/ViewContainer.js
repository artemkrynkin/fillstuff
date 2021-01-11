import React from 'react';
import { Dimensions } from 'react-native';
import { getTabBarHeight } from '@react-navigation/bottom-tabs/src/views/BottomTabBar';
import { initialSafeAreaInsets } from '@react-navigation/bottom-tabs/src/views/SafeAreaProviderCompat';
import { BlurView } from 'expo-blur';

import styles from './styles';

function ViewContainer(props) {
	const { state, isCurrentStudio, isStateMain, insets, children, ...remainingProps } = props;

	const stylesContainer = isCurrentStudio && isStateMain ? [styles.container, styles.containerMain] : [styles.container];

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
		<BlurView
			intensity={isCurrentStudio && isStateMain ? 90 : 95}
			tint={isCurrentStudio && isStateMain ? 'dark' : 'light'}
			style={[
				...stylesContainer,
				{ height: tabBarHeight, paddingBottom: insets.bottom, alignItems: insets.bottom ? 'flex-end' : 'center' },
			]}
			children={children}
		/>
	);
}

export default ViewContainer;
