import Constants from 'expo-constants';

const ENV = {
	dev: {
		apiUrl: 'http://192.168.0.144:3001/api',
	},
	staging: {
		apiUrl: 'https://staging.blikside.com/api',
	},
	prod: {
		apiUrl: 'https://blikside.com/api',
	},
};

function getEnvVars(env = '') {
	if (env === undefined || env === '') return ENV.dev.apiUrl;
	if (env.indexOf('dev') !== -1) return ENV.dev.apiUrl;
	if (env.indexOf('staging') !== -1) return ENV.staging.apiUrl;
	if (env.indexOf('prod') !== -1) return ENV.prod.apiUrl;
}

export const SERVER_URL = getEnvVars(Constants.manifest.releaseChannel);

// export const CLIENT_URL = !__DEV__ ? `${window.location.protocol}//${window.location.host}` : 'http://localhost:3000';
