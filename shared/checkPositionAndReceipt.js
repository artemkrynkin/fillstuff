import { formatNumber, percentOfNumber } from 'shared/utils';

export const unitTypes = ['pce', 'nmp'];

export const unitTypeTransform = unitType => {
	switch (unitType) {
		case 'pce':
			return 'Штука';
		case 'nmp':
			return 'Упаковка';
		default:
			return 'Unknown unit type';
	}
};

export const characteristicsTypes = ['color', 'diameter', 'manufacturer', 'marking', 'material', 'model', 'size', 'thickness', 'volume'];

export const characteristicTypeTransform = characteristicType => {
	switch (characteristicType) {
		case 'color':
			return 'Цвет';
		case 'diameter':
			return 'Диаметр';
		case 'manufacturer':
			return 'Производитель';
		case 'marking':
			return 'Маркировка';
		case 'material':
			return 'Материал';
		case 'model':
			return 'Модель';
		case 'size':
			return 'Размер';
		case 'thickness':
			return 'Толщина';
		case 'volume':
			return 'Объем';
		default:
			return 'Unknown characteristic type';
	}
};

export const UnitCostDelivery = {
	indicators: receipts => {
		/**
		 * @param pricePositions - Стоимость позиций
		 * @param pricePositionsSelling - Стоимость позиций для продажи
		 * @param positions - Количество позиций для продажи
		 * @param unitsPositions - Количество единиц позиций для продажи
		 * @param unitsPaidPositions - Количество единиц платных позиций для продажи
		 * @param unitsZeroPositions - Количество единиц позиций для продажи с нулевой ценой покупки
		 */
		return receipts.reduce(
			(indicators, receipt) => {
				const quantity = receipt.quantityPackages ? receipt.quantityPackages : receipt.quantity;

				indicators.pricePositions += quantity * receipt.purchasePrice;

				if (!receipt.position.isFree) {
					indicators.pricePositionsSelling += quantity * receipt.purchasePrice;

					indicators.selling.positionsCount += 1;
					indicators.selling.unitsPositionsCount += quantity;

					if (receipt.purchasePrice) indicators.selling.unitsPaidPositionsCount += quantity;
					else indicators.selling.unitsZeroPositionsCount += quantity;
				}

				return indicators;
			},
			{
				pricePositions: 0,
				pricePositionsSelling: 0,
				selling: {
					positionsCount: 0,
					unitsPositionsCount: 0,
					unitsPaidPositionsCount: 0,
					unitsZeroPositionsCount: 0,
				},
			}
		);
	},
	calc: {
		mixed: {
			/**
			 * Расчет стоимости доставки единицы позиции для продажи в смешанной закупке
			 *
			 * @param {number} unitPurchasePrice - Цена покупки единицы
			 * @param {number} pricePositionsSelling - Стоимость позиций для продажи
			 * @param {number} costDelivery - Стоимость доставки
			 * @param {number} unitsPositionsCount - Количество единиц позиций для продажи
			 * @param {number} unitsPaidPositionsCount - Количество единиц платных позиций для продажи
			 *
			 * @return {number} unitCostDelivery - Стоимость доставки единицы
			 */
			paid: ({ unitPurchasePrice, pricePositionsSelling, costDelivery, unitsPositionsCount, unitsPaidPositionsCount }) => {
				const unitCostDeliveryPercent =
					(unitPurchasePrice / pricePositionsSelling) * ((100 * unitsPaidPositionsCount) / unitsPositionsCount);

				const unitCostDelivery = (costDelivery / 100) * unitCostDeliveryPercent;

				return formatNumber(unitCostDelivery);
			},
			/**
			 * Расчет стоимости доставки единицы позиции для продажи с нулевой ценой покупки в смешанной закупке
			 *
			 * @param {number} costDelivery - Стоимость доставки
			 * @param {array} costDeliveryPaidPositions - Массив со стоимостями доставки и количеством единиц платных позиций
			 * @param {number} unitsZeroPositionsCount - Количество единиц позиций для продажи с нулевой ценой покупки
			 *
			 * @return {number} unitCostDelivery - Стоимость доставки единицы
			 */
			zero: ({ costDelivery, costDeliveryPaidPositions, unitsZeroPositionsCount }) => {
				const costDeliveryPaidPositionsSum = costDeliveryPaidPositions.reduce((sum, { costDelivery, quantity }) => {
					return sum + costDelivery * quantity;
				}, 0);

				const unitCostDelivery = (costDelivery - costDeliveryPaidPositionsSum) / unitsZeroPositionsCount;

				return formatNumber(unitCostDelivery);
			},
		},
		/**
		 * Расчет стоимости доставки единицы позиции для продажи
		 *
		 * @param {number} unitPurchasePrice - Цена покупки единицы
		 * @param {number} pricePositionsSelling - Стоимость позиций для продажи
		 * @param {number} costDelivery - Стоимость доставки
		 *
		 * @return {number} unitCostDelivery - Стоимость доставки единицы
		 */
		paid: ({ unitPurchasePrice, pricePositionsSelling, costDelivery }) => {
			const unitCostDeliveryPercent = (unitPurchasePrice / pricePositionsSelling) * 100;

			const unitCostDelivery = (costDelivery / 100) * unitCostDeliveryPercent;

			return formatNumber(unitCostDelivery);
		},
		/**
		 * Расчет стоимости доставки единицы позиции для продажи с нулевым итогом в закупке
		 *
		 * @param {number} costDelivery - Стоимость доставки
		 * @param {number} unitsPositionsCount - Количество единиц позиций для продажи
		 *
		 * @return {number} unitCostDelivery - Стоимость доставки единицы
		 */
		zeroTotalPrice: ({ costDelivery, unitsPositionsCount }) => {
			const unitCostDelivery = costDelivery / unitsPositionsCount;

			return formatNumber(unitCostDelivery);
		},
	},
};

