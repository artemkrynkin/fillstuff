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

		const positionsUpdate = [];

		const positions = await Position.find({ _id: { $in: newPositionGroupValues.positions }, studio: studioId }).catch(err =>
			next({ code: 2, err })
		);

		positions.forEach(position => {
			positionsUpdate.push(position._id);

			if (position.childPosition) positionsUpdate.push(position.childPosition);
		});

		const newPositionGroup = new PositionGroup({
			...newPositionGroupValues,
			studio: studioId,
			positions: positionsUpdate,
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
			studioId,
			params: { positionGroupId },
			data: { positions: positionsEdited },
		} = req.body;

		const positionsUpdate = [];

		const positions = await Position.find({ _id: { $in: positionsEdited }, studio: studioId }).catch(err => next({ code: 2, err }));

		positions.forEach(position => {
			positionsUpdate.push(position._id);

			if (position.parentPosition) positionsUpdate.push(position.parentPosition);
			if (position.childPosition) positionsUpdate.push(position.childPosition);
		});

		await PositionGroup.findByIdAndUpdate(positionGroupId, { $push: { positions: { $each: positionsUpdate } } }).catch(err =>
			next({ code: 2, err })
		);

		Position.updateMany({ _id: { $in: positionsUpdate } }, { $set: { positionGroup: positionGroupId } }).catch(err =>
			next({ code: 2, err })
		);

		res.json({
			_id: positionGroupId,
			positions: positionsUpdate,
		});
	}
);

positionGroupsRouter.post(
	'/removePositionFromGroup',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			params: { positionId },
		} = req.body;

		const position = await Position.findById(positionId)
			.populate('positionGroup')
			.catch(err => next({ code: 2, err }));

		const positionsUpdate = [position._id];

		if (position.parentPosition) positionsUpdate.push(position.parentPosition);
		if (position.childPosition) positionsUpdate.push(position.childPosition);

		Position.updateMany({ _id: { $in: positionsUpdate } }, { $unset: { positionGroup: 1 } }).catch(err => next({ code: 2, err }));

		if (position.positionGroup.positions.length > positionsUpdate.length) {
			PositionGroup.findByIdAndUpdate(position.positionGroup._id, { $pull: { positions: { $in: positionsUpdate } } }).catch(err =>
				next({ code: 2, err })
			);
		} else {
			PositionGroup.findByIdAndRemove(position.positionGroup._id).catch(err => next({ code: 2, err }));
		}

		res.json({
			_id: position.positionGroup._id,
			positions: positionsUpdate,
		});
	}
);

export default positionGroupsRouter;
