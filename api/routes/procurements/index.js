import { Router } from 'express';

import { recountReceipt } from 'shared/checkPositionAndReceipt';

import { isAuthedResolver, hasPermissionsInStock } from 'api/utils/permissions';

import Stock from 'api/models/stock';
import Position from 'api/models/position';
import Receipt from 'api/models/receipt';
import Procurement from 'api/models/procurement';

const procurementsRouter = Router();

// const debug = require('debug')('api:products');

procurementsRouter.get(
	'/procurements',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	async (req, res, next) => {
		const { stockId, number, amountFrom, amountTo, role } = req.query;

		let conditions = {
			stock: stockId,
		};

		if (number) conditions.number = { $regex: number, $options: 'i' };
		if (amountFrom && amountTo) {
			conditions.totalPurchasePrice = {
				$gte: amountFrom,
				$lte: amountTo,
			};
		}

		const procurementsPromise = Procurement.find(conditions)
			.populate({ path: 'stock', select: 'members' })
			.populate('user', 'profilePhoto name email')
			.populate({
				path: 'receipts',
				populate: {
					path: 'position',
					populate: {
						path: 'characteristics',
					},
				},
			})
			.sort({ createdAt: -1 })
			.catch(err => next({ code: 2, err }));
		const procurementsCountPromise = Procurement.estimatedDocumentCount();

		let procurements = await procurementsPromise;
		const procurementsCount = await procurementsCountPromise;

		switch (role) {
			case 'owners':
				procurements = procurements.filter(procurement => {
					return procurement.stock.members.some(member => String(member.user) === String(procurement.user._id) && member.role === 'owner');
				});
				break;
			case 'admins':
				procurements = procurements.filter(procurement => {
					return procurement.stock.members.some(member => String(member.user) === String(procurement.user._id) && member.role === 'admin');
				});
				break;
			case 'all':
			default:
				if (role && role !== 'all') {
					procurements = procurements.filter(procurement => String(procurement.user._id) === role);
				}
				break;
		}

		procurements.forEach(procurement => procurement.depopulate('stock'));

		res.json({
			data: procurements,
			paging: {
				limit: 0,
				offset: 0,
				total: procurementsCount,
			},
		});
	}
);

procurementsRouter.get(
	'/procurements/:procurementId',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	async (req, res, next) => {
		Procurement.findById(req.params.procurementId)
			.populate('user', 'profilePhoto name email')
			.populate({
				path: 'receipts',
				populate: {
					path: 'position',
					populate: {
						path: 'characteristics',
					},
				},
			})
			.then(procurement => res.json(procurement))
			.catch(err => next({ code: 2, err }));
	}
);

procurementsRouter.post(
	'/procurements',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	async (req, res, next) => {
		const { stockId } = req.query;
		const { procurement: newProcurementValues } = req.body;

		const positions = await Position.find({ _id: { $in: newProcurementValues.receipts.map(receipt => receipt.position) } })
			.populate({
				path: 'activeReceipt',
			})
			.catch(err => next({ code: 2, err }));

		const updatePositionsAndActiveReceipt = [];

		newProcurementValues.receipts = newProcurementValues.receipts.map(receipt => {
			const position = positions.find(position => String(position._id) === receipt.position);

			const newReceipt = new Receipt({
				...receipt,
				position: position,
				stock: stockId,
				user: req.user._id,
				status: position.activeReceipt && position.activeReceipt.current.quantity !== 0 ? 'received' : 'active',
				comment: `Поступление закупки №${newProcurementValues.number}`,
			});

			recountReceipt({ unitReceipt: position.unitReceipt, unitIssue: position.unitIssue }, position.isFree, newReceipt);

			updatePositionsAndActiveReceipt.push(
				Position.findByIdAndUpdate(position, {
					$set:
						!position.activeReceipt || position.activeReceipt.current.quantity === 0
							? {
									activeReceipt: newReceipt,
							  }
							: {},
					$push: {
						receipts: newReceipt,
					},
				}).catch(err => next({ code: 2, err }))
			);

			if (position.activeReceipt && position.activeReceipt.current.quantity === 0) {
				updatePositionsAndActiveReceipt.push(
					Receipt.findByIdAndUpdate(position.activeReceipt, { $set: { status: 'closed' } }).catch(err => next({ code: 2, err }))
				);
			}

			return newReceipt;
		});

		const newProcurement = new Procurement({
			...newProcurementValues,
			stock: stockId,
			user: req.user._id,
		});

		const newProcurementErr = newProcurement.validateSync();

		if (newProcurementErr) return next({ code: newProcurementErr.errors ? 5 : 2, err: newProcurementErr });

		await Promise.all([newProcurement.save(), ...updatePositionsAndActiveReceipt]);

		await Receipt.insertMany(newProcurement.receipts).catch(err => next({ code: 2, err }));

		const procurement = await Procurement.findById(newProcurement._id)
			.populate({ path: 'stock', select: 'status' })
			.populate('user', 'profilePhoto name email')
			.populate({
				path: 'receipts',
				populate: {
					path: 'position',
				},
			})
			.catch(err => next({ code: 2, err }));

		const {
			stock: { status: statusOld },
		} = procurement;

		Stock.findByIdAndUpdate(
			procurement.stock._id,
			{
				$set: {
					'status.stockPrice':
						statusOld.stockPrice +
						procurement.receipts.reduce((sum, receipt) => sum + receipt.initial.quantity * receipt.unitPurchasePrice, 0),
				},
			},
			{ runValidators: true }
		).catch(err => next({ code: 2, err }));

		procurement.depopulate('stock');

		res.json(procurement);
	}
);

export default procurementsRouter;
