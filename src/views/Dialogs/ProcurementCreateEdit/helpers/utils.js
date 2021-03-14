import React from 'react';
import { v4 as uuidv4 } from 'uuid';

export const helperText = (filedTouched, fieldError) => (filedTouched && typeof fieldError === 'string' ? fieldError : null);

export const getSteps = ({ showOptionSelectStep = true, status, sellingPositions = false }) => {
	const stepList = [
		{
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
			label: 'Вариант закупки',
		});
	}

	if (status === 'received' && sellingPositions) {
		stepList.push({
			label: 'Формирование цены продажи',
		});
	}
	if (status === 'expected') {
		stepList.push({
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

export const receiptInitialValues = ({ position, quantity, ordered } = { ordered: false }) => {
	let defaultValues = {
		id: uuidv4(),
		position,
	};

	if (!ordered) {
		defaultValues = {
			...defaultValues,
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
		};
	} else {
		defaultValues.quantity = quantity || '';
	}

	return defaultValues;
};

export const scrollToDialogElement = (dialogRef, selector, scrollIntoBlock) => {
	if (!dialogRef || !selector || !scrollIntoBlock) return;

	const container = dialogRef?.current?.querySelector(`.${selector}`);

	if (!container) return;

	setTimeout(() => {
		container.scrollIntoView({
			behavior: 'smooth',
			block: scrollIntoBlock,
		});
	}, 0);
};
