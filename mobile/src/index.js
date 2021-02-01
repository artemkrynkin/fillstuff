import React, { useState } from 'react';
import { StatusBar, View } from 'react-native';
import { Provider } from 'react-redux';
import { Asset } from 'expo-asset';
import { registerRootComponent } from 'expo';
import AppLoading from 'expo-app-loading';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import moment from 'moment';
import 'moment/locale/ru';

import { initStore } from 'mobile/src/store';

import Routes from 'mobile/src/routes';

import 'mobile/src/helpers/fontAwesomeIcons';

const store = initStore({});

moment.locale('ru');
moment().format();

async function loadResourcesAsync() {
	await Promise.all([
		Asset.loadAsync([
			require('mobile/assets/images/robot-dev.png'),
			require('mobile/assets/images/robot-prod.png'),
			require('mobile/assets/images/logo/lockup_neutral.svg'),
			require('mobile/assets/images/camera/defining_box_detect_qr_lt.svg'),
			require('mobile/assets/images/camera/defining_box_detect_qr_lb.svg'),
			require('mobile/assets/images/camera/defining_box_detect_qr_rb.svg'),
			require('mobile/assets/images/camera/defining_box_detect_qr_rt.svg'),
			require('mobile/assets/images/camera/defining_box.svg'),
			require('mobile/assets/images/stubs/scan_qr_studio_invitation.png'),
			require('mobile/assets/images/stubs/write_offs_empty.png'),
			require('mobile/assets/sounds/write_off_confirmation.wav'),
		]),
		// Font.loadAsync({
		// 	// We include SpaceMono because we use it in HomeScreen.js. Feel free to
		// 	// remove this if you are not using it in your app
		// 	'space-mono': require('mobile/assets/fonts/SpaceMono-Regular.ttf'),
		// }),
	]);
}

function handleLoadingError(error) {
	// In this case, you might want to report the error to your error reporting
	// service, for example Sentry
	console.warn(error);
}

const App = props => {
	const [isLoading, setLoading] = useState(false);

	const handleFinishLoading = () => {
		setLoading(true);
	};

	if (!isLoading && !props.skipLoadingScreen) {
		return <AppLoading startAsync={loadResourcesAsync} onFinish={() => handleFinishLoading()} onError={handleLoadingError} />;
	}

	return (
		<Provider store={store}>
			<SafeAreaProvider>
				<View style={{ flex: 1 }}>
					<StatusBar />
					<NavigationContainer>
						<Routes />
					</NavigationContainer>
				</View>
			</SafeAreaProvider>
		</Provider>
	);
};

registerRootComponent(App);
