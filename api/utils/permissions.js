import cookie from 'cookie';
import cookieParser from 'cookie-parser';

import { checkPermissions } from 'shared/roles-access-rights';

import { sessionStore } from 'shared/middlewares/session';

import User from 'api/models/user';
import Member from 'api/models/member';

export const isAuthedResolver = (req, res, next) => {
	if (!req.isAuthenticated()) return next({ code: 3 });

	next();
};

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

export const hasPermissions = async (req, res, next, accessRightList, skipCheck = false) => {
	if (!skipCheck) {
		const memberId = req.body.memberId || req.query.memberId;

		if (!memberId) {
			return next({
				code: 6,
				message: 'missing "memberId" parameter',
			});
		}

		await Member.findById(memberId)
			.then(member => {
				if (!checkPermissions(member.roles, accessRightList)) return next({ code: 4 });
			})
			.catch(err => next({ code: 2, err }));
	}

	next();
};
