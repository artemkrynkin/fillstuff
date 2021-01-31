import React from 'react';
import { Dimensions, View } from 'react-native';
import { getTabBarHeight } from '@react-navigation/bottom-tabs/src/views/BottomTabBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

import styles from './styles';

function ViewContainer(props) {
	const { state, isCurrentStudio, isStateMain, safeAreaInsets, children, ...remainingProps } = props;

	const stylesContainer = isCurrentStudio && isStateMain ? [styles.container, styles.containerMain] : [styles.container];

	const defaultInsets = useSafeAreaInsets();

	const insets = {
		top: safeAreaInsets?.top ?? defaultInsets.top,
		right: safeAreaInsets?.right ?? defaultInsets.right,
		bottom: safeAreaInsets?.bottom ?? defaultInsets.bottom,
		left: safeAreaInsets?.left ?? defaultInsets.left,
	};

	const dimensions = Dimensions.get('window');
	const tabBarHeight = getTabBarHeight({
		state,
		dimensions,
		layout: { width: dimensions.width, height: 0 },
		insets,
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
		>
			{/*<View onLayout={handleLayout}>*/}
			{children}
			{/*</View>*/}
		</BlurView>
	);
}

export default ViewContainer;
