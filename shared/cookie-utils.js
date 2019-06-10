import jwt from 'jsonwebtoken';
import Keygrip from 'keygrip';

export const cookieKeygrip = new Keygrip(['secrettest']);

export const getCookies = ({ userId }) => {
	// The value of our "session" cookie
	const session = new Buffer(JSON.stringify({ passport: { user: userId } })).toString('base64');
	// The value of our "session.sig" cookie
	const sessionSig = cookieKeygrip.sign(`session=${session}`);

	return {
		session,
		'session.sig': sessionSig,
	};
};

export const signCookie = cookie => {
	return jwt.sign({ cookie }, process.env.API_TOKEN_SECRET, {
		expiresIn: '25y',
	});
};
