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

export const checkProductAndMarkers = (stockId, product, markers) => {
	return new Promise((resolve, reject) => {
		if (!product.stock) product.stock = stockId;

		product.markers = [];

		markers.forEach(async marker => await checkMarker(stockId, product, marker));

		/**
		 * Считаем "количество" в позиции, если маркеры разделены
		 *
		 * количество = {количество_маркера}+{количество_маркера}...
		 */
		if (!product.dividedMarkers) {
			product.quantity = markers.reduce((sum, marker) => sum + marker.quantity, 0);
		}

		resolve();
	});
};

export const checkMarker = (stockId, product, marker) => {
	return new Promise((resolve, reject) => {
		if (!marker.stock) marker.stock = stockId;

		/**
		 * Считаем "количество" в каждом маркере
		 *
		 * количество = количество упаковок * количество штук в упаковке
		 */
		if (product.receiptUnits === 'nmp' && product.unitIssue === 'pce') {
			marker.quantity = marker.quantityPackages * marker.quantityInUnit;
		}

		/**
		 * Считаем "цену покупки единицы" в позиции
		 *
		 * если "единица поступления" === упаковки и "единица отпуска" === штуки
		 * то:
		 * цена покупки единицы = цена покупки / количество штук в упаковке
		 *
		 * иначе:
		 * цена покупки единицы = цена покупки
		 */
		if (product.receiptUnits === 'nmp' && product.unitIssue === 'pce') {
			marker.unitPurchasePrice = marker.purchasePrice / marker.quantityInUnit;
		} else {
			marker.unitPurchasePrice = marker.purchasePrice;
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
		if (!marker.isFree) {
			if (product.receiptUnits === 'nmp' && product.unitIssue === 'pce') {
				marker.sellingPrice = marker.quantityInUnit * marker.unitSellingPrice;
			} else {
				marker.unitSellingPrice = marker.sellingPrice;
			}
		}

		resolve();
	});
};
