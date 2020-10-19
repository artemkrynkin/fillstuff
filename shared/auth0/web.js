const IS_PROD = process.env.NODE_ENV === 'production';

const DEV_CONFIG = {
	clientId: '4pmdOXEv0seOwvHscw6vUE8VnzQESUWA',
	domain: 'keeberinkdev.eu.auth0.com',
	audience: 'https://blikside.com/api',
	redirectUri: 'http://localhost:3001/login/callback',
};

const PRODUCTION_CONFIG = {
	clientId: '4pmdOXEv0seOwvHscw6vUE8VnzQESUWA',
	domain: 'keeberinkdev.eu.auth0.com',
	audience: 'https://blikside.com/api',
	redirectUri: 'https://blikside.com/login/callback',
};

export const config = IS_PROD ? PRODUCTION_CONFIG : DEV_CONFIG;
