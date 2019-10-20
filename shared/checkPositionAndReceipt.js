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
