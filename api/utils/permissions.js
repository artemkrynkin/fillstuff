import cookie from 'cookie';
import cookieParser from 'cookie-parser';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import axios from 'axios';

import { sessionStore } from 'shared/middlewares/session';
import { config } from 'shared/auth0/api';

import User from 'api/models/user';

const IS_PROD = process.env.NODE_ENV === 'production';
const ACCOUNT_SERVER_URL = IS_PROD ? 'https://account.keeberink.com' : 'http://localhost:3003';

export const isAuthed = jwt({
	secret: jwksRsa.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 10,
		jwksUri: `${config.issuer}.well-known/jwks.json`,
	}),
	audience: 'https://keeberink-api',
	issuer: config.issuer,
	algorithms: ['RS256'],
	getToken: req => {
		if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
			return req.headers.authorization.split(' ')[1];
		} else if (req.cookies?.['session.token']) {
			return req.cookies['session.token'];
		}

		return null;
	},
});

export const isAuthedResolverSocket = async (socket, next) => {
	socket.handshake.cookies = cookie.parse(socket.request.headers.cookie || '');
	const sidCookie = socket.handshake.cookies.session;
	const sid = cookieParser.signedCookie(sidCookie, 'secrettest');

	const session = await sessionStore.get(sid, (err, session) => {
		if (err) return null;

		session.id = sid;
	});

	if (!session) return next({ code: 3 });

	socket.handshake.session = session;

	if (!session.passport.user) return next({ code: 3 });

	const user = await User.findById(session.passport.user, { salt: false, hashedPassword: false })
		.then(user => user)
		.catch(() => null);

	socket.handshake.user = user;

	if (!user) return next({ code: 3 });

	next();
};

export const hasPermissions = async (req, res, next, accessRightList) => {
	try {
		const memberId = req.body.memberId || req.query.memberId;

		await axios.post(
			`${ACCOUNT_SERVER_URL}/api/hasPermissions`,
			{
				memberId,
				accessRightList,
			},
			{
				headers: req.headers,
			}
		);

		next();
	} catch (err) {
		next(err.response.data);
	}
};
