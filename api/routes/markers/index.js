import { Router } from 'express';

import { isAuthedResolver, hasPermissionsInStock } from 'api/utils/permissions';

import Stock from 'api/models/stock';
import Product from 'api/models/product';
import Marker from 'api/models/marker';

import { checkMarker } from 'shared/checkProductAndMarkers';

const markersRouter = Router();

// const debug = require('debug')('api:products');

markersRouter.put(
	'/markers/:markerId',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	(req, res, next) => {
		return Marker.findById(req.params.markerId)
			.populate('stock product')
			.then(async marker => {
				const markerUpdate = { ...req.body };
				const {
					stock: { status: statusOld },
					product: { quantity: productQuantityOld },
					quantity: quantityOld,
					unitPurchasePrice: unitPurchasePriceOld,
				} = marker;

				await checkMarker(marker.stock._id, marker.product, markerUpdate);

				if (marker.product.receiptUnits === 'nmp' && marker.product.unitIssue === 'pce') {
					marker.quantity = markerUpdate.quantity;
				}

				marker.mainCharacteristic = markerUpdate.mainCharacteristic;
				// marker.quantityPackages = markerUpdate.quantityPackages;
				marker.quantityInUnit = markerUpdate.quantityInUnit;
				marker.minimumBalance = markerUpdate.minimumBalance;
				marker.purchasePrice = markerUpdate.purchasePrice;
				marker.sellingPrice = markerUpdate.sellingPrice;
				marker.unitPurchasePrice = markerUpdate.unitPurchasePrice;
				marker.unitSellingPrice = markerUpdate.unitSellingPrice;
				marker.isFree = markerUpdate.isFree;
				marker.linkInShop = markerUpdate.linkInShop;
				marker.characteristics = markerUpdate.characteristics;

				await marker.save().catch(err => next({ code: err.errors ? 5 : 2, err }));

				await Stock.findByIdAndUpdate(
					marker.stock,
					{
						$set: {
							'status.stockCost': statusOld.stockCost + (marker.quantity * marker.unitPurchasePrice - quantityOld * unitPurchasePriceOld),
						},
					},
					{ runValidators: true }
				).catch(err => next({ code: 2, err }));

				if (!marker.product.dividedMarkers) {
					await Product.findByIdAndUpdate(
						marker.product,
						{
							$set: {
								quantity: productQuantityOld + (marker.quantity - quantityOld),
							},
						},
						{ runValidators: true }
					).catch(err => next({ code: 2, err }));
				}

				await marker.populate('mainCharacteristic characteristics').execPopulate();

				res.json(marker);
			})
			.catch(err => next({ code: err.errors ? 5 : 2, err }));
	}
);

markersRouter.get(
	'/markers/:markerId/archive',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInStock(req, res, next, ['products.control']),
	(req, res, next) => {
		Marker.findByIdAndUpdate(req.params.markerId, { isArchived: true })
			.populate('stock product')
			.then(async marker => {
				const {
					stock: { status: statusOld },
					product: { quantity: productQuantityOld },
				} = marker;

				await Stock.findByIdAndUpdate(
					marker.stock,
					{
						$set: {
							'status.numberMarkers': statusOld.numberMarkers - 1,
							'status.stockCost': statusOld.stockCost - marker.quantity * marker.unitPurchasePrice,
						},
					},
					{ runValidators: true }
				).catch(err => next({ code: 2, err }));

				if (!marker.product.dividedMarkers) {
					await Product.findByIdAndUpdate(
						marker.product,
						{
							$set: {
								'status.stockCost': productQuantityOld - marker.quantity,
							},
						},
						{ runValidators: true }
					).catch(err => next({ code: 2, err }));
				}

				res.json('success');
			})
			.catch(err => next({ code: 2, err }));
	}
);

export default markersRouter;
