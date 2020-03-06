import { Router } from 'express';
import i18n from 'i18n';

import { receiptCalc } from 'shared/checkPositionAndReceipt';

import { isAuthedResolver, hasPermissions } from 'api/utils/permissions';

import mongoose from 'mongoose';
import Studio from 'api/models/studio';
import Position from 'api/models/position';
import Receipt from 'api/models/receipt';
import Procurement from 'api/models/procurement';

const procurementsRouter = Router();

// const debug = require('debug')('api:products');

procurementsRouter.post(
	'/getProcurements',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			studioId,
			query: { page, limit, dateStart, dateEnd, number, position, role },
		} = req.body;

		let conditions = {
			studio: studioId,
		};

		if (dateStart && dateEnd) {
			conditions.createdAt = {
				$gte: new Date(Number(dateStart)),
				$lte: new Date(Number(dateEnd)),
			};
		}

		if (number) conditions.number = { $regex: number, $options: 'i' };

		if (role && role !== 'all') conditions.member = mongoose.Types.ObjectId(role);

		if (position && position !== 'all') conditions.positions = mongoose.Types.ObjectId(position);

		const procurementsPromise = Procurement.paginate(conditions, {
			sort: { createdAt: -1 },
			lean: true,
			populate: [
				{
					path: 'member',
					select: 'user',
					populate: {
						path: 'user',
						select: 'avatar name email',
					},
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
			page,
			limit,
			customLabels: {
				docs: 'data',
				meta: 'paging',
			},
		}).catch(err => next({ code: 2, err }));
		const procurementsCountPromise = Procurement.countDocuments({ studio: studioId });

		const procurementsResult = await procurementsPromise;
		const procurementsCount = await procurementsCountPromise;

		let { data: procurements, paging } = procurementsResult;

		// if (position && position !== 'all') {
		// 	procurements.data = procurements.data.filter(procurement =>
		// 		procurement.receipts.some(receipt => String(receipt.position._id) === position)
		// 	);
		// }

		res.json({
			data: procurements,
			paging: {
				...paging,
				totalCount: procurementsCount,
			},
		});
	}
);

procurementsRouter.post(
	'/getProcurement',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			params: { procurementId },
		} = req.body;

		Procurement.findById(procurementId)
			.populate({
				path: 'member',
				populate: {
					path: 'user',
					select: 'avatar name email',
				},
			})
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
	'/createProcurement',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			studioId,
			memberId,
			data: { procurement: newProcurementValues },
		} = req.body;

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

		const newProcurement = new Procurement({
			...newProcurementValues,
			positions: [],
			studio: studioId,
			member: memberId,
		});

		newProcurement.receipts = newProcurementValues.receipts.map(receipt => {
			const position = positions.find(position => String(position._id) === receipt.position);

			const newReceipt = new Receipt({
				...receipt,
				procurement: newProcurement._id,
				position: position,
				studio: studioId,
				status: position.activeReceipt && position.activeReceipt.current.quantity !== 0 ? 'received' : 'active',
			});

			receiptCalc.quantity(newReceipt, {
				unitReceipt: position.unitReceipt,
				unitRelease: position.unitRelease,
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

			newProcurement.positions.push(receipt.position);

			return newReceipt;
		});

		const newProcurementErr = newProcurement.validateSync();

		if (newProcurementErr) return next({ code: newProcurementErr.errors ? 5 : 2, err: newProcurementErr });

		await Promise.all([newProcurement.save(), ...updatePositionsAndActiveReceipt, Receipt.insertMany(newProcurement.receipts)]);

		const procurement = await Procurement.findById(newProcurement._id)
			.populate({ path: 'studio', select: 'stock' })
			.populate({
				path: 'member',
				populate: {
					path: 'user',
					select: 'avatar name email',
				},
			})
			.populate({
				path: 'receipts',
				populate: {
					path: 'position',
					populate: {
						path: 'characteristics',
					},
				},
			})
			.catch(err => next({ code: 2, err }));

		const {
			studio: {
				stock: { stockPrice: stockPriceOld },
			},
		} = procurement;

		Studio.findByIdAndUpdate(
			procurement.studio._id,
			{
				$set: {
					'stock.stockPrice':
						stockPriceOld + procurement.receipts.reduce((sum, receipt) => sum + receipt.initial.quantity * receipt.unitPurchasePrice, 0),
				},
			},
			{ runValidators: true }
		).catch(err => next({ code: 2, err }));

		procurement.depopulate('studio');

		res.json(procurement);
	}
);

export default procurementsRouter;
