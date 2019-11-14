import { Router } from 'express';

import { isAuthedResolver, hasPermissionsInStock } from 'api/utils/permissions';

import Position from 'api/models/position';
import PositionGroup from 'api/models/positionGroup';

const positionGroupsRouter = Router();

// const debug = require('debug')('api:products');

positionGroupsRouter.get(
	'/position-groups/:positionGroupId',
	// isAuthedResolver,
	// (req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	(req, res, next) => {
		PositionGroup.findById(req.params.positionGroupId)
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
	'/position-groups',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	async (req, res, next) => {
		const { stockId } = req.query;

		const newPositionGroup = new PositionGroup({
			...req.body,
			stock: stockId,
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

positionGroupsRouter.put(
	'/position-groups/:positionGroupId',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	async (req, res, next) => {
		const positionGroupUpdated = { ...req.body };

		const positionGroup = await PositionGroup.findById(req.params.positionGroupId)
			.populate({ path: 'markers', match: { isArchived: false } })
			.catch(err => next({ code: 2, err }));

		positionGroup.name = positionGroupUpdated.name;
		positionGroup.dividedPositions = positionGroupUpdated.dividedPositions;
		positionGroup.minimumBalance = positionGroupUpdated.minimumBalance;

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
	'/position-groups/:positionGroupId/add-positions',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	async (req, res, next) => {
		const { positions } = req.body;

		const positionGroup = await PositionGroup.findByIdAndUpdate(
			req.params.positionGroupId,
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
