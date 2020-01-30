import express from 'express';
import i18n from 'i18n';

// import customPassword from 'shared/passwordGenerate';

import User from 'api/models/user';
import Studio from 'api/models/studio';
import Member from 'api/models/member';

const router = express.Router();

router.post('/registration', function(req, res, next) {
	const { email, password } = req.body;

	// customPassword()

	User.findOne({ email })
		.then(async existingUser => {
			const customErr = [];

			if (existingUser || !email) {
				customErr.push({
					field: 'email',
					message: existingUser ? i18n.__('A person with this E-mail already registered') : i18n.__('Обязательное поле'),
				});
			}

			if (customErr.length) {
				return next({
					code: 5,
					customErr,
				});
			}

			const newUser = new User({ email, password });
			const newStudio = new Studio({
				name: 'Склад #1',
				users: [],
				members: [],
			});
			const newMember = new Member({
				role: 'owner',
				confirmed: true,
				deactivated: false,
			});

			newUser.activeStudio = newStudio._id;
			newUser.activeMember = newMember._id;

			newStudio.users.push(newUser._id);
			newStudio.members.push(newMember._id);

			newMember.user = newUser._id;
			newMember.studio = newStudio._id;

			const newUserErr = newUser.validateSync();
			const newStudioErr = newStudio.validateSync();
			const newMemberErr = newMember.validateSync();

			if (newUserErr) return next({ code: newUserErr.errors ? 5 : 2, err: newUserErr });
			if (newStudioErr) return next({ code: newStudioErr.errors ? 5 : 2, err: newStudioErr });
			if (newMemberErr) return next({ code: newMemberErr.errors ? 5 : 2, err: newMemberErr });

			await Promise.all([newUser.save(), newStudio.save(), newMember.save()]);

			User.findById(newUser._id, { salt: false, hashedPassword: false })
				.then(user => {
					req.login(user, () => res.json('success'));
				})
				.catch(err => next(err));
		})
		.catch(err => next(err));
});

export default router;
