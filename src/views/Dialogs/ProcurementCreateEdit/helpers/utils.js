import React from 'react';

export const getSteps = ({ showOptionSelectStep = true, status, sellingPositions = false }) => {
	const defaultSteps = [
		{
			index: 1,
			label: (
				<>
					Данные о закупке,
					<br />
					список позиций
				</>
			),
		},
	];

	if (showOptionSelectStep) {
		defaultSteps.unshift({
			index: 0,
			label: 'Вариант закупки',
		});
	}

	if (status === 'received' && sellingPositions) {
		defaultSteps.push({
			index: 2,
			label: 'Формирование цены продажи',
		});
	}
	if (status === 'expected') {
		defaultSteps.push({
			index: 2,
			label: 'Подтверждение доставки',
		});
	}

	return defaultSteps;
};

export const receiptInitialValues = ({ position, quantity }) => ({
	position,
	quantity: position.unitReceipt === 'pce' || position.unitRelease === 'nmp' ? quantity || '' : '',
	quantityPackages: position.unitReceipt === 'pce' || position.unitRelease === 'nmp' ? '' : quantity || '',
	quantityInUnit: '',
	purchasePrice: '',
	unitPurchasePrice: '',
	sellingPrice: '',
	unitSellingPrice: '',
	costDelivery: '',
	unitCostDelivery: '',
	markupPercent: position.lastReceipt ? position.lastReceipt.markupPercent : '',
	markup: '',
	unitMarkup: '',
});

export const scrollToBottomDialog = dialogRefCurrent => {
	const sentinelBottomContainer = dialogRefCurrent?.querySelector('.sentinel-bottom');

	if (!sentinelBottomContainer) return;

	setTimeout(() => {
		sentinelBottomContainer.scrollIntoView({
			behavior: 'smooth',
			block: 'end',
		});
	}, 0);
};
