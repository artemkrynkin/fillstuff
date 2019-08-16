import { Router } from 'express';

import { isAuthedResolver, hasPermissionsInStock } from 'api/utils/permissions';

import Stock from 'api/models/stock';
import Product from 'api/models/product';
import Marker from 'api/models/marker';
import WriteOff from 'api/models/writeOff';

const writeOffsRouter = Router();

// const debug = require('debug')('api:writeOffs');

writeOffsRouter.get(
	'/write-offs',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	(req, res, next) => {
		const { stockId, markerId, userId } = req.query;

		const conditions = { stock: stockId };

		if (markerId) conditions.marker = markerId;
		if (userId) conditions.user = userId;

		WriteOff.find(conditions)
			.populate({
				path: 'marker',
				populate: {
					path: 'product mainCharacteristic',
					select: 'createdAt name label type value',
				},
				select: 'product mainCharacteristic',
			})
			.populate('user', 'name email')
			.sort({ createdAt: -1 })
			.then(writeOffs => res.json(writeOffs))
			.catch(err => next(err));
	}
);

writeOffsRouter.post(
	'/write-offs/marker',
	// isAuthedResolver,
	// (req, res, next) => hasPermissionsInStock(req, res, next, ['products.scanning']),
	(req, res, next) => {
		const { stockId, markerId, userId, quantity = req.body.quantity || 1 } = req.body;

		return Marker.findById(markerId)
			.populate('stock product')
			.then(async marker => {
				if (marker.quantity === 0 || marker.quantity - quantity < 0)
					return res.json({
						code: 7,
						message:
							marker.quantity === 0
								? 'Маркер отсутствует на складе'
								: marker.quantity - quantity < 0
								? 'Вы пытаетесь списать количество большее, чем есть на складе'
								: 'Unknown error',
					});

				const {
					stock: { status: statusOld },
					product: { quantity: productQuantityOld },
				} = marker;

				await Stock.findByIdAndUpdate(
					stockId,
					{
						$set: {
							'status.stockCost': statusOld.stockCost - quantity * marker.unitPurchasePrice,
						},
					},
					{ runValidators: true }
				).catch(err => next({ code: 2, err }));

				if (!marker.product.dividedMarkers) {
					await Product.findByIdAndUpdate(
						marker.product,
						{
							$set: {
								quantity: productQuantityOld - quantity,
							},
						},
						{ runValidators: true }
					).catch(err => next({ code: 2, err }));
				}

				if (marker.product.receiptUnits === 'nmp' && marker.product.unitIssue === 'pce') {
					marker.quantityPackages = (marker.quantity - quantity) / marker.quantityInUnit;
				}
				marker.quantity -= quantity;

				await marker.save();

				let writeOffObj = {
					stock: stockId,
					marker: markerId,
					user: userId,
					quantity: quantity,
					unitPurchasePrice: marker.unitPurchasePrice,
				};

				if (!marker.isFree) writeOffObj.unitSellingPrice = marker.unitSellingPrice;

				const writeOff = new WriteOff(writeOffObj);

				writeOff
					.save()
					.then(async writeOff => {
						await writeOff.populate({ path: 'marker', populate: { path: 'mainCharacteristic characteristics' } }).execPopulate();

						return res.json(writeOff.marker);
					})
					.catch(err => next({ code: 2, err }));
			})
			.catch(err => next(err));
	}
);

export default writeOffsRouter;
