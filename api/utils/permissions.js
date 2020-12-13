import cookie from 'cookie';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import axios from 'axios';

// import { sessionStore } from 'shared/middlewares/session';
import { checkPermissions } from 'shared/roles-access-rights';
import { config } from 'shared/auth0/api';

// import User from 'api/models/user';
import Member from 'api/models/member';

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
	const sessionToken = socket.handshake.cookies['session.token'];

	if (!sessionToken) return next({ code: 3 });

	const user = await axios.post(
		`${ACCOUNT_SERVER_URL}/api/getMyAccount`,
		{},
		{
			headers: socket.request.headers,
		}
	);

	// socket.handshake.session = session;

	socket.handshake.user = user;

	if (!user) return next({ code: 3 });

	next();
};

export const hasPermissions = async (req, res, next, accessRightList) => {
	const memberId = req.body.memberId || req.query.memberId;

	if (!memberId) {
		return next({
			code: 6,
			message: 'missing "memberId" parameter',
		});
	}

	const member = await Member.findById(memberId)
		.lean()
		.catch(err => next({ code: 2, err }));

	if (!checkPermissions(member.roles, accessRightList)) return next({ code: 4 });

	next();
};
