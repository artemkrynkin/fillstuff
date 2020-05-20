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
			.populate({
				path: 'positions',
				options: {
					sort: { name: 1 },
				},
				populate: [
					{
						path: 'activeReceipt characteristics shops.shop',
					},
					{
						path: 'receipts',
						match: { status: /received|active/ },
						options: {
							sort: { createdAt: 1 },
						},
					},
				],
			})
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
			params: { positionGroupId },
		} = req.body;

		PositionGroup.findById(positionGroupId)
			.populate({
				path: 'positions',
				options: {
					sort: { name: 1 },
				},
				populate: {
					path: 'activeReceipt characteristics shops.shop',
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
					},
				}
			),
		]);

		PositionGroup.findById(newPositionGroup._id)
			.populate({
				path: 'positions',
				options: {
					sort: { name: 1 },
				},
				populate: [
					{
						path: 'activeReceipt characteristics shops.shop',
					},
					{
						path: 'receipts',
						match: { status: /received|active/ },
						options: {
							sort: { createdAt: 1 },
						},
					},
				],
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

		const positionGroupErr = positionGroup.validateSync();

		if (positionGroupErr) return next({ code: positionGroupErr.errors ? 5 : 2, err: positionGroupErr });

		await Promise.all([positionGroup.save()]);

		PositionGroup.findById(positionGroup._id)
			.populate({
				path: 'positions',
				options: {
					sort: { name: 1 },
				},
				populate: [
					{
						path: 'activeReceipt characteristics shops.shop',
					},
					{
						path: 'receipts',
						match: { status: /received|active/ },
						options: {
							sort: { createdAt: 1 },
						},
					},
				],
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
				},
			}
		).catch(err => next({ code: 2, err }));

		PositionGroup.findById(positionGroup._id)
			.populate({
				path: 'positions',
				options: {
					sort: { name: 1 },
				},
				populate: [
					{
						path: 'activeReceipt characteristics shops.shop',
					},
					{
						path: 'receipts',
						match: { status: /received|active/ },
						options: {
							sort: { createdAt: 1 },
						},
					},
				],
			})
			.then(positionGroup => res.json(positionGroup))
			.catch(err => next({ code: 2, err }));
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

		Position.findByIdAndUpdate(position._id, {
			$unset: { positionGroup: 1 },
		}).catch(err => next({ code: 2, err }));

		if (position.positionGroup.positions.length > 1) {
			PositionGroup.findByIdAndUpdate(position.positionGroup._id, { $pull: { positions: position._id } }).catch(err =>
				next({ code: 2, err })
			);
		} else {
			PositionGroup.findByIdAndRemove(position.positionGroup._id, { $pull: { positions: position._id } }).catch(err =>
				next({ code: 2, err })
			);
		}

		res.json();
	}
);

export default positionGroupsRouter;
