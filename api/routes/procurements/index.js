import { Router } from 'express';

import { receiptCalc } from 'shared/checkPositionAndReceipt';

import { isAuthedResolver, hasPermissionsInStock } from 'api/utils/permissions';

import Stock from 'api/models/stock';
import Position from 'api/models/position';
import Receipt from 'api/models/receipt';
import Procurement from 'api/models/procurement';
import validator from 'validator';
import i18n from 'i18n';

const procurementsRouter = Router();

// const debug = require('debug')('api:products');

procurementsRouter.get(
	'/procurements',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	async (req, res, next) => {
		const { stockId, number, dateStart, dateEnd, position, role } = req.query;

		let conditions = {
			stock: stockId,
		};

		if (number) conditions.number = { $regex: number, $options: 'i' };
		if (dateStart && dateEnd) {
			conditions.createdAt = {
				$gte: new Date(Number(dateStart)),
				$lte: new Date(Number(dateEnd)),
			};
		}

		const procurementsPromise = Procurement.paginate(conditions, {
			sort: { createdAt: -1 },
			populate: [
				{
					path: 'stock',
					select: 'members',
				},
				{
					path: 'user',
					select: 'profilePhoto name email',
				},
				{
					path: 'receipts',
					populate: {
						path: 'position',
						populate: {
							path: 'characteristics',
						},
					},
				},
			],
			pagination: false,
			customLabels: {
				docs: 'data',
				meta: 'paging',
			},
		}).catch(err => next({ code: 2, err }));
		const procurementsCountPromise = Procurement.estimatedDocumentCount();

		const procurements = await procurementsPromise;
		const procurementsCount = await procurementsCountPromise;

		if (position && position !== 'all') {
			procurements.data = procurements.data.filter(procurement =>
				procurement.receipts.some(receipt => String(receipt.position._id) === position)
			);
		}

		switch (role) {
			case 'owners':
				procurements.data = procurements.data.filter(procurement => {
					return procurement.stock.members.some(member => String(member.user) === String(procurement.user._id) && member.role === 'owner');
				});
				break;
			case 'admins':
				procurements.data = procurements.data.filter(procurement => {
					return procurement.stock.members.some(member => String(member.user) === String(procurement.user._id) && member.role === 'admin');
				});
				break;
			default:
				if (role && role !== 'all') {
					procurements.data = procurements.data.filter(procurement => String(procurement.user._id) === role);
				}
				break;
		}

		procurements.data.forEach(procurement => procurement.depopulate('stock'));

		res.json({
			data: procurements.data,
			paging: {
				totalCount: procurementsCount,
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

		if (!newProcurementValues.noInvoice && (!newProcurementValues.number || !newProcurementValues.date)) {
			const customErr = [];
			const error = fieldName => ({
				field: fieldName,
				message: i18n.__('Обязательное поле'),
			});

			if (!newProcurementValues.number) customErr.push(error('number'));
			if (!newProcurementValues.date) customErr.push(error('number'));

			return next({ code: 5, customErr: customErr });
		}

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
			});

			receiptCalc.quantity(newReceipt, {
				unitReceipt: position.unitReceipt,
				unitIssue: position.unitIssue,
			});

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
						procurement.receipts.reduce((sum, receipt) => {
							return sum + receipt.initial.quantity * receipt.unitPurchasePrice;
						}, 0),
				},
			},
			{ runValidators: true }
		).catch(err => next({ code: 2, err }));

		procurement.depopulate('stock');

		res.json(procurement);
	}
);

export default procurementsRouter;
