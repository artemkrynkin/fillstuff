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

export const UnitCostDeliveryCalc = {
	mixed: {
		/**
		 * Расчет стоимости доставки единицы позиции с НЕ нулевой ценой закупки в смешанной закупке
		 *
		 * @param {number} uPP - Цена закпки единицы (unit Purchase Price)
		 * @param {number} TPP - Общая стоимость закупки (Total Purchase Price)
		 * @param {number} CD - Стоимость доставки (Cost Delivery)
		 * @param {number} NAp - Количество всех позиций (Number All positions)
		 * @param {number} NPp - Количество платных позиций (Number Paid positions)
		 *
		 * @const {number} uCD_p - Стоимость доставки единицы в процентах (unit Cost Delivery percent)
		 * @return {number} uCD - Стоимость доставки единицы (unit Cost Delivery)
		 */
		paid: (uPP, TPP, CD, NAp, NPp) => {
			const uCD_p = (uPP / TPP) * ((100 * NPp) / NAp);

			const uCD = (CD / 100) * uCD_p;

			return Number(uCD.toFixed(2));
		},
		/**
		 * Расчет стоимости доставки единицы позиции с нулевой ценой закупки в смешанной закупке
		 *
		 * @param {number} CD - Стоимость доставки (Cost Delivery)
		 * @param {array} ACDPp - Массив со стоимостями доставки платных позиций (Array Cost Delivery Paid positions)
		 * @param {number} NZp - Количество позиций с нулевой стоимостью закупки (Number Zero positions)
		 *
		 * @return {number} uCD - Стоимость доставки единицы (unit Cost Delivery)
		 */
		zero: (CD, ACDPp, NZp) => {
			const uCD =
				(CD -
					ACDPp.reduce((sum, receipt) => {
						return sum + receipt.costDelivery * receipt.quantity;
					}, 0)) /
				NZp;

			return Number(uCD.toFixed(2));
		},
	},
	/**
	 * Расчет стоимости доставки единицы позиции
	 *
	 * @param {number} uPP - Цена закупки единицы (unit Purchase Price)
	 * @param {number} TPP - Общая стоимость закупки (Total Purchase Price)
	 * @param {number} CD - Стоимость доставки (Cost Delivery)
	 *
	 * @const {number} uCD_p - Стоимость доставки единицы в процентах (unit Cost Delivery percent)
	 * @return {number} uCD - Стоимость доставки единицы (unit Cost Delivery)
	 */
	paid: (uPP, TPP, CD) => {
		const uCD_p = (uPP / TPP) * 100;

		const uCD = (CD / 100) * uCD_p;

		return Number(uCD.toFixed(2));
	},
	/**
	 * Расчет стоимости доставки единицы позиции
	 *
	 * @param {number} uPP - Цена закупки единицы (unit Purchase Price)
	 * @param {number} TPPsp - Общая стоимость закупки продаваемых позиций (Total Purchase Price selling positions)
	 * @param {number} CD - Стоимость доставки (Cost Delivery)
	 *
	 * @const {number} uCD_p - Стоимость доставки единицы в процентах (unit Cost Delivery percent)
	 * @return {number} uCD - Стоимость доставки единицы (unit Cost Delivery)
	 */
	selling: (uPP, TPPsp, CD) => {
		const uCD_p = (uPP / TPPsp) * 100;

		const uCD = (CD / 100) * uCD_p;

		return Number(uCD.toFixed(2));
	},
	/**
	 * Расчет стоимости доставки единицы позиции с нулевой суммой в закупке
	 *
	 * @param {number} CD - Стоимость доставки (Cost Delivery)
	 * @param {number} NAp - Количество всех позиций (Number All positions)
	 *
	 * @return {number} uCD - Стоимость доставки единицы (unit Cost Delivery)
	 */
	zeroTotalPrice: (CD, NAp) => {
		const uCD = CD / NAp;

		return Number(uCD.toFixed(2));
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
