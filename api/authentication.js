import passport from 'passport';

import i18n from 'i18n';

import User, { UserSchema } from 'api/models/user';

const { Strategy: LocalStrategy } = require('passport-local');

const isSerializedJSON = str => str[0] === '{' && str[str.length - 1] === '}';

// const debug = require('debug')('api:auth');

const init = () => {
	// Setup use serialization
	passport.serializeUser((user, done) => {
		done(null, typeof user === 'string' ? user : JSON.stringify(user));
	});

	// NOTE: `data` used to be just the userID, but is now the full user data
	// to avoid having to go to the db on every single request.
	passport.deserializeUser((data, done) => {
		let user;

		if (isSerializedJSON(data)) {
			// Ignore errors if our isSerializedJSON heuristic is wrong and `data` isn't serialized JSON
			try {
				user = JSON.parse(data);
			} catch (err) {}
		}

		// Fast path: we got the full user data in the cookie
		if (user && user._id && user.createdAt) {
			return done(null, user);
		}

		// Slow path: data is just the userID (legacy), so we have to go to the db to get the full data
		return User.findOne({ _id: user._id }, { salt: false, hashedPassword: false })
			.then(user => done(null, user))
			.catch(err => done(err));
	});

	// Set up local login
	passport.use(
		new LocalStrategy(
			{
				usernameField: 'email',
				passwordField: 'password',
				passReqToCallback: true,
			},
			function(req, username, password, done) {
				User.findOne({ email: username })
					.then(user => {
						if (!user || !user.checkPassword(password)) {
							return done({
								code: 5,
								customErr: [
									{
										field: 'unknown',
										message: i18n.__('Email or password is incorrect'),
									},
								],
							});
						}

						return user
							.execPopulate()
							.then(() => {
								if (user.invitationCode) {
									User.findByIdAndUpdate(
										user._id,
										{
											$set: { hasPassword: false },
											$unset: {
												hashedPassword: user.hashedPassword,
												salt: user.salt,
												passwordUpdate: user.passwordUpdate,
												invitationCode: user.invitationCode,
											},
										},
										{ new: true, fields: { salt: false, hashedPassword: false } }
									)
										.then(user => done(null, user))
										.catch(err => done(err));
								} else {
									UserSchema.options.toObject.deleteConfidentialData = true;

									done(null, user.toObject());
								}
							})
							.catch(err => done(err));
					})
					.catch(err => done(err));
			}
		)
	);
};

export { init };
