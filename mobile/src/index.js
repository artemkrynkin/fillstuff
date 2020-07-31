import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { Asset } from 'expo-asset';
import { registerRootComponent, AppLoading } from 'expo';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { initStore } from './store';
import { SERVER_URL } from './api/constants';

import Routes from './routes';

import './helpers/fontAwesomeIcons';

const store = initStore({});

const axios = require('axios').defaults;
axios.baseURL = SERVER_URL;

async function loadResourcesAsync() {
	await Promise.all([
		Asset.loadAsync([require('../assets/images/robot-dev.png'), require('../assets/images/robot-prod.png')]),
		Font.loadAsync({
			// This is the font that we are using for our tab bar
			...Ionicons.font,
			// We include SpaceMono because we use it in HomeScreen.js. Feel free to
			// remove this if you are not using it in your app
			'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
		}),
	]);
}

function handleLoadingError(error) {
	// In this case, you might want to report the error to your error reporting
	// service, for example Sentry
	console.warn(error);
}

const App = props => {
	const [isLoading, setLoading] = useState(false);

	const handleFinishLoading = () => setLoading(true);

	if (!isLoading && !props.skipLoadingScreen) {
		return <AppLoading startAsync={loadResourcesAsync} onFinish={() => handleFinishLoading()} onError={handleLoadingError} />;
	}

	return (
		<Provider store={store}>
			<SafeAreaProvider>
				<View style={styles.container}>
					{Platform.OS === 'ios' && <StatusBar barStyle="default" />}
					<NavigationContainer>
						<Routes />
					</NavigationContainer>
				</View>
			</SafeAreaProvider>
		</Provider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'black',
	},
});

registerRootComponent(App);
