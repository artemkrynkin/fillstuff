import React from 'react';

export const getSteps = ({ showOptionSelectStep = true, status, sellingPositions = false }) => {
	const stepList = [
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
		stepList.unshift({
			index: 0,
			label: 'Вариант закупки',
		});
	}

	if (status === 'received' && sellingPositions) {
		stepList.push({
			index: 2,
			label: 'Формирование цены продажи',
		});
	}
	if (status === 'expected') {
		stepList.push({
			index: 2,
			label: 'Подтверждение доставки',
		});
	}

	return {
		list: stepList,
		options: {
			showOptionSelectStep,
			status,
			sellingPositions: status === 'received' && sellingPositions,
		},
	};
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
