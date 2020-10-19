import { Router } from 'express';
import i18n from 'i18n';

import { auth0client, auth0management } from 'api/utils/auth';

import User from 'api/models/user';

const router = Router();

router.post('/signup', async (req, res, next) => {
	const { email, name, password } = req.body;

	const auth0user = await auth0client.database
		.signUp({
			email,
			name,
			password,
			connection: 'Username-Password-Authentication',
		})
		.catch(err => JSON.parse(err.message));

	if (auth0user.code) {
		return auth0management
			.getUsersByEmail(email)
			.then(users => {
				if (users.length) return next({ code: 6, message: i18n.__('User with this email is already registered') });
				else return next({ code: 2, auth0user });
			})
			.catch(err => next({ code: 2, err }));
	}

	const newUser = new User({
		auth0uid: `auth0|${auth0user._id}`,
		name: auth0user.name,
	});

	const newUserErr = newUser.validateSync();

	if (newUserErr) return next({ code: newUserErr.errors ? 5 : 2, err: newUserErr });

	await newUser.save();

	res.json();
});

export default router;