export const receiptCalc = {
	quantity: (receipt, { unitReceipt, unitIssue }) => {
		if (!isNaN(receipt.initial.quantityPackages) && !isNaN(receipt.quantityInUnit) && unitReceipt === 'nmp' && unitIssue === 'pce') {
			receipt.initial.quantity = receipt.initial.quantityPackages * receipt.quantityInUnit;

			receipt.current.quantityPackages = receipt.initial.quantityPackages;
		}

		if (!isNaN(receipt.initial.quantity)) receipt.current.quantity = receipt.initial.quantity;
	},
	unitPurchasePrice: (receipt, { unitReceipt, unitIssue }) => {
		receipt.unitPurchasePrice =
			unitReceipt === 'nmp' && unitIssue === 'pce' ? formatNumber(receipt.purchasePrice / receipt.quantityInUnit) : receipt.purchasePrice;
	},
	sellingPrice: (receipt, { isFree, extraCharge }) => {
		receipt.sellingPrice = 0;
		receipt.unitSellingPrice = 0;

		if (isFree) return;

		receipt.extraCharge = formatNumber(percentOfNumber(receipt.purchasePrice, extraCharge));
		receipt.unitExtraCharge = formatNumber(percentOfNumber(receipt.unitPurchasePrice, extraCharge));

		receipt.sellingPrice = formatNumber(receipt.purchasePrice + receipt.costDelivery + receipt.extraCharge);
		receipt.unitSellingPrice = formatNumber(receipt.unitPurchasePrice + receipt.unitCostDelivery + receipt.unitExtraCharge);
	},
	manualExtraCharge: (receipt, { isFree, unitReceipt, unitIssue }) => {
		receipt.manualExtraCharge = 0;
		receipt.unitManualExtraCharge = 0;

		if (isFree) return;

		if (unitReceipt === 'nmp' && unitIssue === 'pce') {
			const autoGenUnitSellingPrice = formatNumber(receipt.unitPurchasePrice + receipt.unitCostDelivery + receipt.unitExtraCharge);

			if (receipt.unitSellingPrice <= autoGenUnitSellingPrice) return;

			receipt.unitSellingPrice = formatNumber(receipt.unitSellingPrice);

			receipt.unitManualExtraCharge = formatNumber(receipt.unitSellingPrice - autoGenUnitSellingPrice);
			receipt.manualExtraCharge = formatNumber(receipt.unitManualExtraCharge * receipt.quantityInUnit);

			receipt.sellingPrice = formatNumber(autoGenUnitSellingPrice * receipt.quantityInUnit + receipt.manualExtraCharge);
		} else {
			const autoGenSellingPrice = formatNumber(receipt.purchasePrice + receipt.costDelivery + receipt.extraCharge);

			if (receipt.sellingPrice <= autoGenSellingPrice) return;

			receipt.sellingPrice = formatNumber(receipt.sellingPrice);

			receipt.manualExtraCharge = formatNumber(receipt.sellingPrice - autoGenSellingPrice);
			receipt.unitManualExtraCharge = receipt.manualExtraCharge;

			receipt.unitSellingPrice = formatNumber(autoGenSellingPrice + receipt.unitManualExtraCharge);
		}
	},
};
