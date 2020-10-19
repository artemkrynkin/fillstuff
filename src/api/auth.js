import auth0 from 'auth0-js';

import { config } from 'shared/auth0/web';

export const webAuth = new auth0.WebAuth({
	domain: config.domain,
	clientID: config.clientId,
	redirectUri: config.redirectUri,
	audience: config.audience,
	responseType: 'code',
	scope: 'openid profile',
	responseMode: 'query',
});
