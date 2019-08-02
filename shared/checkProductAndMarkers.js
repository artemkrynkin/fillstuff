export const checkProductAndMarkers = (product, markers) => {
	return new Promise((resolve, reject) => {
		product.markers = [];

		markers.forEach(async marker => {
			marker.specifications = marker.specifications.map(marker => marker._id);

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
			marker.unitPurchasePrice =
				product.receiptUnits === 'nmp' && product.unitIssue === 'pce'
					? marker.purchasePrice / marker.quantityInUnit
					: marker.purchasePrice;

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
		});

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

export const checkMarker = (product, marker) => {
	return new Promise((resolve, reject) => {
		marker.specifications = marker.specifications.map(marker => marker._id);

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
		marker.unitPurchasePrice =
			product.receiptUnits === 'nmp' && product.unitIssue === 'pce'
				? marker.purchasePrice / marker.quantityInUnit
				: marker.purchasePrice;

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
