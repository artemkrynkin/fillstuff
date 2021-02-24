import React from 'react';
import { v4 as uuidv4 } from 'uuid';

export const helperText = (filedTouched, fieldError) => (filedTouched && typeof fieldError === 'string' ? fieldError : null);

export const getSteps = ({ showOptionSelectStep = true, status, sellingPositions = false }) => {
	const stepList = [
		{
			index: 1,
			label: (
				<>
					Данные о закупке
					<br />и поступлениях
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
	id: uuidv4(),
	position,
	visibleFormationPriceFields: !position.isFree,
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

export const scrollToDialogElement = (dialogRef, selector, scrollIntoBlock) => {
	if (!dialogRef || !selector || !scrollIntoBlock) return;

	const container = dialogRef?.current?.querySelector(`.${selector}`);

	if (!container) return;

	setTimeout(() => {
		container.scrollIntoView({
			behavior: 'smooth',
			block: scrollIntoBlock,
		});
	}, 50);
};
