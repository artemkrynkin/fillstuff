import { Router } from 'express';

import { isAuthedResolver, hasPermissions } from 'api/utils/permissions';

import Position from 'api/models/position';
import PositionGroup from 'api/models/positionGroup';

const positionGroupsRouter = Router();

// const debug = require('debug')('api:products');

positionGroupsRouter.post(
	'/getPositionGroup',
	// isAuthedResolver,
	// (req, res, next) => hasPermissions(req, res, next, ['products.control']),
	(req, res, next) => {
		const {
			params: { positionGroupId },
		} = req.body;

		PositionGroup.findById(positionGroupId)
			.populate({
				path: 'positions',
				populate: {
					path: 'activeReceipt characteristics',
				},
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
						divided: newPositionGroup.dividedPositions,
					},
				}
			),
		]);

		PositionGroup.findById(newPositionGroup._id)
			.populate({
				path: 'positions',
				populate: {
					path: 'activeReceipt characteristics',
				},
			})
			.populate({
				path: 'positions',
				populate: {
					path: 'receipts',
					match: { status: /received|active/ },
				},
			})
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
		positionGroup.dividedPositions = positionGroupEdited.dividedPositions;
		positionGroup.minimumBalance = positionGroupEdited.minimumBalance;

		const positionGroupErr = positionGroup.validateSync();

		if (positionGroupErr) return next({ code: positionGroupErr.errors ? 5 : 2, err: positionGroupErr });

		await Promise.all([
			positionGroup.save(),
			Position.updateMany(
				{ _id: { $in: positionGroup.positions } },
				{
					$set: {
						divided: positionGroup.dividedPositions,
					},
				}
			),
		]);

		PositionGroup.findById(positionGroup._id)
			.populate({
				path: 'positions',
				populate: {
					path: 'activeReceipt characteristics',
				},
			})
			.populate({
				path: 'positions',
				populate: {
					path: 'receipts',
					match: { status: /received|active/ },
				},
			})
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
					divided: positionGroup.dividedPositions,
				},
			}
		).catch(err => next({ code: 2, err }));

		PositionGroup.findById(positionGroup._id)
			.populate({
				path: 'positions',
				populate: {
					path: 'activeReceipt characteristics',
				},
			})
			.populate({
				path: 'positions',
				populate: {
					path: 'receipts',
					match: { status: /received|active/ },
				},
			})
			.then(positionGroup => res.json(positionGroup))
			.catch(err => next({ code: 2, err }));
	}
);

export default positionGroupsRouter;
