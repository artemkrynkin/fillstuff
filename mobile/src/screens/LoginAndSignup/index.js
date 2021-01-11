import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Platform, StatusBar, View, Pressable, Text, Alert } from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as AuthSession from 'expo-auth-session';
import { Asset } from 'expo-asset';
import { SvgUri } from 'react-native-svg';
import * as SecureStore from 'expo-secure-store';

import { config } from 'mobile/src/api/auth';

import { getAccessToken } from 'mobile/src/actions/authentication';
import { getMyAccount } from 'mobile/src/actions/user';
import { getStudios } from 'mobile/src/actions/studios';

import styles from './styles';

const logoLockupNeutral = Asset.fromModule(require('mobile/assets/images/logo/lockup_neutral.svg'));

const useProxy = Platform.select({ web: false, default: true });
const redirectUri = AuthSession.makeRedirectUri({ useProxy });

function LoginAndSignup(props) {
	const [request, result, promptAsync] = AuthSession.useAuthRequest(
		{
			redirectUri,
			clientId: config.clientId,
			responseType: 'code',
			scopes: ['openid', 'profile'],
			extraParams: {
				audience: 'https://keeberink-api',
				connection: 'Username-Password-Authentication',
				nonce: 'nonce',
			},
			prompt: 'login',
		},
		{ authorizationEndpoint: `https://${config.domain}/authorize` }
	);

	useEffect(() => {
		(async () => {
			if (!result) return;

			if (result.error) {
				Alert.alert('Authentication error', result.params.error_description || 'Something went wrong');
				return;
			}

			if (result.type === 'success') {
				try {
					await props.getAccessToken({
						code: result.params.code,
						codeVerifier: request.codeVerifier,
						redirectUri,
					});

					const authData = JSON.parse(await SecureStore.getItemAsync('authData'));

					axios.defaults.headers.common['authorization'] = `${authData.token_type} ${authData.access_token}`;

					await Promise.all(props.getMyAccount(), props.getStudios());
				} catch (error) {
					Alert.alert('Authentication error', 'Something went wrong');
				}
			}
		})();
	}, [result]);

	return (
		<SafeAreaView style={styles.safeAreaContent}>
			<StatusBar barStyle="light-content" animated />
			<View style={styles.container}>
				<SvgUri width={190} height={40} uri={logoLockupNeutral.uri} style={styles.logo} />
				<Pressable
					disabled={!request}
					onPress={() => promptAsync({ useProxy })}
					style={({ pressed }) => (pressed ? [styles.button, styles.buttonActive] : [styles.button])}
				>
					<Text style={styles.buttonText}>Войти в аккаунт</Text>
				</Pressable>
			</View>
		</SafeAreaView>
	);
}

const mapDispatchToProps = {
	getAccessToken,
	getMyAccount,
	getStudios,
};

export default connect(null, mapDispatchToProps)(LoginAndSignup);
