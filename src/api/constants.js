import axios from 'axios';

export const IS_PROD = process.env.NODE_ENV === 'production';

export const SERVER_URL = IS_PROD ? '' : 'http://localhost:3001';

export const CLIENT_URL = IS_PROD ? `${window.location.protocol}//${window.location.host}` : 'http://localhost:3000';

export const ACCOUNT_SERVER_URL = IS_PROD ? 'https://account.keeberink.com' : 'http://localhost:3003';

export const ACCOUNT_CLIENT_URL = IS_PROD ? 'https://account.keeberink.com' : 'http://localhost:3002';

export const axiosFillstuff = axios.create({
	baseURL: SERVER_URL,
	withCredentials: process.env.NODE_ENV === 'development',
});

export const axiosAccount = axios.create({
	baseURL: ACCOUNT_SERVER_URL,
	withCredentials: true,
});
