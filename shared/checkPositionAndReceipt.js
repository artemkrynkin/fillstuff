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

				return Number(unitCostDelivery.toFixed(2));
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

				return Number(unitCostDelivery.toFixed(2));
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

			return Number(unitCostDelivery.toFixed(2));
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

			return Number(unitCostDelivery.toFixed(2));
		},
	},
};

export const recountReceipt = ({ unitReceipt, unitIssue }, isFree, receipt, recountQuantity = true) => {
	if (recountQuantity && !isNaN(receipt.initial.quantityPackages)) receipt.current.quantityPackages = receipt.initial.quantityPackages;

	/**
	 * Считаем "количество"
	 *
	 * количество = количество упаковок * количество штук в упаковке
	 */
	if (
		recountQuantity &&
		!isNaN(receipt.initial.quantityPackages) &&
		!isNaN(receipt.quantityInUnit) &&
		unitReceipt === 'nmp' &&
		unitIssue === 'pce'
	) {
		receipt.initial.quantity = receipt.initial.quantityPackages * receipt.quantityInUnit;
	}
	if (recountQuantity && !isNaN(receipt.initial.quantity)) {
		receipt.current.quantity = receipt.initial.quantity;
	}

	/**
	 * Считаем "цену покупки единицы"
	 *
	 * если "единица поступления" === упаковки и "единица отпуска" === штуки
	 * то:
	 * цена покупки единицы = цена покупки / количество штук в упаковке
	 *
	 * иначе:
	 * цена покупки единицы = цена покупки
	 */
	if (!isNaN(receipt.purchasePrice) && !isNaN(receipt.quantityInUnit) && unitReceipt === 'nmp' && unitIssue === 'pce') {
		receipt.unitPurchasePrice = receipt.purchasePrice / receipt.quantityInUnit;
	} else {
		if (!isNaN(receipt.purchasePrice)) {
			receipt.unitPurchasePrice = receipt.purchasePrice;
		}
	}

	/**
	 * Считаем "цену продажи" и "цену продажи единицы"
	 *
	 * если "единица поступления" === упаковки и "единица отпуска" === штуки
	 * то:
	 * цена продажи = количество единиц * цена продажи единицы
	 *
	 * иначе:
	 * цена продажи единицы = цена продажи
	 */
	if (receipt.quantityInUnit !== undefined && receipt.unitSellingPrice !== undefined && unitReceipt === 'nmp' && unitIssue === 'pce') {
		receipt.sellingPrice = receipt.quantityInUnit * receipt.unitSellingPrice;
	} else {
		if (receipt.sellingPrice !== undefined) {
			receipt.unitSellingPrice = receipt.sellingPrice;
		}
	}
};
