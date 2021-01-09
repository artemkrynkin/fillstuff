import React from 'react';
import { connect } from 'react-redux';
import { Text, View, ScrollView } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import FocusAwareStatusBar from 'mobile/src/components/FocusAwareStatusBar';

function WriteOffs(props) {
	const tabBarHeight = useBottomTabBarHeight();

	// console.log(tabBarHeight);

	return (
		<View style={{ paddingBottom: tabBarHeight }}>
			<FocusAwareStatusBar barStyle="dark-content" />
			<ScrollView>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
				<Text>12312</Text>
			</ScrollView>
		</View>
	);
}

const mapStateToProps = state => {
	const { user, studios } = state;

	let currentStudio = {
		data: studios.data && user.data ? studios.data.data.find(studio => studio._id === user.data.settings.studio) : null,
		isFetching: studios.isFetching,
	};

	return {
		studios: state.studios,
		currentStudio: currentStudio,
		currentUser: state.user,
	};
};

const mapDispatchToProps = dispatch => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(WriteOffs);
