import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

import LoginAndSignup from 'mobile/src/screens/LoginAndSignup';

import { getMyAccount } from 'mobile/src/actions/user';
import { getStudios } from 'mobile/src/actions/studios';

import ModalStack from './ModalStack';

const StackRoot = createStackNavigator();

function Index(props) {
	const {
		currentStudio: {
			data: currentStudio,
			// isFetching: isLoadingCurrentUser,
			// error: errorCurrentUser
		},
		currentUser: {
			data: currentUser,
			// isFetching: isLoadingCurrentUser,
			// error: errorCurrentUser
		},
	} = props;

	useEffect(() => {
		(async () => {
			try {
				const authData = JSON.parse(await SecureStore.getItemAsync('authData'));

				if (authData) {
					axios.defaults.headers.common['authorization'] = `${authData.token_type} ${authData.access_token}`;

					await Promise.all(props.getMyAccount(), props.getStudios());
				}
			} catch (error) {}
		})();
	}, []);

	return (
		<StackRoot.Navigator>
			{currentUser === null ? (
				<StackRoot.Screen
					name="LoginAndSignup"
					component={LoginAndSignup}
					options={{ title: 'Вход и регистрация', headerShown: false, animationEnabled: false }}
				/>
			) : (
				<>
					<StackRoot.Screen
						name="ModalStack"
						component={ModalStack}
						options={{ headerShown: false, animationEnabled: false }}
						initialParams={{ isCurrentStudio: Boolean(currentStudio) }}
					/>
				</>
			)}
		</StackRoot.Navigator>
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
		currentUser: state.user,
	};
};

const mapDispatchToProps = {
	getMyAccount,
	getStudios,
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
