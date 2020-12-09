const IS_PROD = process.env.NODE_ENV === 'production';

const DEV_CONFIG = {
	dbConnectionName: 'Username-Password-Authentication',
	clientId: 'J7H0qGhB0ZwM4d0bGV24Px4l675Yr9WI',
	domain: 'keeberinklocal.eu.auth0.com',
	audience: 'https://keeberink-api',
	redirectUri: 'http://localhost:3003/auth/loginCallback',
};

const PRODUCTION_CONFIG = {
	dbConnectionName: 'Username-Password-Authentication',
	clientId: '4pmdOXEv0seOwvHscw6vUE8VnzQESUWA',
	domain: 'auth.keeberink.com',
	audience: 'https://keeberink-api',
	redirectUri: 'https://account.keeberink.com/auth/loginCallback',
};

export const config = IS_PROD ? PRODUCTION_CONFIG : DEV_CONFIG;
