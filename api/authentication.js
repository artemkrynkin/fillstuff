import passport from 'passport';

import i18n from 'i18n';

import User, { UserSchema } from 'api/models/user';
import Project from 'api/models/project';

const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: VKStrategy } = require('passport-vkontakte');

const IS_PROD = process.env.NODE_ENV === 'production';

const VK_OAUTH_CLIENT_ID = IS_PROD ? '6853589' : '6853589'; //process.env.VK_OAUTH_CLIENT_ID : '6769280';
const VK_OAUTH_CLIENT_SECRET = IS_PROD ? '9BrxK7mu9jT2VXUAZNNn' : '9BrxK7mu9jT2VXUAZNNn'; //process.env.VK_OAUTH_CLIENT_SECRET : 'nZ6HPbiaCJJvsvVpZkG6';

const isSerializedJSON = str => str[0] === '{' && str[str.length - 1] === '}';

const debug = require('debug')('api:auth');

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
		return User.findOne({ _id: user._id }, { salt: false, hashedPassword: false, 'vkProvider.accessToken': false })
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
										{ new: true, fields: { salt: false, hashedPassword: false, 'vkProvider.accessToken': false } }
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

	// Set up VK login
	passport.use(
		new VKStrategy(
			{
				clientID: VK_OAUTH_CLIENT_ID,
				clientSecret: VK_OAUTH_CLIENT_SECRET,
				callbackURL: '/auth/vk/callback',
				profileFields: ['photo_200'],
				apiVersion: '5.92',
				passReqToCallback: true,
			},
			function(req, accessToken, refreshToken, params, profile, done) {
				const name = profile.displayName || profile.name ? `${profile.name.givenName} ${profile.name.familyName}` : '';
				const photo = profile.photos.length ? profile.photos.filter(photo => photo.type === 'photo_200')[0].value : '';

				const user = {
					vkProvider: {
						userId: profile.id,
						name: name,
						photo: photo,
					},
					profilePhoto: photo,
					name: name,
					email: params.email || null,
				};

				if (req.session.connectSocialPages) {
					return User.findByIdAndUpdate(
						req.user._id,
						{
							'vkProvider.accessToken': accessToken,
						},
						{ new: true, fields: { salt: false, hashedPassword: false, 'vkProvider.accessToken': false } }
					)
						.then(user => done(null, user))
						.catch(err => done(err));
				}

				if (req.user) {
					return User.findOne({ 'vkProvider.userId': profile.id })
						.then(existingUser => {
							if (!existingUser) {
								return User.findByIdAndUpdate(
									req.user._id,
									{ 'vkProvider.userId': profile.id },
									{ new: true, fields: { salt: false, hashedPassword: false, 'vkProvider.accessToken': false } }
								)
									.then(user => done(null, user))
									.catch(err => done(err));
							}

							return done(null, req.user, {
								msgDisplay: 'toast',
								msgText: 'Your VK account is already linked to another PosterDate account.',
							});
						})
						.catch(err => done(err));
				}

				return User.findOrCreate({ 'vkProvider.userId': profile.id }, user)
					.then(user => {
						if (user.created) {
							let project = new Project({
								name: 'Проект #1',
								members: [
									{
										user: user.doc._id,
										role: 'owner',
									},
								],
							});

							return project
								.save()
								.then(project => {
									return User.findByIdAndUpdate(
										user.doc._id,
										{ activeProjectId: project },
										{
											new: true,
											fields: {
												salt: false,
												hashedPassword: false,
												'vkProvider.accessToken': false,
											},
										}
									)
										.then(user => done(null, user))
										.catch(err => done(err));
								})
								.catch(err => done(err));
						}

						return user.doc
							.execPopulate()
							.then(() => {
								UserSchema.options.toObject.deleteConfidentialData = true;

								done(null, user.doc.toObject());
							})
							.catch(err => done(err));
					})
					.catch(err => done(err));
			}
		)
	);
};

export { init };
