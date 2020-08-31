import { Router } from 'express';

import { isAuthedResolver, hasPermissions } from 'api/utils/permissions';

import Position from 'api/models/position';
import PositionGroup from 'api/models/positionGroup';

const positionGroupsRouter = Router();

// const debug = require('debug')('api:products');

positionGroupsRouter.post(
	'/getPositionGroups',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const { studioId } = req.body;

		const positionGroupsPromise = PositionGroup.find({ studio: studioId })
			.sort({ name: 1 })
			.catch(err => next({ code: 2, err }));

		const positionGroups = await positionGroupsPromise;

		res.json(positionGroups);
	}
);

positionGroupsRouter.post(
	'/getPositionGroup',
	// isAuthedResolver,
	// (req, res, next) => hasPermissions(req, res, next, ['products.control']),
	(req, res, next) => {
		const {
			params: { positionGroupId, qrcodeId },
		} = req.body;

		const conditions = {};

		if (positionGroupId) conditions._id = positionGroupId;
		if (qrcodeId) conditions.qrcodeId = qrcodeId;

		PositionGroup.findOne(conditions)
			.populate({
				path: 'positions',
				options: {
					sort: { name: 1 },
				},
				populate: [
					{
						path: 'activeReceipt characteristics shops.shop',
					},
				],
			})
			.then(positionGroup => res.json(positionGroup))
			.catch(err => next({ code: 2, err }));
	}
);

positionGroupsRouter.post(
	'/createPositionGroup',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const { studioId, data: newPositionGroupValues } = req.body;

		const newPositionGroup = new PositionGroup({
			...newPositionGroupValues,
			studio: studioId,
		});

		const newPositionGroupErr = newPositionGroup.validateSync();

		if (newPositionGroupErr) return next({ code: newPositionGroupErr.errors ? 5 : 2, err: newPositionGroupErr });

		await Promise.all([
			newPositionGroup.save(),
			Position.updateMany(
				{ _id: { $in: newPositionGroup.positions } },
				{
					$set: {
						positionGroup: newPositionGroup._id,
					},
				}
			),
		]);

		PositionGroup.findById(newPositionGroup._id)
			.then(positionGroup => res.json(positionGroup))
			.catch(err => next({ code: 2, err }));
	}
);

positionGroupsRouter.post(
	'/editPositionGroup',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			params: { positionGroupId },
			data: positionGroupEdited,
		} = req.body;

		const positionGroup = await PositionGroup.findById(positionGroupId)
			.populate({ path: 'markers', match: { isArchived: false } })
			.catch(err => next({ code: 2, err }));

		positionGroup.name = positionGroupEdited.name;

		const positionGroupErr = positionGroup.validateSync();

		if (positionGroupErr) return next({ code: positionGroupErr.errors ? 5 : 2, err: positionGroupErr });

		await Promise.all([positionGroup.save()]);

		PositionGroup.findById(positionGroup._id)
			.then(positionGroup => res.json(positionGroup))
			.catch(err => next({ code: 2, err }));
	}
);

positionGroupsRouter.post(
	'/addPositionInGroup',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			params: { positionGroupId },
			data: { positions },
		} = req.body;

		const positionGroup = await PositionGroup.findByIdAndUpdate(
			positionGroupId,
			{ $push: { positions: { $each: positions } } },
			{ new: true }
		).catch(err => next({ code: 2, err }));

		Position.updateMany(
			{ _id: { $in: positions } },
			{
				$set: {
					positionGroup: positionGroup._id,
				},
			}
		).catch(err => next({ code: 2, err }));

		PositionGroup.findById(positionGroup._id)
			.then(positionGroup => res.json(positionGroup))
			.catch(err => next({ code: 2, err }));
	}
);

export default positionGroupsRouter;
