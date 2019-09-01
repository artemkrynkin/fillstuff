import { characteristicsTypes } from 'shared/checkPositionAndReceipt';

export const onAddCharacteristicInPosition = (position, setFieldValue, arrayHelpersCharacteristics) => {
	arrayHelpersCharacteristics.push(position.characteristicTemp.value);

	setFieldValue('characteristicTemp', {
		type: '',
		value: '',
		valueTemp: '',
	});
};

export const checkCharacteristicsOnAbsenceInPosition = position => {
	return characteristicsTypes.filter(characteristicType => {
		return !position.characteristics.some(characteristic => characteristic.type === characteristicType);
	});
};

export const onUnitSellingPriceCalc = (value, fieldName, position, setFieldValue) => {
	setFieldValue(fieldName, value);

	const checkEmptinessField = position[`${fieldName === 'quantityInUnit' ? 'purchasePrice' : 'quantityInUnit'}`];
	const setValue = fieldName === 'quantityInUnit' ? position.purchasePrice / value : value / position.quantityInUnit;
	const conditionSetValue = !!value && !!checkEmptinessField ? setValue.toFixed(2) : '';

	setFieldValue('unitSellingPrice', conditionSetValue);
};
