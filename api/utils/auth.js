import auth0 from 'auth0';

import { config } from 'shared/auth0/api';

const AuthenticationClient = auth0.AuthenticationClient;
const ManagementClient = auth0.ManagementClient;

export const auth0client = new AuthenticationClient({
	domain: config.domain,
	clientId: config.clientId,
	clientSecret: config.clientSecret,
});

export const auth0management = new ManagementClient({
	token: config.accessToken.token,
	domain: config.domain,
	clientId: config.clientId,
	clientSecret: config.clientSecret,
});
