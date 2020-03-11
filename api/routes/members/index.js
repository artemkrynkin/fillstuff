import { Router } from 'express';

import { isAuthedResolver, hasPermissions } from 'api/utils/permissions';

import { memberRoleTransform } from 'shared/roles-access-rights';

import mongoose from 'mongoose';
import User from 'api/models/member';
import Studio from 'api/models/studio';
import Member from 'api/models/member';

const membersRouter = Router();

// const debug = require('debug')('api:products');

membersRouter.post(
	'/getMembers',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			studioId,
			query: { name, role },
		} = req.body;

		let conditions = {
			studio: studioId,
			confirmed: true,
		};

		if (role && !/all|owners|admins|artists/.test(role)) conditions._id = mongoose.Types.ObjectId(role);

		const membersPromise = Member.find(conditions)
			.lean()
			.populate('user', 'avatar name email')
			.catch(err => next({ code: 2, err }));

		const members = await membersPromise;

		let membersTransform = members
			.map(member => ({
				...member,
				roleBitMask: memberRoleTransform(member.roles, true),
			}))
			.sort((memberA, memberB) => +memberB.roleBitMask - +memberA.roleBitMask || memberA.user.name.localeCompare(memberB.user.name));

		if (role && /owners|admins|artists/.test(role)) {
			const roleFilter = role.slice(0, -1);

			membersTransform = membersTransform.filter(member => member.roles.some(role => role.includes(roleFilter)));
		}

		if (name) {
			membersTransform = membersTransform.filter(member => member.user.name.toLowerCase().indexOf(name.toLowerCase()) !== -1);
		}

		res.json(membersTransform);
	}
);

membersRouter.post(
	'/getMember',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			params: { memberId },
		} = req.body;

		Member.findById(memberId)
			.populate('user', 'avatar name email')
			.then(member => res.json(member))
			.catch(err => next({ code: 2, err }));
	}
);

membersRouter.post(
	'/invitationMember',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['studio.control']),
	async (req, res, next) => {
		const { studioId } = req.body;

		const newMember = new Member({
			studio: studioId,
		});

		const newMemberErr = newMember.validateSync();

		if (newMemberErr) return next({ code: newMemberErr.errors ? 5 : 2, err: newMemberErr });

		const member = await newMember.save();

		Studio.findByIdAndUpdate(studioId, { $push: { members: newMember } }).catch(err => next({ code: 2, err }));

		Member.populate(member, { path: 'user', select: 'avatar name email' })
			.then(member => res.json(member))
			.catch(err => next({ code: 2, err }));
	}
);

membersRouter.post('/confirmInvitationMember', async (req, res, next) => {
	const { studioId, memberId } = req.body;

	const newUser = new User({
		activeStudio: studioId,
		activeMember: memberId,
	});

	const newUserErr = newUser.validateSync();

	if (newUserErr) return next({ code: newUserErr.errors ? 5 : 2, err: newUserErr });

	const user = await newUserErr.save();

	Member.findByIdAndUpdate(memberId, { $set: { user: user._id } }).catch(err => next({ code: 2, err }));
	Studio.findByIdAndUpdate(studioId, { $push: { users: newUser } }).catch(err => next({ code: 2, err }));

	User.findById(user._id, { salt: false, hashedPassword: false })
		.then(user => {
			// return res.json({
			//   userId: user._id,
			//   stockId: stock._id,
			//   role: member.role,
			// });
		})
		.catch(err => next(err));
});

membersRouter.post(
	'/editMember',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['studio.control']),
	async (req, res, next) => {
		const {
			params: { memberId },
			data: { member: memberEdited },
		} = req.body;

		let setMemberData = memberEdited;

		if (/owner|admin/.test(setMemberData.roles) && !/artist/.test(setMemberData.roles)) {
			setMemberData.purchaseExpenseStudio = true;
			setMemberData.markupPosition = false;
		}

		const member = await Member.findByIdAndUpdate(memberId, { $set: setMemberData }, { new: true, runValidators: true })
			.populate('user', 'avatar name email')
			.catch(err => next({ code: 2, err }));

		res.json(member);
	}
);

export default membersRouter;
